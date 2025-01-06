import notificationIcon from "../../assets/bell.png";
import messageIcon from "../../assets/message.png";
import profileIcon from "../../assets/user.png";
import trainingIcon from "../../assets/training.png";
import progressIcon from "../../assets/progress.png";
import friendsIcon from "../../assets/friends.png";
import styles from "./LoggedMenu.module.css";
export function headerLoggedMenu() {
  return (
    <div>
      <header className={`${styles.header}  lg:flex text-center`}>
        <nav className={`${styles.navbar} flex flex-col lg:flex-row`}>
          <a className=" text-2xl xl:text-3xl text-gray-100 ml-2">
            Core<span className="text-red-600">Trainer</span>
          </a>
        </nav>
        <nav className={`${styles.navbar} flex flex-col xl:flex-row`}>
          <a
            href="#"
            className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
          >
            <img src={trainingIcon} className={styles.midIconsHeaderSelected} />
          </a>

          <a
            href="#"
            className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
          >
            <img src={progressIcon} className={styles.midIconsHeader} />
          </a>
          <a
            href="#"
            className={`${styles.midIconContainer} xl:my-0 mx-6 py-3 px-8`}
          >
            <img src={friendsIcon} className={styles.midIconsHeader} />
          </a>
        </nav>
        <nav className={`${styles.navbar} flex flex-col xl:flex-row`}>
          <a
            href="#"
            className={`${styles.rightIconsContainer} py-2 my-2 xl:py-0 lg:ml-4 px-3 md:text-3xl xl:text-2xl mt-8 lg:mt-0`}
          >
            <img src={messageIcon} className={styles.iconsHeader} />
          </a>
          <a
            href="#"
            className={`${styles.rightIconsContainer} py-2 my-2  xl:my-0 lg:ml-4 px-3 md:text-3xl xl:text-2xl`}
          >
            <img src={notificationIcon} className={styles.iconsHeader} />
          </a>

          <a
            href="#"
            className={`${styles.rightIconsContainer} py-2 my-2  xl:my-0 lg:ml-4 px-3 md:text-3xl xl:text-2xl`}
          >
            <img src={profileIcon} className={styles.iconsHeader} />
          </a>
        </nav>
      </header>
    </div>
  );
}

export default headerLoggedMenu;
