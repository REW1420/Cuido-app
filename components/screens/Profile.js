import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text,
  Dimensions,
  Pressable,
  TextInput,
  Alert,
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
import moment from "moment/moment";
import UserModel from "../MVC/UserModel";
import { useTogglePasswordVisibility } from "../utils/useTogglePasswordVisibility";

import {
  sendPasswordResetEmail,
  updateEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Toast from "react-native-toast-message";
import LocalOrderModel from "../MVC/LocalOrderMovel";
import LocalUserModel from "../MVC/LocalUserModel";

const height = Dimensions.get("screen").height;

//intance the model to create an object
const orderModel = new Order();
const userModel = new UserModel();
const localOrderModel = new LocalOrderModel();
const localUserModel = new LocalUserModel();

function useOrderData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const ordersResponse = await userModel.getOrdersFiltered(global.user_id);
      setData(ordersResponse);
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
  //hook for user data
  const [userData, setUserData] = useState([]);
  //hoosk for refershing the view
  const [refershing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      async function getUserData() {
        const userData = await userModel.getUserDataByID(global.user_id);
        setUserData(userData);
      }
      async function getNoPaidOrders() {
        const ordersResponse = await orderModel.getNoPaidOrders(global.user_id);
        setNoPaidOrder(ordersResponse);
      }

      async function getPaidOrders() {
        const ordersResponse = await orderModel.getPaidOrders(global.user_id);
        setPaidOrder(ordersResponse);
      }

      getPaidOrders();
      getNoPaidOrders();
      getUserData();
      setRefreshing(false);
    }, 1000);
  }, []);

  const [modal, setModal] = useState(false);

  const abrirModal = () => {
    setModal(!modal);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [orderID, setOrderID] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [created_at, setCreated_at] = useState("");
  const [update_at, setUpdate_at] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  //hook for no paid data
  const [noPaidOrder, setNoPaidOrder] = useState([]);

  //hook for paid data
  const [paidOrder, setPaidOrder] = useState([]);

  //get user data by global id

  useEffect(() => {
    async function getUserData() {
      const userData = await userModel.getUserDataByID(global.user_id);
      setUserData(userData);
    }
    async function getNoPaidOrders() {
      const ordersResponse = await orderModel.getNoPaidOrders(global.user_id);
      setNoPaidOrder(ordersResponse);
    }

    async function getPaidOrders() {
      const ordersResponse = await orderModel.getPaidOrders(global.user_id);
      setPaidOrder(ordersResponse);
    }

    getPaidOrders();
    getNoPaidOrders();
    getUserData();
  }, []);

  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const toggleOrderHistoryModal = () => {
    setIsHistoryModalVisible(!isHistoryModalVisible);
  };

  //
  const [resetPassModalV, setResetPassModalV] = useState(false);

  const resetPassModal = () => setResetPassModalV(!resetPassModalV);

  //change email
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const toggleChangeEmailModal = () =>
    setChangeEmailVisible(!changeEmailVisible);
  //funtion to change email address
  const handleChangeEmail = async () => {
    await signInWithEmailAndPassword(auth, global.email, password).then(
      (userCredential) => {
        updateEmail(userCredential.user, newEmail)
          .then(userCredential)
          .then(() => {
            const newUserData = {
              email: newEmail,
            };
            userModel.updateUserEmail(global.user_id, newUserData).then(() => {
              showGoHomeAlert();
            });
          });
      }
    );
  };
  //hook for settings account modal visibility
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const toggleSettingsModal = () => {
    setIsSettingModalVisible(!isSettingModalVisible);
    userData.forEach((item, i) => {
      setNewLastName(item.second_name);
      setNewNade(item.first_name);
      setNewPhoneNumber(item.phone_number);
    });
  };
  //hook for email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const showGoHomeAlert = () =>
    Alert.alert(
      "Se han actualizado los datos correctamente",
      "Vuelva a iniciar sesion",
      [
        {
          text: "Confirmar",
          onPress: () => {
            handleSingOut();
          },
        },
      ]
    );
  const [inalivEmail, setInvalidEmail] = useState(false);
  const [userFound, userNotFound] = useState(false);
  const resetPass = async () => {
    if (emailRegex.test(email) === false) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
      sendPasswordResetEmail(auth, email)
        .then((result) => {
          console.log(result);
        })
        .catch((e) => {
          userNotFound(true);
          console.log(e.code, e.message);
        });
    }
  };

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  //new user data hooks
  const [newName, setNewNade] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState(0);

  const updateUserData = async () => {
    console.log("?");
  };

  const showUpdateToast = () => {
    Toast.show({
      type: "success",
      text1: "Datos actualizados correctamente",
      visibilityTime: 1000,
      position: "top",
    });
  };
  const handleChange = (event) => {
    setNewPhoneNumber(event.target.value);
    setNewNade(event.target.value);
    setNewLastName(event.target.value);
    console.log(newName);
  };
  //handle text form
  const handleText = (value, setState) => {
    setState(value);
  };
  return (
    <>
      <ScrollView
        style={{ backgroundColor: COLORS.primary_backgroud }}
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.secondary_backgroud}>
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
              onPress={toggleSettingsModal}
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
          <View style={styles.containerTopLeft}></View>
          <Image
            style={{
              bottom: height / 8,
              width: 300,
              height: 100,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            source={require("../assets/CuidoLogoTop.png")}
          />
        </View>

        <View style={styles.primary_backgroud}>
          {/* Change source for profile's image from database */}
          <Image
            style={{
              flex: 1,
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 5,
              borderColor: "white",

              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              bottom: height / 12,
            }}
            source={require("../../assets/icon.png")}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
            }}
          >
            {userData.map((item, i) => (
              <Text style={{ fontSize: 30 }}>Bienvenido {item.first_name}</Text>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 20,
          }}
        >
          <Text>Pedidos pendientes</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 2,
              }}
              onPress={toggleOrderHistoryModal}
            >
              <Text style={{ marginRight: 5 }}>Ver todo</Text>
              <Icon name="stopwatch-outline" size={30} color={"black"} />
            </TouchableOpacity>
          </View>
        </View>
        {noPaidOrder.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 30,
            }}
          >
            <Text>Aun no hay pedidos completados</Text>
          </View>
        ) : (
          noPaidOrder.map((item, i) => (
            <ListItem
              key={i}
              bottomDivider
              style={{
                backgroundColor: COLORS.secondary_backgroud,
                margin: 5,
              }}
              onPress={() => {
                setTotalPrice(item.total_price);
                setProducts(item.products);
                setOrderID(item.id);
                setUpdate_at(item.order_updated_at);
                setCreated_at(item.created_at);
                toggleModal();
                if (item.paid === 1 && item.delivered === 1) {
                  setIsPaid(true);
                } else if (item.paid === 0 && item.delivered === 0) {
                  setIsPaid(false);
                }
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
                <ListItem.Subtitle>Pedido ID : {item.id}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))
        )}
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      >
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Detalles del pedido</Text>

          <View style={styles.cardItems}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <Text style={{ margin: 5, fontWeight: "bold" }}>Producto</Text>
              <Text style={{ margin: 5, fontWeight: "bold" }}>Cantidad</Text>
              <Text style={{ margin: 5, fontWeight: "bold" }}>Precio </Text>
            </View>
          </View>
          {products.map((item, i) => (
            <View style={styles.cardItems}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                }}
                key={i}
              >
                <Text style={{ margin: 5 }}>{item.name}</Text>
                <Text style={{ margin: 5 }}>{item.quantity}</Text>
                <Text style={{ margin: 5 }}>${item.totalPrice}</Text>
              </View>
            </View>
          ))}
          <View style={styles.cardItems}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <Text style={{ margin: 5, fontWeight: "bold" }}>
                Total pagado:
              </Text>
              <Text style={{ margin: 5, fontWeight: "bold", color: "green" }}>
                ${totalPrice}
              </Text>
            </View>
          </View>
          <View style={styles.cardItems}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ margin: 5, fontWeight: "bold" }}>Creado en:</Text>
              <Text style={{ margin: 5, fontWeight: "bold", color: "green" }}>
                {moment(created_at).format("DD/MM/YYYY hh:mm:ss A")}
              </Text>
            </View>
          </View>
          <View style={styles.cardItems}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ margin: 5, fontWeight: "bold" }}>Pagado en:</Text>
              <Text style={isPaid === true ? styles.isPaid : styles.isNotPaid}>
                {isPaid === true
                  ? moment(update_at).format("DD/MM/YYYY hh:mm:ss A")
                  : "Pendiente"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.button_text}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isHistoryModalVisible}
        onBackButtonPress={toggleOrderHistoryModal}
        onBackdropPress={toggleOrderHistoryModal}
      >
        <View style={styles.modalBackdround2}>
          <ScrollView>
            <Text style={styles.modalHeader}>
              Historial de pedidos completados
            </Text>

            {paidOrder.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 20,
                }}
              >
                <Text>Aun no hay pedidos completados</Text>
              </View>
            ) : (
              paidOrder.map((item, i) => (
                <ListItem
                  key={i}
                  bottomDivider
                  style={{
                    backgroundColor: COLORS.secondary_backgroud,
                    margin: 5,
                  }}
                  onPress={() => {
                    setTotalPrice(item.total_price);
                    setProducts(item.products);
                    setOrderID(item.id);
                    setUpdate_at(item.order_updated_at);
                    setCreated_at(item.created_at);
                    if (item.paid === 1 && item.delivered === 1) {
                      setIsPaid(true);
                    } else if (item.paid === 0 && item.delivered === 0) {
                      setIsPaid(false);
                    }

                    toggleModal();
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title
                      style={
                        item.delivered === 1
                          ? styles.textValid
                          : styles.textError
                      }
                    >
                      {item.delivered === 1 ? "Entregado" : " No entregado"}
                    </ListItem.Title>
                    <ListItem.Subtitle>Pedido ID : {item.id}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))
            )}
            <Toast ref={Toast.setRef} />
          </ScrollView>
        </View>
      </Modal>

      <Modal
        isVisible={isSettingModalVisible}
        onBackButtonPress={toggleSettingsModal}
        onBackdropPress={toggleSettingsModal}
      >
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Configuracion de cuenta</Text>

          <View style={{ width: "100%" }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Ingrese su nombre"
                autoCapitalize="none"
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setNewNade)}
                value={newName}
              />
              <TextInput
                style={styles.inputTxt}
                placeholder="Ingrese su apellido"
                autoCapitalize="none"
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setNewLastName)}
                value={newLastName}
              />
              <TextInput
                style={styles.inputTxt}
                placeholder="Ingrese su numero de telefono"
                autoCapitalize="none"
                placeholderTextColor={COLORS.input_text}
                keyboardType="numeric"
                onChangeText={(value) => handleText(value, setNewPhoneNumber)}
                value={newPhoneNumber}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => updateUserData}
              >
                <Text style={styles.button_text}>Actualizar datos</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.button} onPress={resetPassModal}>
              <Text style={styles.button_text}>Cambiar contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleChangeEmailModal}
            >
              <Text style={styles.button_text}>Cambiar correo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={resetPassModalV} onBackdropPress={resetPassModal}>
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Cambiar contraseña</Text>
          {inalivEmail === true ? <Text>Ingrese un correo valido</Text> : ""}
          {userFound === true ? (
            <Text>
              No se encontro cuenta asociada al correo, verifique que su correo
              este bien escrito
            </Text>
          ) : (
            ""
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTxt}
              keyboardType="email-address"
              placeholder="Ingrese su correo"
              autoCapitalize="none"
              placeholderTextColor={COLORS.input_text}
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={email}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.button} onPress={resetPassModal}>
              <Text style={styles.button_text}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={resetPass}>
              <Text style={styles.button_text}>Cambiar contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={changeEmailVisible}
        onBackdropPress={toggleChangeEmailModal}
      >
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Cambiar correo</Text>
          {inalivEmail === true ? <Text>Ingrese un correo valido</Text> : ""}
          {userFound === true ? (
            <Text>
              No se encontro cuenta asociada al correo, verifique que su correo
              este bien escrito
            </Text>
          ) : (
            ""
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTxt}
              keyboardType="email-address"
              placeholder="Ingrese su nuevo correo"
              autoCapitalize="none"
              placeholderTextColor={COLORS.input_text}
              onChangeText={(text) => {
                setNewEmail(text);
              }}
              value={newEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTxt}
              autoCapitalize="none"
              placeholder="Ingrese su contraseña actual"
              autoCorrect={false}
              secureTextEntry={passwordVisibility}
              placeholderTextColor={COLORS.input_text}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
            <Pressable onPress={handlePasswordVisibility}>
              <Icon name={rightIcon} size={22} color="#232323" />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleChangeEmailModal}
            >
              <Text style={styles.button_text}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
              <Text style={styles.button_text}>Cambiar correo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  inputTxt: {
    backgroundColor: COLORS.input_color,
    padding: 15,
    margin: 15,
    borderRadius: 50,
    borderWidth: 1.5,
    width: "80%",
    color: COLORS.input_text,
    textAlign: "center",
    borderColor: COLORS.input_color,
    alignSelf: "center",
  },
  isNotPaid: {
    margin: 5,
    fontWeight: "bold",
    color: "red",
  },
  isPaid: {
    margin: 5,
    fontWeight: "bold",
    color: "green",
  },
  modalBackdround: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdround2: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: COLORS.primary_button,
    borderRadius: 20,
    shadowColor: COLORS.secondary_button,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    width: "40%",
  },
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  cardItems: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    height: 60,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000000",
    shadowOffset: {
      width: -7,
      height: 7,
    },
  },
  modalHeader: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 20,
  },
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
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
