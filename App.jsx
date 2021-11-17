import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

import { getApps, initializeApp } from 'firebase/app';

import InitialStartingScreen from './src/screens/InitialStartingScreen';
import HomeScreen from './src/screens/HomeScreen';
import MemoListScreen from './src/screens/MemoListScreen';
import MemoEditScreen from './src/screens/MemoEditScreen';
import MemoCreateScreen from './src/screens/MemoCreateScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import TaskEditScreen from './src/screens/TaskEditScreen';
import TaskCreateScreen from './src/screens/TaskCreateScreen';
import ScheduleListScreen from './src/screens/ScheduleListScreen';
import ScheduleEditScreen from './src/screens/ScheduleEditScreen';
import ScheduleCreateScreen from './src/screens/ScheduleCreateScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import CalendarDetailScreen from './src/screens/CalendarDetailScreen';
import SettingScreen from './src/screens/SettingScreen';
import SettingMainColorScreen from './src/screens/SettingMainColorScreen';
import SettingBackgroundImageScreen from './src/screens/SettingBackgroundImageScreen';
import SettingModelChangeScreen from './src/screens/SettingModelChangeScreen';
import LogInScreen from './src/screens/LogInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import PasswordResetScreen from './src/screens/PasswordResetScreen';

import { GlobalContext } from './src/contexts';
import appTheme from './src/style/theme';
import AppBar from './src/components/AppBar';
import Button from './src/components/Button';
import Icon from './src/components/Icon';

import { MigrationController } from './src/lib/storage/migration';
import {
  AddNotificationIdToSchedulesTable,
  AddNotificationIdToTasksTable,
  CreateMemosTable,
  CreateSchedulesTable,
  CreateTasksTable,
} from './src/classes/migration';

import { firebaseConfig } from './env';

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [theme, setTheme] = useState('navy');
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    const migration = new MigrationController();
    const migrate = async () => {
      try {
        await migration.init();
        console.log('Initialized Migration!');
        await migration.migrate([
          CreateMemosTable,
          CreateTasksTable,
          CreateSchedulesTable,
          AddNotificationIdToTasksTable,
          AddNotificationIdToSchedulesTable,
        ]);
        console.log('Migrated!');
      } catch (error) {
        console.log(error);
      }
    };
    migrate();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        theme, setTheme, backgroundImage, setBackgroundImage,
      }}
    >
      <StatusBar barStyle={appTheme[theme].statusbarStyle} />
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName="Root"
          initialRouteName="InitialStarting"
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            header: ({ navigation, options, back }) => (
              <AppBar
                title={options.title}
                left={
                  back ? (
                    <Button
                      label={<Icon name="arrow-left" size={24} color={appTheme[theme].colorOnGradientColors1} />}
                      onPress={navigation.goBack}
                      backgroundColor="#0000"
                      height={50}
                      width={68}
                    />
                  ) : null
                }
                right={options.headerRight}
              />
            ),
          }}
        >
          <Stack.Screen
            name="InitialStarting"
            component={InitialStartingScreen}
            options={{ title: 'My Notes' }}
          />
          <Stack.Screen
            name="Root"
            component={Root}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MemoEdit"
            component={MemoEditScreen}
            options={{ title: 'メモ' }}
          />
          <Stack.Screen
            name="TaskEdit"
            component={TaskEditScreen}
            options={{ title: 'タスク' }}
          />
          <Stack.Screen
            name="ScheduleEdit"
            component={ScheduleEditScreen}
            options={{ title: '予定' }}
          />
          <Stack.Screen
            name="CalendarDetail"
            component={CalendarDetailScreen}
            options={{ title: '' }}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{ title: '設定' }}
          />
          <Stack.Screen
            name="SettingMainColor"
            component={SettingMainColorScreen}
            options={{ title: 'メインカラー' }}
          />
          <Stack.Screen
            name="SettingBackgroundImage"
            component={SettingBackgroundImageScreen}
            options={{ title: '背景' }}
          />
          <Stack.Screen
            name="SettingModelChange"
            component={SettingModelChangeScreen}
            options={{ title: '機種変更' }}
          />
          <Stack.Screen
            name="LogIn"
            component={LogInScreen}
            options={{ title: 'ログイン' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: '会員登録' }}
          />
          <Stack.Screen
            name="PasswordReset"
            component={PasswordResetScreen}
            options={{ title: 'パスワード再設定' }}
          />
          <Stack.Group
            screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
          >
            <Stack.Screen
              name="MemoCreate"
              component={MemoCreateScreen}
              options={{ title: 'メモ' }}
            />
            <Stack.Screen
              name="TaskCreate"
              component={TaskCreateScreen}
              options={{ title: 'タスク' }}
            />
            <Stack.Screen
              name="ScheduleCreate"
              component={ScheduleCreateScreen}
              options={{ title: '予定' }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContext.Provider>
  );
}

function Root() {
  const { theme } = useContext(GlobalContext);
  return (
    <Drawer.Navigator
      screenOptions={{
        header: ({ navigation, options }) => (
          <AppBar
            title={options.title}
            left={(
              <Button
                label={<Icon name="menu" size={24} color={appTheme[theme].colorOnGradientColors1} />}
                onPress={() => navigation.openDrawer()}
                backgroundColor="#0000"
                height={50}
                width={68}
              />
            )}
            right={options.headerRight}
          />
        ),
        drawerActiveBackgroundColor: '#fff',
        drawerStyle: {
          backgroundColor: appTheme[theme].backgroundColor1,
        },
        drawerActiveTintColor: appTheme[theme].backgroundColor1,
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          fontSize: 18,
          paddingLeft: 24,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'ホーム' }}
      />
      <Drawer.Screen
        name="MemoList"
        component={MemoListScreen}
        options={{ title: 'メモ' }}
      />
      <Drawer.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: 'タスク' }}
      />
      <Drawer.Screen
        name="ScheduleList"
        component={ScheduleListScreen}
        options={{ title: '予定' }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'カレンダー' }}
      />
      <Drawer.Screen
        name="Setting"
        component={SettingScreen}
        options={{ title: '設定' }}
      />
    </Drawer.Navigator>
  );
}
