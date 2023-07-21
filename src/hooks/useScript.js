import { useEffect } from "react";

const useScript = (url, canUseDOM) => {
  useEffect(() => {
    if (canUseDOM) {
      let script = document.createElement("script");

      script.src = url;
      script.id = "WEKu7pDAS20WhGVVi4yPt";
      script.setAttribute("id", "WEKu7pDAS20WhGVVi4yPt");
      script.async = true;
      script.type = "text/babel";

      document.body.appendChild(script);
    }
    return () => {
      if (canUseDOM) {
        let script = document.getElementById("WEKu7pDAS20WhGVVi4yPt");
        document.body.removeChild(script);
      }
    };
  }, [url]);
};

export default useScript;
