import React from 'react';
import TelegramLogo from './telegramLogo'
interface TelegramLinkProps {
  url: string;
}

const TelegramLink = ({ url }: TelegramLinkProps) => {
  return (
    <a href={url} className="telegram-link" target="_blank" rel="noopener noreferrer">
    <div className="telegram-container column">
      <span className="telegram-text">
        Order now on Telegram
      </span>
      <span className="telegram-text">
        A secure messaging app
      </span>
        <TelegramLogo/>

      <span className='telegram-text'>
        Daily Menu Updates and Sales
      </span>
      <span className='telegram-text'>
       Click Here to Order Now
      </span>
    </div>
    </a>
  );
};

export default TelegramLink;
