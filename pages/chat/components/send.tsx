import React from 'react';
import style from "./send.module.css";


export function TypeMessage(){
    return<input placeholder='Type message here' className={style.typemessage}></input>
}