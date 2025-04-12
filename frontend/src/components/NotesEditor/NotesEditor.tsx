import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Paper, Title, Button, Group, rem } from '@mantine/core';
import { IconLink, IconPhoto } from '@tabler/icons-react';
import { useState } from 'react';
import './NotesEditor.css';

export function NotesEditor() {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your presentation notes here...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: `
      <h2>My Presentation Notes</h2>
      <p>Start typing here...</p>
    `,
  });

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (isLinkMenuOpen) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setIsLinkMenuOpen(false);
      setLinkUrl('');
    } else {
      const previousUrl = editor?.getAttributes('link').href;
      setLinkUrl(previousUrl || '');
      setIsLinkMenuOpen(true);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{
        width: '100%',
        maxWidth: rem(600),
        minHeight: "500px",
      }}
    >
      <Title order={5} mb="sm">
        Presentation Notes
      </Title>

      {/* Formatting Toolbar */}
      <Group mb="sm" gap={4}>
        <Button
          variant={editor.isActive('bold') ? 'filled' : 'default'}
          size="xs"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'filled' : 'default'}
          size="xs"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Button>
        <Button
          variant={
            editor.isActive('heading', { level: 2 }) ? 'filled' : 'default'
          }
          size="xs"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Button>
        <Button
          variant={editor.isActive('bulletList') ? 'filled' : 'default'}
          size="xs"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconLink size={14} />}
          onClick={setLink}
        >
          Link
        </Button>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconPhoto size={14} />}
          onClick={addImage}
        >
          Image
        </Button>
      </Group>

      {isLinkMenuOpen && (
        <Group mb="sm" gap={4}>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
            }}
          />
          <Button size="xs" onClick={setLink}>
            Apply
          </Button>
        </Group>
      )}

      {/* Editor Content */}
      <div
        style={{
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '8px',
          height: '350px', // Fixed height
          overflowY: 'auto', // Vertical scrolling
          flexGrow: 1,
        }}
      >
        <EditorContent 
          editor={editor}
          
        />
      </div>

      {/* Floating Menu (appears when selecting text) */}
      {editor && (
        <BubbleMenu editor={editor}>
          <Group
            style={{
              backgroundColor: 'white',
              padding: '4px',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
            gap={4}
          >
            <Button
              variant={editor.isActive('bold') ? 'filled' : 'default'}
              size="xs"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'filled' : 'default'}
              size="xs"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </Button>
            <Button
              variant="default"
              size="xs"
              leftSection={<IconLink size={14} />}
              onClick={setLink}
            >
              Link
            </Button>
          </Group>
        </BubbleMenu>
      )}

      {/* Floating Menu (appears when empty line selected) */}
      {editor && (
        <FloatingMenu editor={editor}>
          <Group
            style={{
              backgroundColor: 'white',
              padding: '4px',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
            gap={4}
          >
            <Button
              size="xs"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </Button>
            <Button
              size="xs"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              List
            </Button>
            <Button size="xs" onClick={addImage}>
              Image
            </Button>
          </Group>
        </FloatingMenu>
      )}
    </Paper>
  );
}
