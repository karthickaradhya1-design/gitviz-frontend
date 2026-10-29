import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { parseDiff } from './historyUtils';
import './DiffPreview.css';

interface DiffPreviewProps {
  diff?: string;
  className?: string;
}

export const DiffPreview: React.FC<DiffPreviewProps> = ({ diff, className = '' }) => {
  const [copied, setCopied] = useState(false);

  if (!diff) {
    return (
      <div className={`diff-empty ${className}`.trim()}>
        <span className="diff-empty-text">No diff available for this commit.</span>
      </div>
    );
  }

  const lines = parseDiff(diff);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(diff);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(false);
    }
  };

  return (
    <div className={`diff-preview-container ${className}`.trim()}>
      <div className="diff-header">
        <span className="diff-header-title">Changes in this commit</span>
        <button
          type="button"
          className="diff-copy-btn"
          onClick={handleCopy}
          aria-label={copied ? 'Diff copied to clipboard' : 'Copy unified diff'}
        >
          {copied ? (
            <>
              <Check size={13} className="diff-copy-icon" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} className="diff-copy-icon" aria-hidden="true" />
              <span>Copy diff</span>
            </>
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Unified diff copied to clipboard' : ''}
        </span>
      </div>

      <div className="diff-code-wrapper" tabIndex={0} role="region" aria-label="Diff contents">
        <pre className="diff-pre">
          <code>
            {lines.map((line, index) => (
              <div
                key={index}
                className={`diff-line diff-line-${line.type}`}
              >
                <span className="diff-line-number" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="diff-line-content">{line.content}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
