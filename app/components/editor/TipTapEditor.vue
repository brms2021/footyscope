<template>
  <div class="rounded-lg border border-border overflow-hidden bg-card">
    <EditorToolbar :editor="editor" />
    <EditorContent :editor="editor" class="tiptap-editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue ? JSON.parse(props.modelValue) : undefined,
  extensions: [
    StarterKit,
    Image.configure({ inline: false, allowBase64: true }),
    Youtube.configure({ width: 640, height: 360 }),
    Link.configure({ openOnClick: false }),
    Highlight,
    Placeholder.configure({ placeholder: props.placeholder ?? 'Start writing...' }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-invert max-w-none px-6 py-4 min-h-[300px] focus:outline-none',
    },
  },
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', JSON.stringify(e.getJSON()))
  },
})

watch(() => props.modelValue, (val) => {
  if (!editor.value) return
  const current = JSON.stringify(editor.value.getJSON())
  if (val !== current) {
    editor.value.commands.setContent(val ? JSON.parse(val) : null)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.tiptap-editor .ProseMirror {
  min-height: 300px;
}
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--muted-foreground);
  pointer-events: none;
  height: 0;
}
.tiptap-editor .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; font-family: var(--font-heading); }
.tiptap-editor .ProseMirror h3 { font-size: 1.25rem; font-weight: 700; margin: 1.25rem 0 0.5rem; font-family: var(--font-heading); }
.tiptap-editor .ProseMirror h4 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; font-family: var(--font-heading); }
.tiptap-editor .ProseMirror p { margin: 0.75rem 0; line-height: 1.7; }
.tiptap-editor .ProseMirror ul, .tiptap-editor .ProseMirror ol { padding-left: 1.5rem; margin: 0.75rem 0; }
.tiptap-editor .ProseMirror li { margin: 0.25rem 0; }
.tiptap-editor .ProseMirror ul { list-style: disc; }
.tiptap-editor .ProseMirror ol { list-style: decimal; }
.tiptap-editor .ProseMirror blockquote { border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; color: var(--muted-foreground); }
.tiptap-editor .ProseMirror code { background: var(--muted); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; }
.tiptap-editor .ProseMirror a { color: var(--primary); text-decoration: underline; }
.tiptap-editor .ProseMirror img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
.tiptap-editor .ProseMirror hr { border-color: var(--border); margin: 1.5rem 0; }
.tiptap-editor .ProseMirror mark { background-color: rgba(45, 157, 120, 0.3); padding: 0.1rem 0.2rem; border-radius: 0.15rem; }
.tiptap-editor .ProseMirror iframe { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
</style>
