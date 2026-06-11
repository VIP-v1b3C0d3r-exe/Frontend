import mapBg from "../../assets/HomeBag.svg";
import homeFig from "../../assets/HomeFig.svg";
import { LuSearch } from "react-icons/lu";

import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <main className={styles.homePage}>
      <section className={styles.heroSection}>
        <img src={mapBg} alt="" className={styles.mapBackground} />

        <div className={styles.logoBlock}>
          <h1 className={styles.logoTitle}>
            <span className={styles.lightText}>E</span>
            LOCAT
            <span className={styles.oWrapper}>
              O
              <LuSearch className={styles.logoMagnifier} />
            </span>
            R
          </h1>

          <p className={styles.logoSubtitle}>GLOBAL EVENT LOCATOR</p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <img src={homeFig} alt="" className={styles.shapeBackground} />

        <div className={styles.contentBox}>
          <h2 className={styles.title}>Make Plans, Not Excuses</h2>

          <p className={styles.description}>
            Your city is busier than your feed suggests. Skip the scroll and
            find the events that actually match your energy. From late-night
            workshops to morning meetups, see what’s happening before it’s over.
          </p>

          <div className={styles.tags}>
            <span>Pick Your Mood</span>
            <span>Check the Clock</span>
            <span>Choose Your Crowd</span>
            <span>Start the Wave</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;