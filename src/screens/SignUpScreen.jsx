import React, { useContext, useState } from 'react';
import {
  Alert, ImageBackground, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function SignUpScreen(props) {
  const { navigation } = props;
  const { theme, backgroundImage } = useContext(GlobalContext);

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
      .catch(() => {
        Alert.alert('登録に失敗しました。');
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
            label="登録"
            onPress={signUp}
            color={appTheme[theme].colorOnGradientColors1}
            style={styles.submit}
            height={48}
            width={128}
            linearGradient
            options={{ colors: appTheme[theme].gradientColors1 }}
          />

          <View style={styles.footer}>
            <View style={styles.row}>
              <Text style={styles.text}>ログインは</Text>
              <Text
                style={styles.link}
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    marginTop: 24,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 40,
  },
  row: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  link: {
    color: '#39f',
    fontSize: 16,
  },
});
