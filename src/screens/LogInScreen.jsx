import React, { useContext, useState } from 'react';
import {
  ImageBackground, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function LogInScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
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
            label="ログイン"
            onPress={() => {
              navigation.goBack();
            }}
            color={appStyles(theme).buttonMedium.color}
            style={styles(theme).submit}
            height={appStyles(theme).buttonMedium.height}
            width={appStyles(theme).buttonMedium.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonMedium.gradientColors }}
          />

          <View style={styles(theme).footer}>
            <View style={styles(theme).row}>
              <Text style={styles(theme).text}>会員登録は</Text>
              <Text
                style={styles(theme).link}
                onPress={() => { navigation.navigate('SignUp'); }}
              >
                こちら
              </Text>
            </View>
            <View style={styles(theme).row}>
              <Text style={styles(theme).text}>パスワードを忘れた方は</Text>
              <Text
                style={styles(theme).link}
                onPress={() => { navigation.navigate('PasswordReset'); }}
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
