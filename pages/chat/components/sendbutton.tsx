import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import style from "./sendbutton.module.css";




export function SendButton(){
  return <div className={style.container}><button className={style.button}><FontAwesomeIcon icon={faPaperPlane} className={style.icon}/></button></div>
};