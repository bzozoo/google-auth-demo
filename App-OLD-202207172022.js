// expo install expo-web-browser expo-auth-session expo-random
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View, Text, Image, Button } from 'react-native';
import * as AuthSession from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { showMessage, hideMessage } from "react-native-flash-message";

if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function App() {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState("Start");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "890705278336-sr2t9fg1o1s871chnbj3cn7skvsud7eb.apps.googleusercontent.com",
    iosClientId: "890705278336-n2pjkdvp4uu093onan9cuqbgognjgs2u.apps.googleusercontent.com",
    expoClientId: "890705278336-2ld11nu4qn8uoc3lrb9tf6aabo5t1cod.apps.googleusercontent.com"
  });

  

  const singInWithGoogle = async () => {
    promptAsync().then(async (response)=>{
      setMessage(JSON.stringify(response?.type));
      if (response?.type === "success") {
        setAccessToken(response.authentication.accessToken);
        await getUserData(response.authentication.accessToken)
      }
    }).catch((error) =>{ 
      alert(error)
      console.log(error)
    })
  }

  async function getUserData(accessToken) {

    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}`}
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });

    showMessage({
      position: {top: 55},
      message: accessToken,
      type: "info",
    });

  }

  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{uri: userInfo.picture}} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text>
        DEMO{"\n"}
        {message}
      </Text>
      {showUserInfo()}
      <Button 
        title={userInfo ? "Switch account..." : "Login ..."}
        //onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true, showInRecents: false}) }}
        onPress={singInWithGoogle}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50
  }
});
