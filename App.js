import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import LoginNav from "./components/nagiation/LoginNav";

import Screen from './components/screens/SplashScreen'





export default function App() {

  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(()=>{
    async function prepare(){

      try{
        await new Promise(resolve => setTimeout(resolve,2000));
      } catch(error){
        console.warn(error);
      }finally{
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])



  return (
   
     <>

     {

      appIsReady ? <LoginNav/> : <Screen/>

     }
      
     
     </>
      
    
   
  );
}
