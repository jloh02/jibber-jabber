import React, { useState,useEffect } from 'react';
import style from './dropdown.module.css';
import DropDownOptions from './dropdownoptions';
import './styles.css'

interface DropdownProps {
  groupName: string;
}

export default function Dropdown({ groupName }:DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={style.dropdown}>
        
     <p onClick={toggleDropdown} className={style.header}><span className={isOpen?style.arrowDown:style.arrowRight}></span>{ groupName }</p>
     <div className={isOpen?style.dropdownOptionsOpen:style.dropdownOptions}>
          <DropDownOptions username="Username" status="VALORANT - Online"/>
          <DropDownOptions username="Username" status="League of Legends - In Queue"/>
          <DropDownOptions username="Username" status="League of Legends - In Game"/>
        </div>
      
    </div>
  );
}








