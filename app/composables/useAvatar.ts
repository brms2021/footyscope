export function getAvatarUrl(name: string, size: number = 128): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1a2332&textColor=2d9d78&fontSize=36&size=${size}`
}

export function getPlayerImage(photoUrl: string | null | undefined, name: string, size: number = 128): string {
  return photoUrl || getAvatarUrl(name, size)
}
