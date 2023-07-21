import Details from "@theme/MDXComponents/Details";
import React from "react";
import styles from "./styles.module.css";

// Default title is Show Answer unless given as answerTitle prop
export default function CollapsibleAnswer({ children, title }) {
  return (
    <Details className={styles.collapsible}>
      <summary mdxType="summary" className={styles.header}>
        {title ? title : "Show Answer"}
      </summary>
      {children}
    </Details>
  );
}
