#!/usr/bin/env node
const { execSync } = require('child_process')
const { existsSync, readFileSync, writeFileSync } = require('fs')
const path = require('path')

const serverDir = path.resolve(__dirname, '../.output/server')
const pkgPath = path.join(serverDir, 'package.json')

if (!existsSync(pkgPath)) {
  console.log('[prepare-deploy] No server output found, skipping')
  process.exit(0)
}

console.log('[prepare-deploy] Preparing server for deployment...')

// Fix: ensure main field points to index.mjs
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.main = pkg.main || 'index.mjs'
if (!pkg.engines) pkg.engines = { node: '>=20' }
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

// Use npm v10 compatible install — the node_modules are already bundled by Nitro
// We only need to ensure firebase-functions + firebase-admin exist for the CLI
const ffDir = path.join(serverDir, 'node_modules', 'firebase-functions')
if (!existsSync(ffDir)) {
  console.log('[prepare-deploy] Installing firebase-functions...')
  execSync('npm install firebase-functions firebase-admin --no-save --ignore-scripts', {
    cwd: serverDir,
    stdio: 'inherit',
    env: { ...process.env, npm_config_package_lock: 'false' },
  })
}

// Generate lockfile for Cloud Build
const lockPath = path.join(serverDir, 'package-lock.json')
if (!existsSync(lockPath)) {
  console.log('[prepare-deploy] Generating package-lock.json...')
  // Create a minimal lockfile that satisfies npm ci
  const lockfile = {
    name: pkg.name,
    version: pkg.version,
    lockfileVersion: 3,
    requires: true,
    packages: { '': { name: pkg.name, version: pkg.version, dependencies: pkg.dependencies } },
  }
  writeFileSync(lockPath, JSON.stringify(lockfile, null, 2))
}

console.log('[prepare-deploy] ✓ Ready for deployment')
