'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CodeTool from '@editorjs/code';
import Underline from '@editorjs/underline';
import SimpleImage from '@editorjs/simple-image';

interface EditorJsEditorProps {
  placeholder?: string;
  value?: string;
  onChange?: (markdown: string) => void;
  error?: boolean;
  className?: string;
}

export interface EditorJsEditorRef {
  getMarkdown: () => Promise<string>;
  getJSON: () => Promise<OutputData>;
  setContent: (content: OutputData) => void;
  focus: () => void;
}

// Convert Editor.js output to markdown
const convertToMarkdown = (data: OutputData): string => {
  if (!data.blocks) return '';

  return data.blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.data?.text || '';

      case 'header':
        const level = block.data?.level || 1;
        const headerText = block.data?.text || '';
        return `${'#'.repeat(level)} ${headerText}`;

      case 'list':
        const items = block.data?.items || [];
        const style = block.data?.style || 'unordered';
        return items.map((item: string, index: number) => {
          if (style === 'ordered') {
            return `${index + 1}. ${item}`;
          } else {
            return `- ${item}`;
          }
        }).join('\n');

      case 'quote':
        const quoteText = block.data?.text || '';
        const caption = block.data?.caption || '';
        let result = `> ${quoteText}`;
        if (caption) {
          result += `\n> \n> — ${caption}`;
        }
        return result;

      case 'code':
        const code = block.data?.code || '';
        return `\`\`\`\n${code}\n\`\`\``;

      case 'delimiter':
        return '---';

      case 'image':
        const url = block.data?.url || '';
        const alt = block.data?.caption || 'image';
        return `![${alt}](${url})`;

      default:
        // Handle text with inline formatting
        let text = block.data?.text || '';

        // Convert HTML tags to markdown
        text = text.replace(/<mark>/g, '==').replace(/<\/mark>/g, '==');
        text = text.replace(/<u>/g, '').replace(/<\/u>/g, ''); // Underline not standard in markdown
        text = text.replace(/<b>/g, '**').replace(/<\/b>/g, '**');
        text = text.replace(/<strong>/g, '**').replace(/<\/strong>/g, '**');
        text = text.replace(/<i>/g, '*').replace(/<\/i>/g, '*');
        text = text.replace(/<em>/g, '*').replace(/<\/em>/g, '*');
        text = text.replace(/<code>/g, '`').replace(/<\/code>/g, '`');

        return text;
    }
  }).join('\n\n');
};

// Global tracking to prevent multiple instances in React Strict Mode
const globalEditorInstances = new Set<string>();

