import React from 'react';
import { Bold, Italic, List } from 'lucide-react';

interface FormattingToolbarProps {
  onFormat: (type: 'bold' | 'italic' | 'list') => void;
  disabled?: boolean;
}

export function FormattingToolbar({ onFormat, disabled = false }: FormattingToolbarProps) {
  const buttonClass = `p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <div className="flex items-center space-x-1 border-b border-gray-200 pb-2 mb-2">
      <button
        type="button"
        onClick={() => onFormat('bold')}
        disabled={disabled}
        className={buttonClass}
        title="Bold (Ctrl+B)"
        aria-label="Bold"
      >
        <Bold className="w-4 h-4 text-gray-700" />
      </button>
      <button
        type="button"
        onClick={() => onFormat('italic')}
        disabled={disabled}
        className={buttonClass}
        title="Italic (Ctrl+I)"
        aria-label="Italic"
      >
        <Italic className="w-4 h-4 text-gray-700" />
      </button>
      <button
        type="button"
        onClick={() => onFormat('list')}
        disabled={disabled}
        className={buttonClass}
        title="List"
        aria-label="List"
      >
        <List className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
}
