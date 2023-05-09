import { method } from "lodash";

export default class UserModel {
  //Metodo para crear usuarios nuevos

  async createUser(userData) {
    const response = await fetch("https://cuido-middleware.000webhostapp.com/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newUser = await response.json();
    console.log(newUser);
    return newUser;
  }

  async getUserDataByID(user_id) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/users/code/${user_id}`
    );
    const userData = await response.json();
    console.log(userData);
    return userData;
  }

  async getUserDeliverer() {
    const response = await fetch(
      "https://cuido-middleware.000webhostapp.com/api/users/role/deliverer"
    );
    const deliverer = await response.json();
    console.log("Model", deliverer);
    return deliverer;
  }
  async getUserRoleByEmail(email) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/users/user-role/${email}`
    );
    const role = await response.json();
    console.log(role);
    return role;
  }

  async updateUserData(user_id, newUserData) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/users/up/${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      }
    );

    if (response.ok) {
      console.log(response.json);
    } else console.log(`HTTP error! status: ${response.status}`);
  }
  async updateUserEmail(user_id, newEmail) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/users/up-email/${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmail),
      }
    );

    if (response.ok) {
      console.log(response.json);
    } else console.log(`HTTP error! status: ${response.status}`);
  }
}
