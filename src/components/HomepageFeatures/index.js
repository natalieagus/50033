import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Intro to Algorithm and OOP",
    Svg: require("@site/static/assets/icons/algorithm.svg").default,
    description: (
      <>
        The first half of this course focuses on providing students with
        algorithmic thinking and different paradigms of computation such as
        procedural and object-oriented design.
      </>
    ),
  },
  {
    title: "Intro to Machine Learning",
    Svg: require("@site/static/assets/icons/ml.svg").default,
    description: (
      <>
        The second half of this course focuses on a basic introduction to
        machine learning for categorical and continuous data. Students will be
        able to apply both algorithms and basic machine learning techniques to
        solve real-world problems driven by data and computation.
      </>
    ),
  },
  {
    title: "State Machine",
    Svg: require("@site/static/assets/icons/sm.svg").default,
    description: (
      <>
        Towards the end of the course, students will focus on various state
        machine designs and implement it using object oriented paradigm.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
