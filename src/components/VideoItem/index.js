import React from "react";
import styles from "./styles.module.css";

export default function VideoItem(props) {
  return (
    <>
      <div className={styles.center_div}>
        <video
          style={{ width: `${props.widthPercentage}` }}
          className={styles.center_video}
          controls
        >
          <source src={props.path} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