const EditorJsEditor = forwardRef<EditorJsEditorRef, EditorJsEditorProps>(
  ({ placeholder = 'Start typing your story...', value = '', onChange, error = false, className }, ref) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const isInitializedRef = useRef(false);
    const isInitializingRef = useRef(false);
    const editorIdRef = useRef(`editor-${Math.random().toString(36).substr(2, 9)}`);

    // Initialize Editor.js
    useEffect(() => {
      if (!holderRef.current || isInitializedRef.current || isInitializingRef.current) return;

      // Check if this editor ID is already being initialized (React Strict Mode protection)
      if (globalEditorInstances.has(editorIdRef.current)) return;

      const initializeEditor = async () => {
        try {
          isInitializingRef.current = true;
          globalEditorInstances.add(editorIdRef.current);

          // Clear any existing content in the holder and set unique ID
          if (holderRef.current) {
            holderRef.current.innerHTML = '';
            holderRef.current.id = editorIdRef.current;
          }

          const editor = new EditorJS({
            holder: editorIdRef.current,
            placeholder,
            minHeight: 50,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tools: {
              header: {
                class: Header as any,
                config: {
                  levels: [1, 2, 3, 4],
                  defaultLevel: 2,
                }
              },
              list: {
                class: List as any,
                inlineToolbar: true,
                config: {
                  defaultStyle: 'unordered'
                }
              },
              paragraph: {
                class: Paragraph as any,
                inlineToolbar: true,
              },
              quote: {
                class: Quote as any,
                inlineToolbar: true,
                config: {
                  quotePlaceholder: 'Enter a quote',
                  captionPlaceholder: 'Quote\'s author',
                },
              },
              marker: {
                class: Marker as any,
              },
              code: {
                class: CodeTool as any,
                config: {
                  placeholder: 'Enter code here...'
                }
              },
              underline: Underline as any,
              delimiter: Delimiter as any,
              image: {
                class: SimpleImage as any,
                config: {
                  placeholder: 'Paste image URL'
                }
              }
            },
            // Don't provide any initial data - let Editor.js create a clean empty block
            data: value && value.trim() ? JSON.parse(value) : undefined,
            onChange: async () => {
              if (!isInitializedRef.current) return;
              try {
                const outputData = await editor.save();
                const markdown = convertToMarkdown(outputData);
                onChange?.(markdown);
              } catch (error) {
                console.error('Error saving editor data:', error);
              }
            },
            onReady: () => {
              console.log('Editor.js is ready!');
              isInitializedRef.current = true;
              isInitializingRef.current = false;
            },
          });

          await editor.isReady;
          editorRef.current = editor;
        } catch (error) {
          console.error('Error initializing Editor.js:', error);
          isInitializingRef.current = false;
          globalEditorInstances.delete(editorIdRef.current);
        }
      };

      // Use setTimeout to ensure DOM is fully ready
      const timer = setTimeout(initializeEditor, 100);

      return () => {
        clearTimeout(timer);
        globalEditorInstances.delete(editorIdRef.current);
        if (editorRef.current && typeof editorRef.current.destroy === 'function') {
          try {
            editorRef.current.destroy();
          } catch (error) {
            console.error('Error destroying editor:', error);
          }
          editorRef.current = null;
        }
        isInitializedRef.current = false;
        isInitializingRef.current = false;
      };
    }, []);

    // Update content when value prop changes (but only after initialization)
    useEffect(() => {
      if (editorRef.current && value && isInitializedRef.current && !isInitializingRef.current) {
        try {
          const data = JSON.parse(value);
          editorRef.current.render(data);
        } catch (error) {
          console.error('Error updating editor content:', error);
        }
      }
    }, [value]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getMarkdown: async () => {
        if (!editorRef.current) return '';
        try {
          const outputData = await editorRef.current.save();
          return convertToMarkdown(outputData);
        } catch (error) {
          console.error('Error getting markdown:', error);
          return '';
        }
      },
      getJSON: async () => {
        if (!editorRef.current) return { blocks: [], version: '', time: 0 };
        try {
          return await editorRef.current.save();
        } catch (error) {
          console.error('Error getting JSON:', error);
          return { blocks: [], version: '', time: 0 };
        }
      },
      setContent: (content: OutputData) => {
        if (editorRef.current) {
          editorRef.current.render(content);
        }
      },
      focus: () => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      },
    }));

    return (
      <div className={`w-full ${className || ''}`}>
        <div
          ref={holderRef}
          className={`bg-gray-700 border rounded-lg min-h-[300px] ${
            error ? 'border-red-500' : 'border-gray-600 focus-within:border-red-500'
          }`}
          style={{
            // Custom styles for Editor.js
            '--color-text-primary': '#ffffff',
            '--color-text-secondary': '#d1d5db',
            '--color-background': '#374151',
            '--color-border': '#4b5563',
            '--color-accent': '#ef4444',
          } as React.CSSProperties}
        />

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>
            💡 Click + to add blocks, press Tab for toolbar, select text for inline formatting
          </span>
          <span className="text-gray-500">
            Content will be saved as markdown
          </span>
        </div>

        {/* Custom CSS for Editor.js theming */}
        <style jsx>{`
          :global(.ce-block__content) {
            color: #ffffff;
            background: transparent;
          }

          :global(.ce-paragraph) {
            color: #d1d5db;
            line-height: 1.6;
          }

          :global(.ce-header) {
            color: #ffffff;
            font-weight: bold;
          }

          :global(.ce-quote) {
            border-left: 3px solid #ef4444;
            background: rgba(239, 68, 68, 0.1);
            color: #d1d5db;
          }

          :global(.ce-code) {
            background: #1f2937;
            border: 1px solid #4b5563;
            color: #d1d5db;
          }

          :global(.ce-toolbar__content) {
            background: #1f2937;
            border: 1px solid #4b5563;
          }

          :global(.ce-toolbar__plus) {
            background: #ef4444;
            color: white;
          }

          :global(.ce-toolbar__plus:hover) {
            background: #dc2626;
          }

          :global(.ce-popover) {
            background: #1f2937;
            border: 1px solid #4b5563;
            color: #ffffff;
          }

          :global(.ce-popover__item) {
            color: #d1d5db;
          }

          :global(.ce-popover__item:hover) {
            background: #374151;
            color: #ffffff;
          }

          :global(.ce-inline-toolbar) {
            background: #1f2937;
            border: 1px solid #4b5563;
          }

          :global(.ce-inline-tool) {
            color: #d1d5db;
          }

          :global(.ce-inline-tool:hover) {
            background: #374151;
            color: #ffffff;
          }

          :global(.ce-inline-tool--active) {
            background: #ef4444;
            color: #ffffff;
          }

          :global(.cdx-marker) {
            background: #fde047;
            color: #000000;
          }

          :global(.cdx-underline) {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }
);

EditorJsEditor.displayName = 'EditorJsEditor';

export default EditorJsEditor;