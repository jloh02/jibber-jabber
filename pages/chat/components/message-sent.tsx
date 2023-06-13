import React from 'react';
import style from "./messages.module.css";

interface MyComponentProps {
  text: string;
}

export const SentMessage: React.FC<MyComponentProps> = ({ text }) => (
  <div className={style.messageContainer}>

    <p className={style.selfchat}>{text}</p>
    <p className={style.time}>Time</p>
    </div>
);