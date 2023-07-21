import React from "react";

// Default title is Show Answer unless given as answerTitle prop
export default function CenterItem({ children }) {
  return <div style={{ justify: " center" }}>{children}</div>;
}
