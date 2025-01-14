import React from "react";
import useScript from "../../hooks/useScript";
import styles from "./styles.module.css";

let quizdownConfig = {
  startOnLoad: true, // detect and convert all div html elements with class quizdown
  shuffleAnswers: true, // shuffle answers for each question
  shuffleQuestions: false, // shuffle questions for each quiz
  nQuestions: undefined, // display n questions at random, if shuffleQuestions is true
  primaryColor: "steelblue", // primary CSS color
  secondaryColor: "#EFEFF0", // secondary CSS color
  textColor: "#0C0A3E", // text color of some elements
  locale: null, // language of the user interface (auto-detect per default)
};

export default function ReviewQuiz({ content, name, children }) {
  const statusQuizdown = useScript(
    "https://libraries-csd.s3.ap-southeast-1.amazonaws.com/quizdown.js"
  );
  const statusQuizdownKatex = useScript(
    "https://libraries-csd.s3.ap-southeast-1.amazonaws.com/quizdownKatex.js"
  );
  const statusQuizdownHighlight = useScript(
    "https://libraries-csd.s3.ap-southeast-1.amazonaws.com/quizdownHighlight.js"
  );

  let currentDivName = name === undefined ? "quizdown" : name;

  function initQuizdown(event) {
    if (
      statusQuizdown === "ready" &&
      statusQuizdownHighlight === "ready" &&
      statusQuizdownKatex === "ready"
    ) {
      event.currentTarget.classList.add(styles.buttonquizclicked);
      window.quizdown
        .register(window.quizdownKatex)
        .register(window.quizdownHighlight)
        .init();
      window.quizdown.createApp(
        content,
        document.querySelector("." + currentDivName),
        quizdownConfig
      );
    } else {
      window.alert(
        "There's something wrong with quiz loading, please contact your instructor."
      );
    }
  }

  return (
    <div>
      {/* <div>
        Script status: <b>{status}</b>
      </div> */}
      {statusQuizdown === "ready" && (
        <div>
          <div className={styles.container}>
            <button className={`${styles.buttonquiz}`} onClick={initQuizdown}>
              Begin Quiz
            </button>
          </div>
          <div className={currentDivName}></div>
        </div>
      )}
    </div>
  );
}
