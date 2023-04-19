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
import React, { useState, useCallback, useRef , useEffect} from "react";
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
  const contactData = useContactData()
  console.log(contactData)

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

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
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              onCancel={() => setSearchQuery("")}
            />
          </View>
        </View>
        <View>
          {contactData.map((item, i) => (
            <ListItem
              key={i}
              bottomDivider
              style={{
                backgroundColor: COLORS.secondary_backgroud,
                margin: 5,
              }}
              onPress={() => {
                setItem(item), handleSnapPress(0);
                console.log(item,'click item')
              }}
            >
              <Avatar source={{ uri: item.data.logoURL }} />
              <ListItem.Content>
                <ListItem.Title>{item.data.contactName}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          ))}
        </View>
      </ScrollView>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onDismiss={() => {
          setIsOpen(false);
          setItem([]);
        }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.details_logo_container}>
            <Image style={styles.details_logo} source={{ uri: bitem.data.logoURL }} />
          </View>

          <View style={[styles.textContainer, { marginTop: 20 }]}>
            <Icon
              name="call-sharp"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black" }}>{bitem.data.contactName}</Text>
          </View>

          <View style={styles.textContainer}>
            <Icon
              name="calendar-sharp"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black" }}>{bitem.data.schedule}</Text>
          </View>

          <View style={styles.servicesContainer}>
            <Icon
              name="medkit-sharp"
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "black" }}>{bitem.data.services},</Text>
          </View>

          <View style={styles.Buttoncontainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL(`tel:${bitem.phone}`);
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
