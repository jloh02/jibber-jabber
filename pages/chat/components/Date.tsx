import React from 'react';
import style from "./date.module.css";

interface MyComponentProps {
  text: string;
}

export const Date: React.FC<MyComponentProps> = ({ text }) => (
  <div className={style.box}>

    <p className={style.date}>{text}</p>
    </div>
);