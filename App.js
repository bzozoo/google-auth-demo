// expo install expo-web-browser expo-auth-session expo-random
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View, ScrollView, Text, Image, Button } from 'react-native';
import * as AuthSession from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { showMessage, hideMessage } from "react-native-flash-message";

if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [userInfoRun, setUserInfoRun] = React.useState("No downloaded");
  const [accessToken, setAccessToken] = React.useState("Not present")
  const [responseObj, setResponseObj] = React.useState();
  const [errMess, setErrmess] = React.useState("No error");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "890705278336-sr2t9fg1o1s871chnbj3cn7skvsud7eb.apps.googleusercontent.com",
    iosClientId: "890705278336-n2pjkdvp4uu093onan9cuqbgognjgs2u.apps.googleusercontent.com",
    expoClientId: "890705278336-2ld11nu4qn8uoc3lrb9tf6aabo5t1cod.apps.googleusercontent.com"
  });

  React.useEffect(()=>{
    if(response !== null){
      setResponseObj(JSON.stringify(response));
    }
    
    if (response?.type === "success") {
      const accessTok = response.authentication.accessToken;
      setAccessToken(accessTok);
    }
  }, [response])

  React.useEffect(()=>{
    if(accessToken !== "Not present"){

      async function userSettings(){
        const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}`}
      });

      setUserInfoRun("Csak majdnem")

        userInfoResponse.json().then(data => {
          setUserInfoRun(JSON.stringify(data))
          setUserInfo(data);
        });
      }
      userSettings();
    }
  }, [accessToken])

  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{uri: userInfo.picture}} style={styles.profilePic} />
          <Text> Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text>
        DEMO{"\n"}
        <ScrollView style={styles.scrollpanel}>
          <Text>
            ResObj?: {responseObj} -{"\n"}
            AccessT?: {accessToken} -{"\n"}
            Error?: {errMess} -{"\n"}
            UserinfoObject?: {userInfoRun}{"\n"}    
          </Text>
        </ScrollView>
      </Text>
      {showUserInfo()}
      <Button 
        title={userInfo ? "Switch account..." : "Login ..."}
        onPress={()=>promptAsync()}
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
  scrollpanel: {
    backgroundColor: 'lightgreen',
    flexGrow: 0.8
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
