import React from 'react';
import style from './user.module.css';

interface MyComponentProps {
  name: string;
  status: string;
}

const User: React.FC<MyComponentProps> = ({ name,status }) => {
  
    return(
    <div className={style.Container}>

    <p className={style.name}>{name}</p>
    <p className={style.status}>{status}</p>
    </div>);
};

export default User;