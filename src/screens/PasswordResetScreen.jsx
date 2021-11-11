import React, { useContext, useState } from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { appStyles } from '../style';

export default function PasswordResetScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  function sendEmail() {
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('メールの送信に失敗しました。');
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
          <View style={styles(theme).description}>
            <Text style={styles(theme).text}>記入したメールアドレス宛にパスワード再設定用のメールを送信します。</Text>
          </View>

          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            style={styles(theme).input}
            textContentType="emailAddress"
            value={email}
          />

          <Button
            label="送信"
            onPress={sendEmail}
            color={appStyles(theme).buttonMedium.color}
            style={styles(theme).submit}
            height={appStyles(theme).buttonMedium.height}
            width={appStyles(theme).buttonMedium.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonMedium.gradientColors }}
          />
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
  description: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
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
});
