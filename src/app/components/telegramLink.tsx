import React from 'react';

interface TelegramLinkProps {
  url: string;
}

const TelegramLink: React.FC<TelegramLinkProps> = ({ url }) => {
  return (
    <div className="telegram-container">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src="/telegram_logo.svg" alt="Telegram Logo" />
      </a>
      <span className="telegram-text">
        Check Us Out On Telegram
      </span>
      <span className='telegram-text'>
        Daily Menu Updates and Sales
      </span>
    </div>
  );
};

export default TelegramLink;
