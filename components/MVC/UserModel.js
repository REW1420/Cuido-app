export default class UserModel {
  //Metodo para crear usuarios nuevos

  async createUser(userData) {
    const response = await fetch(
      "https://cuido-middleware.000webhostapp.com/api/users",
      {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
}
