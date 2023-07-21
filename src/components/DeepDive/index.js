import Details from "@theme/Details";
import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const SummaryHeader = ({ title }) => {
  return (
    <summary style={{ fontWeight: "bold" }}>
      {title ? title : "Deep Dive"}
    </summary>
  );
};
export default function DeepDive({ children, title }) {
  return (
    <>
      <Details
        className={clsx(styles.collapsible)}
        summary={<SummaryHeader title={title} />}
      >
        {children}
      </Details>
    </>
  );
}
