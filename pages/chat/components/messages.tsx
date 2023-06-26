import React from 'react';
import style from './messages.module.css';

interface MyComponentProps {
  text: string;
  sent: boolean;
}

const Message: React.FC<MyComponentProps> = ({ text, sent }) => {
  if (sent == false)
  {return (
    <div className={style.messageContainer}>
      <div className={style.receivedMessageContainer}>
        <p className={style.otherchat}>{text}</p>
        <p className={style.receivedtime}>Time</p>
      </div>
    </div>
  );}
  else{
    return(<div className={style.messageContainer}>

    <p className={style.selfchat}>{text}</p>
    <p className={style.time}>Time</p>
    </div>);
  }
};

export default Message;