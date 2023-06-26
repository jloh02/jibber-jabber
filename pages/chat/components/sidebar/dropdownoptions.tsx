import React from 'react';
import style from './dropdownoptions.module.css';
import './styles.css'


interface MyComponentProps {
  username: string;
  status: string;
}

const DropDownOptions: React.FC<MyComponentProps> = ({ username, status }) => {
  return(
    <div>
        <p className={style.username}>{username}</p>
        <p className={style.status}>{status}</p>
    </div>
  )
};

export default DropDownOptions;