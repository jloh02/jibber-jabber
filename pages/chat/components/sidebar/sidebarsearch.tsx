import React from 'react';
import style from "./sidebarsearch.module.css";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export function SideBarSearch(){
    return(
        <div className={style.container}>
        <input type="text" className={style.search} placeholder='Search'/>
        <FontAwesomeIcon icon={faMagnifyingGlass} className={style.icon}/>
        </div>
    );
}