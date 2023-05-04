import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from "react-native-elements";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import Order from "../MVC/Model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import global from "../utils/global";
import Modal from "react-native-modal";
//intance the model to create an object
const orderModel = new Order();

function useOrderData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const ordersResponse = await orderModel.getOrdersFiltered(global.user_id);
      setData((existingData) => [...existingData, ...ordersResponse]);
    }
    fetchOrders();
  }, [global.user_id]);

  return data;
}

export default function Profile({ navigation }) {
  //hooks for get fetch
  const ordersByID = useOrderData();

  //handle event for fetch the orders data
  const handleSingOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sing out");
        navigation.navigate("login");
      })
      .catch((e) => console.log(e));
  };

  //hoosk for refershing the view
  const [refershing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const [modal, setModal] = useState(false);
  const abrirModal = () => {
    setModal(!modal);
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.primary_backgroud }}>
        <View style={styles.secondary_backgroud}>
          <View style={styles.containerTopLeft}>
            <Image
              style={{ width: 300, height: 100 }}
              source={require("../assets/CuidoLogoTop.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 60,
                top: 50,

                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
             
            >
              <Icon name="settings-outline" size={35} color={"gray"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 16,
                top: 50,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleSingOut}
            >
              <Icon name="log-out-outline" size={35} color={"red"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.primary_backgroud}>
          {/* Change source for profile's image from database */}
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "white",
              margin: 10,
              alignContent: "center",
              left: 100,
              top: -60,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
            source={require("../../assets/icon.png")}
          />
        </View>

        {ordersByID.map((item, i) => (
          <ListItem
            key={i}
            bottomDivider
            style={{
              backgroundColor: COLORS.secondary_backgroud,
              margin: 5,
            }}
          >
            <ListItem.Content>
              <ListItem.Title
                style={
                  item.delivered === 0 ? styles.textError : styles.textValid
                }
              >
                {item.delivered === 0 ? "No entregado" : "Entregado"}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  secondary_backgroud: {
    backgroundColor: COLORS.secondary_backgroud,
    width: "100%",
    height: 400,
  },
  primary_backgroud: {
    backgroundColor: COLORS.primary_backgroud,
    padding: SPACING * 2,
    borderRadius: SPACING * 3,
    bottom: SPACING * 2,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },
  containerTopLeft: {
    position: "absolute",
    top: 200,
    left: 20,
    flex: 1,
    width: 200,
    height: 200,
  },
  textError: {
    color: "red",
  },
  textValid: {
    color: "green",
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
