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
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";

import React from "react";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export default function SingUp({ navigation }) {
  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.primary_backgroud }}>
        <View style={styles.secondary_backgroud}></View>

        <View style={styles.primary_backgroud}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 16,
              marginRight: 16,
              marginBottom: 16,
              height: 200,
            }}
          >
            <Image
              style={styles.Logo}
              source={require("../assets/Cuido.png")}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Correo"
                placeholderTextColor={COLORS.input_text}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.input_text}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Repetir contraseña"
                placeholderTextColor={COLORS.input_text}
              />
            </View>
          </View>

          <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.button_text}>Registrarse</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textContainer}>
            <Text
              style={styles.iniciar_sesion_text}
              onPress={() => {
                navigation.navigate("login");
              }}
            >
              ¿Ya tiene una cuenta? Inicie sesion
            </Text>
          </View>
        </View>
      </ScrollView>
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
    borderColor: COLORS.input_color,
  },
  secondary_backgroud: {
    backgroundColor: COLORS.secondary_backgroud,
    width: "100%",
    height: 100,
  },
  primary_backgroud: {
    backgroundColor: COLORS.primary_backgroud,
    padding: SPACING * 2,
    borderRadius: SPACING * 3,
    bottom: SPACING * 3,
  },
  Logo: {
    width: 205,
    height: 105,
    alignSelf: "center",
    marginBottom: 5,
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
    width: "80%",
  },
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 16,
  },
  iniciar_sesion_text: {
    color: "#000000",
    textAlign: "center",
    textDecorationLine: "underline",

    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
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
});
