"use client"
import Image from "next/image";
import Login from "./login";
import styles from "./page.module.css";



export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Jibber Jabber</h1>
        <Login />
      </main>
      <div className={styles.footer}>
        <p>
          Jibber Jabber is a chat application that enables you to interact with
          other Riot Games players
        </p>
        <p>Riot Games is NOT affiliated with this project</p>
        <a
          href="https://github.com/jloh02/jibber-jabber/issues"
          target="_blank"
        >
          Report a bug or request a feature
        </a>
        <a
          className={styles.githubIcon}
          href="https://github.com/jloh02/jibber-jabber"
          target="_blank"
        >
          <Image
            src="/github.png"
            width={45}
            height={45}
            alt="View source or report issue"
          />
        </a>
      </div>
    </>
  );
}
