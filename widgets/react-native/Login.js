import React, { useState } from "react";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useAccessTokenStore } from "./userStore";
import { ENV_ApiUrl, ENV_ClientId, ENV_ClientSecret, ENV_EmailAddress, ENV_ApiKey, ENV_ADMINEmailAddress, ENV_PartnerId } from "./environment";

// TODO
// create a user if they dont exist
// use the feed endpoint
// login with new user
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function createUserWithFeed(token) {
  try {
    const apiUrl = `${ENV_ApiUrl}platform/feed/users`;
    const payload = {
      "partnerId": ENV_PartnerId,
      "externalRef": generateRandomString(),
      "userDetails": {
        "emailAddress": ENV_EmailAddress,
        "externalPolicyNumber": "123232",
        "mobilePhoneNumber": "+353555444333",
        "firstName": "John",
        "surname": "Doe",
        "locale": "en-GB",
        "commsEmail": true,
        "commsSms": true
      },
      "policies": [
        {
          "externalPolicyNumber": "123232",
          "policyStart": "2022-01-01",
          "policyEnd": "2025-12-31",
          "propositionId": "suprise-me-prop-v1",
          "maxInsured": 10,
          "maxUses": 5
        }
      ]
    };

    console.log(payload);

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "x-api-key": ENV_ApiKey,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function SSOloginWithEmail(email) {
  try {
    const apiUrl = `${ENV_ApiUrl}platform/user/sso`;

    const requestData = {
      emailAddress: email,
      clientId: ENV_ClientId,
      clientSecret: ENV_ClientSecret,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ENV_ApiKey,
      },
      body: JSON.stringify(requestData),
    });

    return await response.json();
  } catch (error) {
    console.error('There was a problem with the login request:', error);
    throw error;
  }
}

export default function Login({ navigation }) {

  const { setAccessToken } = useAccessTokenStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const loginResponse = await SSOloginWithEmail(ENV_EmailAddress);

      if (loginResponse.code === 'USER_NOT_FOUND') {
        const adminLoginResponse = await SSOloginWithEmail(ENV_ADMINEmailAddress);
        const userCreateResponse = await createUserWithFeed(adminLoginResponse.accessToken);
        const loginResponse = await SSOloginWithEmail(ENV_EmailAddress);
        setAccessToken(loginResponse.accessToken);
        navigation.navigate('Home');
        return;
      }

      setAccessToken(loginResponse.accessToken);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Set loading state back to false when login finishes
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.createAccount}>Authorise Email:</Text>
      <Text style={styles.createAccount}>{ENV_EmailAddress}</Text>

      <TouchableOpacity onPress={handleLogin} style={styles.createAccountBtn}>
        {isLoading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text style={styles.createAccount}>Authorise</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alingnItems: "center",
    padding: 40,
    backgroundColor: "#f3f9ff",
  },
  inputView: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
  },
  textInput: {
    height: 40,
    backgroundColor: "#f0f0fa",
    borderRadius: 2,
    padding: 10,
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#242945",
  },
  seConnecter: {
    fontSize: 14,
    color: "#ffffff",
  },
  seConnecterBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#242945",
    borderRadius: 5,
    marginTop: 5,
  },
  ou: {
    color: "#6e0b14",
  },
  noteBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    margin: 10,
    color: "rgba(36, 41, 69, 0.28)",
  },
  createAccountBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "rgba(36, 41, 69, 0.5)",
  },
  createAccount: {
    fontSize: 14,
    color: "#242945",
  },
});


const MyLoadingButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    // Set loading to true when button is pressed
    setIsLoading(true);

    // Simulate an asynchronous task (e.g., fetching data)
    setTimeout(() => {
      // After the task is complete, set loading to false
      setIsLoading(false);
      // Optionally, you can perform additional actions here
      Alert.alert('Task completed!');
    }, 2000); // Simulating a 2-second delay
  };

  return (
    <View>
      {/* Button is disabled and shows loading indicator when isLoading is true */}
      <Button title={isLoading ? "Loading..." : "Press Me"} disabled={isLoading} onPress={handlePress} />
      {/* Show loading indicator when isLoading is true */}
      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
};