import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FaqItem } from '../../content/about';
import { toggleAccordionItem } from './aboutUtils';
import './FaqAccordion.css';

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => toggleAccordionItem(prev, id));
  };

  return (
    <div className="faq-accordion" role="presentation">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `faq-btn-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div key={item.id} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <h3 className="faq-question-heading">
              <button
                type="button"
                id={buttonId}
                className="faq-trigger"
                onClick={() => handleToggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="faq-question-text">
                  <HelpCircle size={15} className="faq-question-icon" aria-hidden="true" />
                  <span>{item.question}</span>
                </span>
                <span className="faq-chevron" aria-hidden="true">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="faq-panel"
              >
                <p className="faq-answer-text">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
