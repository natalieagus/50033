import Details from "@theme/MDXComponents/Details";
import React from "react";
import styles from "./styles.module.css";

export default function DeepDive({ children, title }) {
  return (
    <>
      <Details className={styles.collapsible}>
        <summary mdxType="summary" style={{ fontWeight: "bold" }}>
          {title ? title : "Deep Dive"}
        </summary>
        {children}
      </Details>
    </>
  );
}
