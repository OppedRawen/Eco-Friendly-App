import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // console.log("Logged in:", userCredential.user);
        navigation.replace("MainApp");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
      {/* Wrap the whole component inside a View to prevent the error */}
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address" // Suggests an email keyboard for better UX
          returnKeyType="next" // Move to the password input field when pressing "next" on the keyboard
          onSubmitEditing={() => this.passwordInput.focus()} // Moves to password input when enter is pressed
        />
        <TextInput
          ref={(input) => { this.passwordInput = input }} // Ref to access the password input field
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          returnKeyType="done" // Displays "done" on the keyboard
          onSubmitEditing={handleLogin} // Trigger login when enter is pressed
        />
        <Button title="Log In" onPress={handleLogin} />
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
});
