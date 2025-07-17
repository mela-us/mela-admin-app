import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathPreview({ content }) {
  const previewHtml = useMemo(() => {
    if (!content) return '';

    let html = content;
    html = html.replace(/<latex>(.*?)<\/latex>/g, (match, latex) => {
      try {
        return katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false,
        });
      } catch (error) {
        return `<span class="inline-block px-2 py-1 bg-red-100 text-red-800 rounded">Lỗi LaTeX: ${error.message}</span>`;
      }
    });

    html = html.replace(/<br>/g, '<br />');
    return html;
  }, [content]);

  return (
    <div
      className="p-3 bg-inherit rounded-md text-sm overflow-auto [&_img]:max-w-[300px] [&_img]:max-h-[300px] [&_img]:object-contain [&_img]:inline-block [&_img]:align-bottom"
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        position: 'relative',
      }}
      dangerouslySetInnerHTML={{ __html: previewHtml }}
    />
  );
}
