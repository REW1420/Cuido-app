import {
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from "react-native-elements";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import Order from "../MVC/Model";

//intance the model to create an object
const orderModel = new Order();

function useOrderData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await orderModel.getOrdersFiltered(1);
        setData(ordersResponse);
      } catch (error) {
        console.error(error);
      }
    };

    if (1) {
      fetchOrders();
    }
  }, []);

  return data;
}

export default function Profile() {
  //hooks for get fetch
  const ordersByID = useOrderData();
  console.log(ordersByID);
  //handle event for fetch the orders data

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
                right: 16,
                bottom: 110,

                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="log-out-outline" size={35} color={"red"} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.primary_backgroud}>
       
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
});
