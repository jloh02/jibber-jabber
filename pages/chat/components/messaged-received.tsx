import React from 'react';
import style from "./messages.module.css";

interface MyComponentProps {
  text: string;
}

export const ReceivedMessage: React.FC<MyComponentProps> = ({ text }) => (
  <div className={style.messageContainer}>
    <div className={style.receivedMessageContainer}>
    <p className={style.otherchat}>{text}</p>
    <p className={style.receivedtime}>Time</p>
    </div>
  </div>
);