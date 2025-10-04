import React from 'react';
import { FormattedContent } from '../../types';

interface FormattedTextDisplayProps {
  text: string;
  formattedContent?: FormattedContent;
  className?: string;
}

export function FormattedTextDisplay({ text, formattedContent, className = '' }: FormattedTextDisplayProps) {
  if (!formattedContent || !formattedContent.blocks || formattedContent.blocks.length === 0) {
    return <p className={`text-gray-700 whitespace-pre-wrap ${className}`}>{text}</p>;
  }

  return (
    <div className={`text-gray-700 ${className}`}>
      {formattedContent.blocks.map((block, index) => {
        if (block.type === 'list' && block.items) {
          return (
            <ul key={index} className="list-disc list-inside space-y-1 my-2">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'text' && block.content) {
          const hasBold = block.formatting?.includes('bold');
          const hasItalic = block.formatting?.includes('italic');

          let content = <span>{block.content}</span>;

          if (hasBold && hasItalic) {
            content = <strong className="font-bold"><em className="italic">{block.content}</em></strong>;
          } else if (hasBold) {
            content = <strong className="font-bold">{block.content}</strong>;
          } else if (hasItalic) {
            content = <em className="italic">{block.content}</em>;
          }

          return (
            <p key={index} className="my-1">
              {content}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
