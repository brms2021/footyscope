<template>
  <div class="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
    <!-- Text formatting -->
    <div class="flex items-center gap-0.5">
      <button
        v-for="action in textActions"
        :key="action.name"
        @click="action.command"
        :class="[toolbarBtnClass, action.isActive?.() ? 'bg-accent text-accent-foreground' : '']"
        :title="action.name"
      >
        <component :is="action.icon" class="h-4 w-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-border mx-1" />

    <!-- Headings -->
    <div class="flex items-center gap-0.5">
      <button
        v-for="level in [2, 3, 4]"
        :key="level"
        @click="editor?.chain().focus().toggleHeading({ level: level as 2|3|4 }).run()"
        :class="[toolbarBtnClass, editor?.isActive('heading', { level }) ? 'bg-accent text-accent-foreground' : '']"
        :title="`Heading ${level}`"
      >
        <span class="text-xs font-bold">H{{ level }}</span>
      </button>
    </div>

    <div class="w-px h-6 bg-border mx-1" />

    <!-- Lists -->
    <div class="flex items-center gap-0.5">
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="[toolbarBtnClass, editor?.isActive('bulletList') ? 'bg-accent text-accent-foreground' : '']"
        title="Bullet list"
      >
        <List class="h-4 w-4" />
      </button>
      <button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="[toolbarBtnClass, editor?.isActive('orderedList') ? 'bg-accent text-accent-foreground' : '']"
        title="Ordered list"
      >
        <ListOrdered class="h-4 w-4" />
      </button>
      <button
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="[toolbarBtnClass, editor?.isActive('blockquote') ? 'bg-accent text-accent-foreground' : '']"
        title="Blockquote"
      >
        <Quote class="h-4 w-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-border mx-1" />

    <!-- Alignment -->
    <div class="flex items-center gap-0.5">
      <button
        v-for="align in alignActions"
        :key="align.name"
        @click="align.command"
        :class="[toolbarBtnClass, align.isActive?.() ? 'bg-accent text-accent-foreground' : '']"
        :title="align.name"
      >
        <component :is="align.icon" class="h-4 w-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-border mx-1" />

    <!-- Insert -->
    <div class="flex items-center gap-0.5">
      <button @click="addLink" :class="[toolbarBtnClass, editor?.isActive('link') ? 'bg-accent text-accent-foreground' : '']" title="Link">
        <LinkIcon class="h-4 w-4" />
      </button>
      <button @click="addImage" :class="toolbarBtnClass" title="Image">
        <ImageIcon class="h-4 w-4" />
      </button>
      <button @click="addYoutube" :class="toolbarBtnClass" title="YouTube video">
        <Youtube class="h-4 w-4" />
      </button>
      <button @click="editor?.chain().focus().setHorizontalRule().run()" :class="toolbarBtnClass" title="Horizontal rule">
        <Minus class="h-4 w-4" />
      </button>
    </div>

    <div class="w-px h-6 bg-border mx-1" />

    <!-- Undo/Redo -->
    <div class="flex items-center gap-0.5">
      <button @click="editor?.chain().focus().undo().run()" :disabled="!editor?.can().undo()" :class="toolbarBtnClass" title="Undo">
        <Undo class="h-4 w-4" />
      </button>
      <button @click="editor?.chain().focus().redo().run()" :disabled="!editor?.can().redo()" :class="toolbarBtnClass" title="Redo">
        <Redo class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter, Code,
  List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon, Youtube, Minus,
  Undo, Redo,
} from 'lucide-vue-next'

const props = defineProps<{ editor: Editor | undefined }>()

const toolbarBtnClass = 'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30'

const textActions = computed(() => [
  { name: 'Bold', icon: Bold, command: () => props.editor?.chain().focus().toggleBold().run(), isActive: () => props.editor?.isActive('bold') },
  { name: 'Italic', icon: Italic, command: () => props.editor?.chain().focus().toggleItalic().run(), isActive: () => props.editor?.isActive('italic') },
  { name: 'Underline', icon: UnderlineIcon, command: () => props.editor?.chain().focus().toggleUnderline().run(), isActive: () => props.editor?.isActive('underline') },
  { name: 'Strikethrough', icon: Strikethrough, command: () => props.editor?.chain().focus().toggleStrike().run(), isActive: () => props.editor?.isActive('strike') },
  { name: 'Highlight', icon: Highlighter, command: () => props.editor?.chain().focus().toggleHighlight().run(), isActive: () => props.editor?.isActive('highlight') },
  { name: 'Code', icon: Code, command: () => props.editor?.chain().focus().toggleCode().run(), isActive: () => props.editor?.isActive('code') },
])

const alignActions = computed(() => [
  { name: 'Align left', icon: AlignLeft, command: () => props.editor?.chain().focus().setTextAlign('left').run(), isActive: () => props.editor?.isActive({ textAlign: 'left' }) },
  { name: 'Align center', icon: AlignCenter, command: () => props.editor?.chain().focus().setTextAlign('center').run(), isActive: () => props.editor?.isActive({ textAlign: 'center' }) },
  { name: 'Align right', icon: AlignRight, command: () => props.editor?.chain().focus().setTextAlign('right').run(), isActive: () => props.editor?.isActive({ textAlign: 'right' }) },
])

function addLink() {
  const url = window.prompt('Enter URL:')
  if (url) {
    props.editor?.chain().focus().setLink({ href: url }).run()
  }
}

function addImage() {
  const url = window.prompt('Enter image URL:')
  if (url) {
    props.editor?.chain().focus().setImage({ src: url }).run()
  }
}

function addYoutube() {
  const url = window.prompt('Enter YouTube URL:')
  if (url) {
    props.editor?.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}
</script>
