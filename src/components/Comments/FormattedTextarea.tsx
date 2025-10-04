import React, { useRef, KeyboardEvent } from 'react';
import { FormattingToolbar } from './FormattingToolbar';
import { FormattedContent } from '../../types';

interface FormattedTextareaProps {
  value: string;
  onChange: (value: string, formattedContent: FormattedContent) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export function FormattedTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  disabled = false
}: FormattedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parseTextToFormatted = (text: string): FormattedContent => {
    const lines = text.split('\n');
    const blocks: FormattedContent['blocks'] = [];
    let currentList: string[] = [];

    for (const line of lines) {
      if (line.trim().startsWith('- ')) {
        currentList.push(line.trim().substring(2));
      } else {
        if (currentList.length > 0) {
          blocks.push({
            type: 'list',
            items: currentList
          });
          currentList = [];
        }

        if (line.trim()) {
          const formatting: Array<'bold' | 'italic'> = [];
          let content = line;

          const boldRegex = /\*\*(.+?)\*\*/g;
          const italicRegex = /\*(.+?)\*/g;

          if (boldRegex.test(line)) {
            formatting.push('bold');
            content = content.replace(/\*\*/g, '');
          }

          if (italicRegex.test(line) && !boldRegex.test(line)) {
            formatting.push('italic');
            content = content.replace(/\*/g, '');
          }

          blocks.push({
            type: 'text',
            content: content,
            formatting: formatting.length > 0 ? formatting : undefined
          });
        }
      }
    }

    if (currentList.length > 0) {
      blocks.push({
        type: 'list',
        items: currentList
      });
    }

    return {
      version: 1,
      blocks
    };
  };

  const handleFormat = (type: 'bold' | 'italic' | 'list') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (!selectedText) return;

    let newText = value;
    let newCursorPos = end;

    switch (type) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'list':
        const lines = selectedText.split('\n');
        const formattedLines = lines.map(line => `- ${line}`).join('\n');
        newText = value.substring(0, start) + formattedLines + value.substring(end);
        newCursorPos = end + (formattedLines.length - selectedText.length);
        break;
    }

    const formattedContent = parseTextToFormatted(newText);
    onChange(newText, formattedContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        handleFormat('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        handleFormat('italic');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const formattedContent = parseTextToFormatted(newValue);
    onChange(newValue, formattedContent);
  };

  return (
    <div className={className}>
      <FormattingToolbar onFormat={handleFormat} disabled={disabled} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
      <div className="mt-1 text-xs text-gray-500">
        Tip: Use **bold**, *italic*, or select text and use toolbar buttons. Start lines with "- " for lists.
      </div>
    </div>
  );
}
