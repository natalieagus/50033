import React from "react";
import styles from "./styles.module.css";

export default function ImageCard({ path, customClass, widthPercentage }) {
  let computedCustomClass = "";
  if (customClass !== undefined && customClass !== null) {
    computedCustomClass = `, ${customClass}`;
  }
  return (
    <section>
      <img
        src={path}
        className={`${styles.center_image} ${computedCustomClass}`}
        style={{ width: `${widthPercentage}` }}
      />
    </section>
  );
}
