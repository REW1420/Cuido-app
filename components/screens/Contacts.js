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
  Linking,
} from "react-native";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import React, { useState, useCallback, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Dimensions } from "react-native";
import { SearchBar } from "@rneui/themed";

import contactsTest from "../assets/data/contactsTest";
import { ListItem, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("screen");

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
//firebase dependecies
import { database, storage } from "../utils/firebase";
//references name of the storage and firebase
const firestoreName = "contacts";

//get documents from firestore
function useContactData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const snapshot = onSnapshot(
      collection(database, firestoreName),
      (querySnapshot) => {
        const contacs = [];
        querySnapshot.forEach((doc) => {
          contacs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setData(contacs);
        console.log(data);
      }
    );

    return () => snapshot();
  }, []);

  return data;
}

export default function Contacts() {
  const [bitem, setItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const snapPoints = ["45%"];

  //use of contact data
  //const contactData = useContactData();
 // console.log('?',contactData);

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  //aqui

  //hook de la data inicial
  const [contactData, setContactData] = useState([]);
  //hook de la data filtrada
  const [filteredData, setFilteredData] = useState([]);

  //funtcion effect para traer la data de firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, "contacts"),
      (querySnapshot) => {
        const contact = [];
        querySnapshot.forEach((doc) => {
          contact.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setContactData(contact);
        console.log('contact data',contactData)
      }
    );

    return () => unsubscribe();
  }, []);
  //hooks for no found data
  const [noFoundData, setNoFoundData] = useState(false);
  //handle para actualizar los datos dependiendo de lo que se busca
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = contactData.filter((item) => {
      const itemData = item.data.contactName.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredData(filtered);
    if (filteredData.length === 0) {
      setNoFoundData(true);
    }
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.primary_backgroud }}>
        <View style={styles.secondary_backgroud}>
          <View style={styles.containerTopLeft}>
            <Image
              style={{ width: 150, height: 50 }}
              source={require("../assets/CuidoLogoTop.png")}
            />
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
        <View>
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => (
              <ListItem
                key={i}
                bottomDivider
                style={{
                  backgroundColor: COLORS.secondary_backgroud,
                  margin: 5,
                }}
                onPress={() => {
                  setItem(item.data);
                  handleSnapPress(0);
                }}
              >
                <Avatar source={{ uri: item.data.logoURL }} />
                <ListItem.Content>
                  <ListItem.Title>{item.data.contactName}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
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
            contactData.map((item, i) => (
              <ListItem
                key={i}
                bottomDivider
                style={{
                  backgroundColor: COLORS.secondary_backgroud,
                  margin: 5,
                }}
                onPress={() => {
                  setItem(item.data);
                  handleSnapPress(0);
                }}
              >
                <Avatar source={{ uri: item.data.logoURL }} />
                <ListItem.Content>
                  <ListItem.Title>{item.data.contactName}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))
          )}
        </View>
      </ScrollView>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onDismiss={() => {
          setItem([]);
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.details_logo_container}>
            <Image
              style={styles.details_logo}
              source={{ uri: bitem.logoURL }}
            />
          </View>

          <View style={[styles.textContainer, { marginTop: 20 }]}>
            <Icon
              name="call-sharp"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black" }}>{bitem.contactName}</Text>
          </View>

          <View style={styles.textContainer}>
            <Icon
              name="calendar-sharp"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black" }}>{bitem.schedule}</Text>
          </View>

          <View style={styles.servicesContainer}>
            <Icon
              name="medkit-sharp"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black" }}>{bitem.services},</Text>
          </View>

          <View style={styles.Buttoncontainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL(`tel:${bitem.phoneNumer}`);
              }}
            >
              <Text style={styles.button_text}>Llamar</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
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
  containerTopLeft: {
    position: "absolute",
    top: 50,
    left: 20,
    flex: 1,
  },
  listContainer: {
    backgroundColor: COLORS.secondary_backgroud,
  },
  details_logo: {
    width: 40,
    height: 40,
  },
  details_logo_container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 50,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flexDirection: "row",
  },
  details_text: {
    color: COLORS.hint_text,
    fontSize: 25,
    textAlign: "center",
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
    width: width / 2,
    height: 40,
  },
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 16,
  },
  Buttoncontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  bottomSheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  servicesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
});
