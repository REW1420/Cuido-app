import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import React, { useState, useCallback, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SearchBar } from "@rneui/themed";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { remove } from "lodash";
import Toast from "react-native-toast-message";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import Order from "../MVC/Model";
import UserModel from "../MVC/UserModel";
import { database } from "../utils/firebase";
import * as Location from "expo-location";
import global from "../utils/global";
import { RadioButton } from "react-native-paper";

//intance the model to create an object
const orderModel = new Order();
const userModel = new UserModel();
//get documents from firestore
function useProductData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const snapshot = onSnapshot(
      collection(database, "products"),
      (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setData(products);
      }
    );

    return () => snapshot();
  }, []);

  return data;
}

export default function Store({ navigation }) {
  const [number, setNumber] = useState(1);
  const [price, setPrice] = useState(price);
  const [bitem, setItem] = useState([]);
  const [carData, setCarData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemName, setItemName] = useState("");
  const [firebaseID, setFirebaseID] = useState("");
  const [data, setData] = useState([]);

  //radio button checked hook
  const [checked, setChecked] = useState("");

  useEffect(() => {
    if (global.user_id !== null || global.user_id !== "") {
      try {
        fetch(
          `https://cuido-middleware.000webhostapp.com/api/users/code/${global.user_id}`
        )
          .then((response) => response.json())
          .then((json) => {
            setData(json);
            console.log("user data", data);
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      return;
    }
  }, [user_id]);
  //google API key

  const destination = { latitude: 37.4226711, longitude: -122.0849872 };
  //hooks for the confirm order modal
  const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);

  console.log("variable global", global.user_id);
  //data get from login
  const [user_id, serUser_id] = useState("");
  const [user_phone_number, setUser_phone_number] = useState(0);

  data.forEach((item, i) => {
    if (item && item.phone_number) {
      global.phone_number = item.phone_number;
      global.client_name = item.first_name;
    }
  });
  console.log("global", global.phone_number);
  const [step, setStep] = useState(2);
  //item count hook
  const [count, setCount] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  //handle step increment
  //console.log("user phone number", user_phone_number);
  const stepIncrement = () => {
    if (step == 6) {
      return;
    } else {
      setStep(step + 1);
    }
    console.log(step);
  };

  const stepDecrease = () => {
    if (step == 1) {
      return;
    } else {
      setStep(step - 1);
    }
    console.log(step);
  };

  //hook for the total price
  const [priceToPay, setPriceToPay] = useState(0.0);

  const bottomSheetRef = useRef(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [lastID, setLastID] = useState(1);
  const [deliverer, setDeliverer] = useState([]);

  //hooks for location and current location
  const [currentLocation, setCurrentLocation] = useState([]);

  //hooks for the details botomsheed
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState(0);
  const snapPoints = ["40%"];

  //hooks for the form to send the data to db
  const [comment, setComment] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const addDataToCart = () => {
    //update the item count
    setCount(count + 1);

    //update the ID
    setLastID(lastID + 1);
    //JSON data for the shooping cart
    const newProduc = {
      id: lastID,
      totalPrice: price * number,
      quantity: number,
      name: itemName,
      firebaseID: firebaseID,
    };

    //add the data to the shopping cart JSON
    setCarData([...carData, newProduc]);

    //calculate the total price

    const total = carData.reduce(
      (acumulador, producto) => acumulador + producto.totalPrice,
      initialPrice
    );
    setPriceToPay(total);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalNegativeVisible, setIsModalNegativeVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalError = () => {
    setIsModalNegativeVisible(!isModalNegativeVisible);
  };

  //toggle for confirm order
  const toggleModalConfirm = () => {
    setIsModalConfirmVisible(!isModalConfirmVisible);
    setStep(1);
  };
  const handleDelete = (id) => {
    const newCarData = remove(carData, (carItem) => carItem.id !== id);
    setCarData(newCarData);
    setCount(count - 1);
  };

  useEffect(() => {
    handleGetDeliverer();
    setTotalPrice(price * number);
  }, [number, price]);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Agregado al carrito",
      visibilityTime: 1000,
      position: "top",
    });
  };
  const showCurrentRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  //contruction of the json
  const newOrderData = {
    user_id: global.user_id,
    products: carData,
    total_price: priceToPay,
    comments: comment,
    delivered: false,
    paid: false,
    is_delivered_by: checked,
    user_phone_number: parseInt(tempPhoneNumber),
    location_lat: parseFloat(currentLocation.latitude),
    location_long: parseFloat(currentLocation.longitude),
    client_name: global.client_name,
    is_being_delivering: false,
  };

  //handle text form
  const handleText = (value, setState) => {
    setState(value);
  };

  const handleAddOrder = async () => {
    await orderModel.createOrder(newOrderData);
    await updateQuantity();
    handleClrearOrderData();
    toggleModalConfirm();
  };

  //delete all data that were use when creating a new order
  const handleClrearOrderData = () => {
    setCarData([]);
    setCurrentLocation([]);
    setComment("");
    setTempPhoneNumber(0);
    setUser_phone_number(0);
    setChecked("");
    setCount(0);
  };
  //async funtion to get the permission to acces location

  useEffect(() => {
    async function getLocation() {
      //ask for permisson

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      } else {
        const { coords } = await Location.getCurrentPositionAsync();
        setCurrentLocation(coords);
        console.log(currentLocation);
      }
    }
    getLocation();
  }, []);

  const postAlert = () =>
    Alert.alert(
      "¿Esta seguro de enviar la orden?",
      "No se podra editar despues",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Confirmar", onPress: () => handleAddOrder() },
      ]
    );

  const handleGetDeliverer = async () => {
    const delivererData = await userModel.getUserDeliverer();
    setDeliverer(delivererData);
    console.log("view", deliverer);
  };

  const updateQuantity = async () => {
    carData.forEach(async (item, i) => {
      const docRef = doc(database, "products", firebaseID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const actualQuantity = await docSnap.data().quantity;
        const newQuantity = parseInt(actualQuantity) - parseInt(item.quantity);

        await updateDoc(doc(database, "products", firebaseID), {
          quantity: newQuantity,
        })
          .then(() => console.log("quantity update"))
          .catch((e) => console.log(e));
      }
    });
  };
  //use the data
  const productData2 = useProductData();

  //hook de la data inicial
  const [productData, setProductData] = useState([]);
  //hook de la data filtrada
  const [filteredData, setFilteredData] = useState([]);

  //funtcion effect para traer la data de firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, "products"),
      (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setProductData(products);
        console.log(productData);
      }
    );

    return () => unsubscribe();
  }, []);

  //handle para actualizar los datos dependiendo de lo que se busca
  //hooks for no found data
  const [noFoundData, setNoFoundData] = useState(false);
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = productData.filter((item) => {
      const itemData = item.data.productName.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredData(filtered);

    if (filteredData.length === 0) {
      setNoFoundData(true);
    }
  };

  //hoosk for refershing the view
  const [refershing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  //vista
  return (
    <>
      <ScrollView
        style={{ backgroundColor: COLORS.primary_backgroud }}
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.secondary_backgroud}>
          <View style={styles.containerTopLeft}>
            <Image
              style={{ width: 150, height: 50 }}
              source={require("../assets/CuidoLogoTop.png")}
            />
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 16,
                bottom: 45,

                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (Object.keys(carData).length == 0) {
                  toggleModalError();
                } else {
                  toggleModal();
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>{count ? count : ""}</Text>
                <Icon
                  name="cart-outline"
                  size={35}
                  color={COLORS.primary_button}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.primary_backgroud}>
          <View style={styles.container}>
            <SearchBar
              placeholder="Buscar"
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              onChangeText={handleSearch}
              value={searchQuery}
            />
          </View>
        </View>
        {filteredData.length > 0 ? (
          filteredData.map((item, i) => (
            <View key={i} style={styles.productsContainer}>
              <View>
                <Image
                  style={styles.image}
                  source={{ uri: item.data.logoURL }}
                />
                <View style={styles.contentProducts}>
                  <View style={styles.text}>
                    <Text style={styles.name}>{item.data.productName}</Text>
                    <Text style={styles.price}>${item.data.price}</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={
                        item.data.quantity === 0
                          ? styles.buttomSoldOut
                          : styles.buttom
                      }
                      onPress={
                        item.data.quantity === 0
                          ? () => {
                              console.log("no hay");
                            }
                          : () => {
                              setFirebaseID(item.id),
                                handleSnapPress(0),
                                setPrice(item.data.price);
                              setItemName(item.data.productName);
                              setTotalPrice(item.data.price);
                              setInitialPrice(item.data.price);
                              setDetails(item.data.description);
                              setQuantity(item.data.quantity);
                            }
                      }
                    >
                      <Text style={styles.textButtom}>
                        {item.data.quantity === 0 ? "Agotado" : "Detalles"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : noFoundData === true ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              No se encontraron resultados para la búsqueda realizada.
            </Text>
          </View>
        ) : (
          productData.map((item, i) => (
            <View key={i} style={styles.productsContainer}>
              <View>
                <Image
                  style={styles.image}
                  source={{ uri: item.data.logoURL }}
                />
                <View style={styles.contentProducts}>
                  <View style={styles.text}>
                    <Text style={styles.name}>{item.data.productName}</Text>
                    <Text style={styles.price}>${item.data.price}</Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={
                        item.data.quantity === 0
                          ? styles.buttomSoldOut
                          : styles.buttom
                      }
                      onPress={
                        item.data.quantity === "0"
                          ? () => {
                              console.log("no hay");
                            }
                          : () => {
                              setFirebaseID(item.id),
                                handleSnapPress(0),
                                setPrice(item.data.price);
                              setItemName(item.data.productName);
                              setTotalPrice(item.data.price);
                              setInitialPrice(item.data.price);
                              setDetails(item.data.description);
                              setQuantity(item.data.quantity);
                            }
                      }
                    >
                      <Text style={styles.textButtom}>
                        {item.data.quantity === 0 ? "Agotado" : "Detalles"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
        <View></View>
        <Toast ref={Toast.setRef} />
      </ScrollView>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onClose={() => {
          setNumber(1);
          //setIsOpen(false);

          console.log("card item data", JSON.stringify(carData));
        }}
      >
        <BottomSheetView>
          <View style={styles.textContainer}>
            <Icon
              name="alert-circle-outline"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black", margin: 10, marginBottom: 20 }}>
              {details}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
              flexDirection: "row",
            }}
          >
            <Icon
              name="cash-outline"
              size={20}
              color="black"
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: "black", marginBottom: 4 }}>
              ${totalPrice}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",

              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <Text
              style={{ color: "black", marginBottom: 10, fontWeight: "bold" }}
            >
              Disponible: {quantity}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => {
                    if (number <= 1) {
                      return;
                    } else {
                      setNumber(number - 1);
                    }
                  }}
                  style={styles.buttom}
                >
                  <Text style={styles.textButtom}>-</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ textDecorationLine: "underline" }}>
                {number} de {quantity}
              </Text>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() => {
                    if (number > quantity - 1) {
                      return;
                    } else {
                      setNumber(number + 1);
                    }
                  }}
                  style={styles.buttom}
                >
                  <Text style={styles.textButtom}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.buttom}
                onPress={() => {
                  addDataToCart();
                  showToast();
                }}
              >
                <Text style={styles.textButtom}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
      >
        <ScrollView style={{ marginTop: 90 }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Carrito</Text>
            {carData.map((carItem, i) => (
              <View style={styles.carItems} key={i}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                >
                  <Text style={{ fontWeight: "bold", margin: 5 }}>
                    {carItem.name}
                  </Text>
                  <Text style={{ margin: 5 }}>${carItem.totalPrice}</Text>
                  <Text style={{ margin: 5 }}>
                    Cantidad: {carItem.quantity}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      width: 50,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                    }}
                    onPress={() => handleDelete(carItem.id)}
                  >
                    <Icon name="trash-bin-outline" color={"white"} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={{ flexDirection: "row", margin: 15 }}>
              <View style={styles.container}>
                <TouchableOpacity style={styles.buttom} onPress={toggleModal}>
                  <Text style={styles.textButtom}>Regresar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.container}>
                <TouchableOpacity
                  style={styles.buttom}
                  onPress={() => {
                    toggleModalConfirm();
                    toggleModal();

                    console.log(carData);
                  }}
                >
                  <Text style={styles.textButtom}>Comprar: ${priceToPay}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        isVisible={isModalNegativeVisible}
        onBackButtonPress={toggleModalError}
        onBackdropPress={toggleModalError}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row", margin: 15 }}>
            <View style={styles.container}>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 15,
                  marginHorizontal: 25,
                  marginVertical: 10,
                  paddingVertical: 15,
                  borderWidth: 1,
                  borderColor: "#eee",
                  shadowColor: "#000000",
                  shadowOffset: {
                    width: -7,
                    height: 7,
                  },
                  shadowOpacity: 0.05,
                  shadowRadius: 3.05,
                  elevation: 4,
                  width: 300,
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 15 }}>
                  Tu carrito está vacío. ¡Agrega algunos artículos para comenzar
                  a comprar!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.buttom}
                onPress={toggleModalError}
              >
                <Text style={styles.textButtom}>Ir a la tienda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isModalConfirmVisible}
        onBackButtonPress={toggleModalConfirm}
        onBackdropPress={toggleModalConfirm}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}
          >
            {step == 1
              ? "Confirmar Orden"
              : step == 2
              ? "Escoger ubicacion de entrega"
              : step == 3
              ? "Agregar un comentario"
              : step == 4
              ? "Agregar un numero de telefono"
              : step == 5
              ? "Escoger un repartidor"
              : step == 6
              ? "Recivo"
              : null}
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center" }}>
            {step == 1
              ? null
              : step == 2
              ? "Necesario para poder entregar su pedido"
              : step == 3
              ? "Opcional"
              : step == 4
              ? "Obligatorio, para poder contactar al cliente"
              : step == 5
              ? "Obligatorio, escoja un repartidor"
              : step == 6
              ? null
              : null}
          </Text>

          {step === 1 &&
            carData.map((carItem, i) => (
              <View style={styles.carItems}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                  key={i}
                >
                  <Text style={{ fontWeight: "bold", margin: 5 }}>
                    {carItem.name}
                  </Text>
                  <Text style={{ margin: 5 }}>${carItem.totalPrice}</Text>
                  <Text style={{ margin: 5 }}>
                    Cantidad: {carItem.quantity}
                  </Text>
                </View>
              </View>
            ))}

          {step === 2 && (
            <View style={{ height: 500, width: "100%" }}>
              <View style={{ flex: 1, margin: 10 }}>
                <MapView
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  style={{ flex: 1 }}
                  initialRegion={showCurrentRegion}
                  onPress={(coordinate) => {
                    setCurrentLocation(coordinate.nativeEvent.coordinate);
                    console.log("By click", currentLocation);
                  }}
                >
                  <Marker
                    coordinate={showCurrentRegion}
                    draggable
                    onDragEnd={(coordinate) => {
                      setCurrentLocation(coordinate.nativeEvent.coordinate);
                      console.log("new coordinate", currentLocation);
                    }}
                    pinColor="#F4E0BB"
                  />
                </MapView>
              </View>
            </View>
          )}
          {step === 3 && (
            <TextInput
              style={styles.inputTxt}
              placeholder="Comentario"
              multiline={true}
              numberOfLines={3}
              onChangeText={(value) => handleText(value, setComment)}
              value={comment}
            />
          )}
          {step === 4 && (
            <TextInput
              style={styles.inputTxt}
              placeholder="numero de telefono"
              multiline={true}
              numberOfLines={3}
              onChangeText={(value) => handleText(value, setTempPhoneNumber)}
              value={tempPhoneNumber}
            />
          )}

          {step === 5 && (
            <>
              {deliverer.map((item, i) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                  key={i}
                >
                  <RadioButton
                    value={item.user_id}
                    status={checked === item.user_id ? "checked" : "unchecked"}
                    onPress={() => setChecked(item.user_id)}
                  />
                  <Text style={{ fontSize: 25 }}>{item.first_name}</Text>
                </View>
              ))}
            </>
          )}
          {step === 6 && (
            <>
              <Text>Total a pagar: ${priceToPay}</Text>
              {carData.map((carItem, i) => (
                <View style={styles.carItems} key={i}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", margin: 5 }}>
                      {carItem.name}
                    </Text>
                    <Text style={{ margin: 5 }}>${carItem.totalPrice}</Text>
                    <Text style={{ margin: 5 }}>
                      Cantidad: {carItem.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginHorizontal: 10 }}>
              <TouchableOpacity
                style={styles.buttom}
                onPress={() => {
                  step == 1 ? toggleModalConfirm() : stepDecrease();
                }}
              >
                <Text style={styles.textButtom}>
                  {step == 1 ? "Cancelar" : "Atras"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 15 }}>paso {step} de 6</Text>
            </View>
            <View style={{ marginHorizontal: 10 }}>
              <TouchableOpacity
                style={styles.buttom}
                onPress={() => {
                  step === 6 ? postAlert() : stepIncrement();
                }}
              >
                <Text style={styles.textButtom}>
                  {step == 6 ? "Confirmar" : "Siguiente"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  secondary_backgroud: {
    backgroundColor: COLORS.secondary_backgroud,
    width: "100%",
    height: 150,
  },
  primary_backgroud: {
    backgroundColor: COLORS.primary_backgroud,
    padding: SPACING * 2,
    borderRadius: SPACING * 3,
    bottom: SPACING * 3,
  },

  inputContainer: {
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },
  containerTopLeft: {
    position: "absolute",
    top: 50,
    left: 20,
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,
  },
  input: {
    color: "black",
  },
  productsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 25,
    marginVertical: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000000",
    shadowOffset: {
      width: -7,
      height: 7,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.05,
    elevation: 4,
  },
  contentProducts: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: "100%",
    height: 175,
    resizeMode: "contain",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    paddingTop: 3,
    color: "#666",
  },
  buttom: {
    alignItems: "center",
    backgroundColor: COLORS.primary_button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  buttomSoldOut: {
    alignItems: "center",
    backgroundColor: COLORS.secondary_text,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  textButtom: {
    fontWeight: "bold",
    color: COLORS.primary_buton_text,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flexDirection: "column",
  },
  carItems: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 25,
    marginVertical: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000000",
    shadowOffset: {
      width: -7,
      height: 7,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.05,
    elevation: 4,
    height: 60,
    width: 300,
  },
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
});
