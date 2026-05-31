'use client'; // ← only change needed

import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon } from 'lucide-react';

const MenuBar = ({ editor }) => {
    const fileInputRef = useRef(null);

    if (!editor) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Please select an image smaller than 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                editor.chain().focus().setImage({ src: reader.result }).run();
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const activeClass = "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    const inactiveClass = "text-zinc-500 hover:text-purple-300 hover:bg-white/5 border border-transparent";

    return (
        <div className="flex flex-wrap gap-2 p-3 bg-[#030305] border-b border-white/5 rounded-t-xl">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('bold') ? activeClass : inactiveClass}`} title="Bold">
                <Bold size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('italic') ? activeClass : inactiveClass}`} title="Italic">
                <Italic size={18} />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('strike') ? activeClass : inactiveClass}`} title="Strikethrough">
                <Strikethrough size={18} />
            </button>

            <div className="w-[1px] bg-white/5 mx-1 my-1" />

            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg transition-all font-bold text-sm ${editor.isActive('heading', { level: 2 }) ? activeClass : inactiveClass}`} title="Heading 2">H2</button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded-lg transition-all font-bold text-sm ${editor.isActive('heading', { level: 3 }) ? activeClass : inactiveClass}`} title="Heading 3">H3</button>

            <div className="w-[1px] bg-white/5 mx-1 my-1" />

            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('bulletList') ? activeClass : inactiveClass}`} title="Bullet List"><List size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('orderedList') ? activeClass : inactiveClass}`} title="Numbered List"><ListOrdered size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded-lg transition-all ${editor.isActive('blockquote') ? activeClass : inactiveClass}`} title="Quote Block"><Quote size={18} /></button>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-2 rounded-lg transition-all ${inactiveClass}`} title="Insert Image"><ImageIcon size={18} /></button>

            <div className="w-[1px] bg-white/5 mx-1 my-1" />

            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="p-2 rounded-lg transition-all text-zinc-600 hover:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed" title="Undo"><Undo size={18} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="p-2 rounded-lg transition-all text-zinc-600 hover:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed" title="Redo"><Redo size={18} /></button>
        </div>
    );
};

const TiptapEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: { class: 'rounded-xl border border-white/10 max-w-full my-6' },
            }),
        ],
        content: (() => {
            try {
                if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
                    return JSON.parse(content);
                }
            } catch (e) {
                console.warn("Failed to parse content as JSON, treating as HTML");
            }
            return content;
        })(),
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-purple max-w-none focus:outline-none min-h-[400px] p-6 bg-[#030305]/50 rounded-b-xl transition-all',
            },
        },
    });

    return (
        <div className="w-full flex flex-col rounded-xl overflow-hidden border border-white/10 focus-within:border-purple-500/50 transition-colors shadow-inner">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;