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
  Pressable,
} from "react-native";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import UserModel from "../MVC/UserModel";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Dimensions } from "react-native";
import { useState } from "react";
import { auth } from "../utils/firebase";
import { useTogglePasswordVisibility } from "../utils/useTogglePasswordVisibility";

const { width, height } = Dimensions.get("screen");
const userModel = new UserModel();

export default function SingUp({ navigation }) {
  //hook for the form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(2);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^[0-9]{8}$/;

  //handle text form

  const handleText = (value, setState) => {
    setState(value);

    if (validPassword == password) {
      setIsPasswordValid(1);
    } else {
      setIsPasswordValid(0);
    }
  };

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  async function createUser() {
    await createUserWithEmailAndPassword(auth, email, validPassword)
      .then((UserCredentials) => {
        console.log(UserCredentials.user.uid);

        const userData = {
          user_id: UserCredentials.user.uid,
          first_name: name,
          second_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password: validPassword,
          role: "client",
        };

        userModel.createUser(userData);

      

        navigation.navigate("login");
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  }

  const showToastInvalidPassword = () => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Las contraseñas no coinciden",
      visibilityTime: 3000,
      position: "top",
    });
  };
  const showToastNullData = () => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Todos los datos vacio",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const showToastSomeNullData = () => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Algun dato vacio",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const showToastInvalidEmail = () => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Correo invalido",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const showToastInvalidPhoneNumber = () => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Numero telefonico invalido",
      visibilityTime: 3000,
      position: "top",
    });
  };

  const handleCreateUser = () => {
    if (
      email === "" &&
      name === "" &&
      lastName === "" &&
      phoneNumber === "" &&
      password === "" &&
      validPassword === ""
    ) {
      showToastNullData();
    } else if (
      email === "" ||
      name === "" ||
      lastName === "" ||
      phoneNumber === "" ||
      password === "" ||
      validPassword === ""
    ) {
      showToastSomeNullData();
    } else if (emailRegex.test(email) === false) {
      showToastInvalidEmail();
    } else if (phoneNumberRegex.test(phoneNumber) === false) {
      showToastInvalidPhoneNumber();
    } else if (validPassword !== password) {
      showToastInvalidPassword();
    } else {
      createUser();
    }
  };
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
              height: 150,
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
                onChangeText={(value) => handleText(value, setEmail)}
                value={email}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Nombre"
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setName)}
                value={name}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Apellido"
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setLastName)}
                value={lastName}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Numero de telefono"
                placeholderTextColor={COLORS.input_text}
                keyboardType="numeric"
                onChangeText={(value) =>
                  handleText(value.toString(), setPhoneNumber)
                }
                value={phoneNumber}
              />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Contraseña"
                secureTextEntry={passwordVisibility}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setPassword)}
                value={password}
              />
              <Pressable onPress={handlePasswordVisibility}>
                <Icon name={rightIcon} size={22} color="#232323" />
              </Pressable>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Repetir contraseña"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setValidPassword)}
                value={validPassword}
              />
              <Pressable onPress={handlePasswordVisibility}>
                <Icon name={rightIcon} size={22} color="#232323" />
              </Pressable>
            </View>
          </View>

          <View style={styles.container}>
            <TouchableOpacity
              style={
                isPasswordValid == 2
                  ? styles.button
                  : isPasswordValid == 1
                  ? styles.invalidButton
                  : styles.button
              }
              onPress={handleCreateUser}
            >
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
        <Toast ref={Toast.setRef} />
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
  invalidButton: {
    backgroundColor: "#c9977f",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
