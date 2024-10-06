import React from 'react';
import TelegramLogo from './telegramLogo'
interface TelegramLinkProps {
  url: string;
}

const TelegramLink = ({ url }: TelegramLinkProps) => {
  return (
    <a href={url} className="telegram-link" target="_blank" rel="noopener noreferrer">
      <div className="telegram-container column">
        <div className="row">
          <div className='column'>
            <span className="telegram-text">
              Follow Us On Telegram
            </span>
            <span className="telegram-text">
              A secure messaging app
            </span>
            <span className='telegram-text'>
              Daily Menu Updates and Sales
            </span>
          </div> 
          <TelegramLogo/>
        </div>
      </div>
    </a>
  );
};

export default TelegramLink;
