import React from 'react';
import styles from "./index.module.css";
import  Message  from './components/messages';
import { Date } from './components/Date';
import { TypeMessage } from './components/send';
import { SendButton } from './components/sendbutton';
import { SideBar } from './components/sidebar/sidebar';
import User from './components/user';
import Recipient from './components/recipient';
import './styles.css'

export default function Chat() {
    
    return (
        <>
        <SideBar/>
        <User name='CurrentUser#tag' status='VALORANT - Competitive(5-15)'/>
        <Recipient name='Username#tag' status='VALORANT - Competitive(5-15)' />
            <div className={styles.chat}>
                <Date text="12 January"/>
                <Message text="This is a sample from the user" sent={true}/>
                <Date text="Yesterday"/>
                <Message text="This is a sample text message" sent={false}/>
                
                <Date text="Today"/>
                <Message text="This is a very very long message that should only take up 2/3 of the width and justify text. Lorem ipsum dolor sit amet, consectur adipiscing elit. Morbi ultrices massa odio, sed congue nisi lorortis et. Phasellus viverra egestas lorem." sent={true}/>
                <Message text="This is a sample text message" sent={false}/>
                <Message text="This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long message" sent={false}/>
                <Message text="This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long message" sent={true}/>
                
            </div>
            <div className={styles.send}>
                <TypeMessage />
                <SendButton/>
            </div>
            
        </>
    );
}