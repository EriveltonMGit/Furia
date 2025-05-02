import React from 'react';
import Link from 'next/link';

export const FormattedMessage = ({ text }: { text: string }) => {
  // Detecta links markdown [texto](URL)
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/\[.*?\]\(.*?\)/)) {
          const [_, text, url] = part.match(/\[(.*?)\]\((.*?)\)/) || [];
          return (
            <Link key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
              {text}
            </Link>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};