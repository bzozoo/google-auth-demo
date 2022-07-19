// expo install expo-web-browser expo-auth-session expo-random
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View, Text, Image, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
const updated = "at 19:51"

if (Platform.OS === 'web') {
  alert("YES IT IS WEB!")
  WebBrowser.maybeCompleteAuthSession();
}

export default function App() {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "890705278336-sr2t9fg1o1s871chnbj3cn7skvsud7eb.apps.googleusercontent.com",
    iosClientId: "890705278336-n2pjkdvp4uu093onan9cuqbgognjgs2u.apps.googleusercontent.com",
    expoClientId: "890705278336-2ld11nu4qn8uoc3lrb9tf6aabo5t1cod.apps.googleusercontent.com"
  });

  React.useEffect(() => {
    setMessage(JSON.stringify(response?.type));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}`}
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
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
        DEMO {updated}{"\n"}
        {message}
      </Text>
      {showUserInfo()}
      <Button 
        title={accessToken ? "Get User Data" : "Login ..."}
        //onPress={accessToken ? getUserData : () => { promptAsync({useProxy: true, showInRecents: false}) }}
        onPress={accessToken ? getUserData : () => { promptAsync({ showInRecents: false }) }}
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
