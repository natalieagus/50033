import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

export default function HomepageHeader({ title, emoji, tagline }) {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className={`hero__title ${styles.heroTitle} ${styles.heroColor}`}>
          {title} <span className={`${styles.heroTitleEmoji}`}>{emoji}</span>
        </h1>
        <p className={`hero__subtitle ${styles.heroSubtitleColor}`}>
          {tagline}
        </p>

        <Link
          className={`button--secondary button--lg button breakword ${styles.glowBox}`}
          to="/about/intro"
        >
          Get Started ⚡️
        </Link>
      </div>
    </header>
  );
}
