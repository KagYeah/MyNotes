import React, { useContext, useState } from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function PasswordResetScreen(props) {
  const { navigation } = props;
  const { theme, backgroundImage } = useContext(GlobalContext);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  function sendEmail() {
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('メールの送信に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <Loading isLoading={isLoading} />
        <View style={styles.centeredView}>
          <View style={styles.description}>
            <Text style={styles.text}>記入したメールアドレス宛にパスワード再設定用のメールを送信します。</Text>
          </View>

          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          <Button
            label="送信"
            onPress={sendEmail}
            color={appTheme[theme].colorOnGradientColors1}
            style={styles.submit}
            height={40}
            width={128}
            linearGradient
            options={{ colors: appTheme[theme].gradientColors1 }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  description: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  input: {
    height: 34,
    marginTop: 24,
    padding: 8,
    fontSize: 18,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
  },
  submit: {
    alignSelf: 'center',
    marginTop: 24,
  },
});
