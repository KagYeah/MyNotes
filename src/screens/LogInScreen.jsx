import React, { useContext, useState } from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function LogInScreen(props) {
  const { navigation } = props;
  const { theme, backgroundImage } = useContext(GlobalContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();

  function logIn() {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.code);
        Alert.alert('ログインに失敗しました。');
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
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />

          <TextInput
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            textContentType="password"
            value={password}
          />

          <Button
            label="ログイン"
            onPress={logIn}
            color={appTheme[theme].colorOnGradientColors1}
            style={styles.submit}
            height={40}
            width={128}
            linearGradient
            options={{ colors: appTheme[theme].gradientColors1 }}
          />

          <View style={styles.footer}>
            <View style={styles.row}>
              <Text style={styles.text}>会員登録は</Text>
              <Text
                style={styles.link}
                onPress={() => { navigation.navigate('SignUp'); }}
              >
                こちら
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>パスワードを忘れた方は</Text>
              <Text
                style={styles.link}
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  input: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    fontSize: 18,
    height: 34,
    padding: 8,
    marginTop: 24,
  },
  submit: {
    alignSelf: 'center',
    marginTop: 24,
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
