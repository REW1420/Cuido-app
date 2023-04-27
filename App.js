import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginNav from "./components/nagiation/LoginNav";
import UserModel from "./components/MVC/UserModel";
import Screen from "./components/screens/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainNav from "./components/nagiation/MainNav";
const userModel = new UserModel();

export default function App() {
  //user_id get from login
  const [user_id, serUser_id] = useState("");
  const [data, setData] = useState([]);
  AsyncStorage.getItem("user_id").then((asynD) => {
    serUser_id(asynD);
    console.log(user_id);
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (user_id !== null) {
          const response = await userModel.getUserDataByID(user_id);
          setData(response);

          data.map((item, i) => {
            const phone_number = item.phone_number;
            AsyncStorage.setItem("phone_number", phone_number.toString());
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  return <>{appIsReady ? <LoginNav /> : <Screen />}</>;
}
