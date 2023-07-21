import React from "react";
import useScript from "../../hooks/useScript";
import BrowserOnly from "@docusaurus/BrowserOnly";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default function ChatBaseBubble() {
  let url = "";
  const canUseDOM = ExecutionEnvironment.canUseDOM;
  if (canUseDOM) {
    url = require("@site/static/chatbase.js").default;
  }
  useScript(url, canUseDOM);

  return <BrowserOnly>{() => <div></div>}</BrowserOnly>;
}
