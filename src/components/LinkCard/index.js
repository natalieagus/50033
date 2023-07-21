import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function LinkCard({
  label,
  description,
  icon,
  Svg,
  href,
  truncate,
  topIcon,
}) {
  return (
    <Link
      className={styles.linkCard}
      id="linkCard"
      href={href}
      data-truncate={truncate}
      data-top-icon={topIcon}
    >
      {Svg && <Svg className={styles.featureSvg} />}
      <div className={styles.linkCard__copy}>
        <p className={styles.linkCard__label}>{label}</p>
        {description && (
          <p className={styles.linkCard__description}>{description}</p>
        )}
      </div>
    </Link>
  );
}
