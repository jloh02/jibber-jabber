import React,{useState} from 'react';
import style from "./sidebar.module.css";
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SideBarSearch } from './sidebarsearch';
import Dropdown from './dropdown';

export function SideBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className={style.container}>
      <div className={style.settingsContainer} onClick={toggleMenu}>
        <FontAwesomeIcon icon={faGear} className={style.settings} />
        <div className={`${style.popoutMenu} ${isMenuOpen ? style.open : ''}`}>
          <p className={style.popupOptions}>Setting</p>
          <p className={style.popupOptions}>Setting</p>
          <p className={style.popupOptions}>Setting</p>
        </div>
      </div>
      <SideBarSearch />
      <div className={style.scroll}>
        <Dropdown groupName='Group 1' />
        <Dropdown groupName='Group 2' />
        <Dropdown groupName='General' />
      </div>
    </div>
  );
}