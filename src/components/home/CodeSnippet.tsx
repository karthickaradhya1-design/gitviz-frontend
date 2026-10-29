import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CodeSnippet.css';

export interface CodeSnippetProps {
  code: string;
  label?: string;
  className?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  label,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for environments where navigator.clipboard is unavailable
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Failed to copy
    }
  };

  return (
    <div className={`code-snippet-wrapper ${className}`.trim()}>
      {label && <span className="code-snippet-label">{label}</span>}
      <div className="code-snippet-box">
        <code className="code-snippet-text">{code}</code>
        <button
          type="button"
          onClick={handleCopy}
          className={`code-snippet-copy-btn ${copied ? 'is-copied' : ''}`}
          aria-label={copied ? 'Copied to clipboard' : `Copy "${code}" to clipboard`}
          title={copied ? 'Copied' : 'Copy'}
        >
          {copied ? (
            <>
              <Check size={12} aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
        {/* Accessible live region announcement */}
        <span className="sr-only" aria-live="polite">
          {copied ? 'Code snippet copied to clipboard' : ''}
        </span>
      </div>
    </div>
  );
};
