import { MyContextControllerProvider } from "../Lab10/src/store"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import Router from "./src/routers/Router"

const App = () => {
  const USERS = firestore().collection("USERS")
  const admin = {
      fullName: "Admin",
      email: "vanhuudhsp@gmail.com",
      password: "123456",
      phone: "0913131732",
      address: "Binh Duong",
      role: "admin"
  }

  useEffect(() => {
      // Tạo tài khoản admin
      USERS.doc(admin.email)
      .onSnapshot(
          u => {
              if(!u.exists)
              {
                  auth().createUserWithEmailAndPassword(admin.email, admin.password)
                  .then(respone => 
                  {
                      USERS.doc(admin.email).set(admin)
                      console.log("Add new account admin")
                  }
                  )
              }
          }
      )
  }, [])

  return (
      <MyContextControllerProvider>
          <NavigationContainer>
              <Router />
          </NavigationContainer>
      </MyContextControllerProvider>
  )
}

export default App