<template>
  <div class="tiptap-content" v-html="renderedHtml" />
</template>

<script setup lang="ts">
import { generateHTML } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const props = defineProps<{
  content: string
}>()

const extensions = [
  StarterKit,
  Image,
  Youtube.configure({ width: 640, height: 360 }),
  Link.configure({ openOnClick: true }),
  Highlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
]

const renderedHtml = computed(() => {
  try {
    const json = JSON.parse(props.content)
    return generateHTML(json, extensions)
  } catch {
    return '<p>Unable to render content.</p>'
  }
})
</script>

<style>
.tiptap-content h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; font-family: var(--font-heading); }
.tiptap-content h3 { font-size: 1.25rem; font-weight: 700; margin: 1.25rem 0 0.5rem; font-family: var(--font-heading); }
.tiptap-content h4 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; font-family: var(--font-heading); }
.tiptap-content p { margin: 0.75rem 0; line-height: 1.7; }
.tiptap-content ul, .tiptap-content ol { padding-left: 1.5rem; margin: 0.75rem 0; }
.tiptap-content li { margin: 0.25rem 0; }
.tiptap-content ul { list-style: disc; }
.tiptap-content ol { list-style: decimal; }
.tiptap-content blockquote { border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; color: var(--muted-foreground); }
.tiptap-content code { background: var(--muted); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; }
.tiptap-content a { color: var(--primary); text-decoration: underline; }
.tiptap-content img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
.tiptap-content hr { border-color: var(--border); margin: 1.5rem 0; }
.tiptap-content mark { background-color: rgba(45, 157, 120, 0.3); padding: 0.1rem 0.2rem; border-radius: 0.15rem; }
.tiptap-content iframe { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
</style>
