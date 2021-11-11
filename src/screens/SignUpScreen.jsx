import React, { useContext, useState } from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { appStyles } from '../style';

export default function SignUpScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function signUp() {
    const auth = getAuth();

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate('Root', { screen: 'Setting' });
      })
      .catch((error) => {
        console.log(error.code);
        Alert.alert('登録に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <Loading isLoading={isLoading} />

        <View style={styles(theme).centeredView}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            style={styles(theme).input}
            textContentType="emailAddress"
            value={email}
          />

          <TextInput
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            secureTextEntry
            style={styles(theme).input}
            textContentType="password"
            value={password}
          />

          <Button
            label="登録"
            onPress={signUp}
            color={appStyles(theme).buttonMedium.color}
            style={styles(theme).submit}
            height={appStyles(theme).buttonMedium.height}
            width={appStyles(theme).buttonMedium.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonMedium.gradientColors }}
          />

          <View style={styles(theme).footer}>
            <View style={styles(theme).row}>
              <Text style={styles(theme).text}>ログインは</Text>
              <Text
                style={styles(theme).link}
                onPress={() => { navigation.navigate('LogIn'); }}
              >
                こちら
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appStyles(theme).app.paddingHorizontal,
  },
  input: {
    borderColor: appStyles(theme).idPasswordInput.borderColor,
    borderWidth: appStyles(theme).idPasswordInput.borderWidth,
    fontSize: appStyles(theme).idPasswordInput.fontSize,
    height: appStyles(theme).idPasswordInput.height,
    padding: appStyles(theme).idPasswordInput.padding,
    marginTop: appStyles(theme).idPasswordInput.margin,
  },
  submit: {
    alignSelf: 'center',
    marginTop: appStyles(theme).buttonMedium.margin,
  },
  footer: {
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
  },
  link: {
    color: '#39f',
    fontSize: 16,
  },
});
