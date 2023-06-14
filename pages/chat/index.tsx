import React from 'react';
import styles from "./index.module.css";
import { SentMessage } from './components/message-sent';
import { ReceivedMessage } from './components/messaged-received';
import { Date } from './components/Date';
import './styles.css'

export default function Chat() {
    return (
        <>
            <div className={styles.chat}>
                <Date text="12 January"/>
                <SentMessage text="This is a sample from the user" />
                <Date text="Yesterday"/>
                <ReceivedMessage text="This is a sample text message" />
                <Date text="Today"/>
                <SentMessage text="This is a very very long message that should only take up 2/3 of the width and justify text. Lorem ipsum dolor sit amet, consectur adipiscing elit. Morbi ultrices massa odio, sed congue nisi lorortis et. Phasellus viverra egestas lorem." />
                <ReceivedMessage text="This is a sample text message" />
                <ReceivedMessage text="This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long message" />
                
            </div>
            
        </>
    );
}