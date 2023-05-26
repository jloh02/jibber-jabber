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
          other Riot Games players.
        </p>
        <p>Riot Games is not affiliated with this project.</p>
        <a href="https://github.com/jloh02/jibber-jabber/issues ">
          Report a bug or request a feature
        </a>
        {/* <a href="github.com/jloh02/repo/issues ">
          <img src="\src\assets\git.png" alt="View source or report issue" />
        </a> */}
      </div>
    </>
  );
}
