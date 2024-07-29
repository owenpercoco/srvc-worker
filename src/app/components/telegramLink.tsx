import React from 'react';
import TelegramLogo from './telegramLogo'
interface TelegramLinkProps {
  url: string;
}

const TelegramLink: React.FC<TelegramLinkProps> = ({ url }) => {
  return (
    <div className="telegram-container">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <TelegramLogo/>
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
