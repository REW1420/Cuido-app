import React, { useCallback, useEffect, useState } from "react";
import LoginNav from "./components/nagiation/LoginNav";
import Screen from "./components/screens/SplashScreen";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAppIsReady(true);
    }

    prepare();
  }, []);

  return <>{appIsReady ? <LoginNav /> : <Screen />}</>;
}
