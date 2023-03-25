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

export default function App() {
  return (
    <>
      <ScrollView>
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
              source={require("../assets/CuidoLogo150x300.png")}
            />
          </View>

          <TextInput
            style={styles.inputTxt}
            placeholder="Correo"
            placeholderTextColor={COLORS.input_text}
          />
          <TextInput
            style={styles.inputTxt}
            placeholder="Contraseña"
            secureTextEntry={true}
            placeholderTextColor={COLORS.input_text}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Registrarse</Text>
          </TouchableOpacity>
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
    width: "115%",
    height: 160,
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
    margin:10,
    width: "80%",
  },
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
