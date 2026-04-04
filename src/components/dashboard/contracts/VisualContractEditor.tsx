"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Save,
    Type
} from "lucide-react"
import { useEffect, forwardRef, useImperativeHandle } from "react"

interface VisualEditorProps {
    initialContent?: string
    onSave: (html: string) => void
    isSaving?: boolean
    onUpdate?: (html: string) => void
}

export interface VisualEditorRef {
    insertContent: (text: string) => void
}

export const VisualContractEditor = forwardRef<VisualEditorRef, VisualEditorProps>(({
    initialContent = "",
    onSave,
    isSaving,
    onUpdate
}, ref) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[900px] max-w-[850px] border border-white/5 rounded-none p-16 sm:p-24 bg-white text-black shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)]',
            },
        },
        editable: true,
        onUpdate: ({ editor }) => {
            if (onUpdate) {
                onUpdate(editor.getHTML())
            }
        }
    })

    useImperativeHandle(ref, () => ({
        insertContent: (text: string) => {
            if (editor) {
                editor.chain().focus().insertContent(text).run()
            }
        }
    }))

    useEffect(() => {
        if (editor && initialContent && editor.getHTML() !== initialContent) {
            if (editor.isEmpty) editor.commands.setContent(initialContent)
        }
    }, [initialContent, editor])

    if (!editor) {
        return null
    }

    return (
        <div className="space-y-4">
            <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border border-white/10 p-2 rounded-none bg-black backdrop-blur-md shadow-2xl">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-white/5 mx-2" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-white/5 mx-2" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    className="h-10 w-10 p-0 rounded-none border border-white/5 text-zinc-500 data-[state=on]:bg-white/10 data-[state=on]:text-white hover:bg-white/5 transition-all"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>

                <div className="ml-auto flex items-center gap-3 pr-2">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-10 gap-3 px-4 rounded-none border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <Type className="h-3.5 w-3.5" />
                        PLACEHOLDER
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={() => onSave(editor.getHTML())} 
                        disabled={isSaving} 
                        className="h-10 gap-3 px-6 rounded-none bg-[#ccff00] text-black hover:bg-white text-[10px] font-black uppercase tracking-[0.3em] border-0 transition-all active:scale-95"
                    >
                        <Save className="h-3.5 w-3.5" />
                        {isSaving ? "PROCESSANDO..." : "SALVAR"}
                    </Button>
                </div>
            </div>

            <div className="bg-zinc-950/50 p-8 sm:p-12 border border-white/5 shadow-inner">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
})

VisualContractEditor.displayName = "VisualContractEditor"
