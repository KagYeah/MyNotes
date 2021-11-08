import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

import InitialStartingScreen from './src/screens/InitialStartingScreen';
import InitialSettingScreen from './src/screens/InitialSettingScreen';
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
import SettingModelChangeDoneScreen from './src/screens/SettingModelChangeDoneScreen';

import AppBar from './src/components/AppBar';
import Button from './src/components/Button';
import { appStyles } from './src/style';
import { BackgroundImageContext, ThemeContext } from './src/contexts';

import { MigrationController } from './src/lib/storage/migration';
import {
  AddNotificationIdToSchedulesTable,
  AddNotificationIdToTasksTable,
  CreateMemosTable,
  CreateSchedulesTable,
  CreateTasksTable,
} from './src/classes/migration';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

import * as FileSystem from 'expo-file-system';
export default function App() {
  const [theme, setTheme] = useState('navy');
  const [backgroundImage, setBackgroundImage] = useState(null);

  console.log(FileSystem.documentDirectory);
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
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BackgroundImageContext.Provider value={{ backgroundImage, setBackgroundImage }}>
        <StatusBar barStyle={appStyles(theme).statusbar.barStyle} />
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
                        label="<"
                        onPress={navigation.goBack}
                        backgroundColor={appStyles(theme).appbarButton.backgroundColor}
                        color={appStyles(theme).appbarButton.color}
                        height={appStyles(theme).appbarButton.height}
                        width={appStyles(theme).appbarButton.width}
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
              name="InitialSetting"
              component={InitialSettingScreen}
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
              name="SettingModelChangeDone"
              component={SettingModelChangeDoneScreen}
              options={{ title: '機種変更' }}
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
      </BackgroundImageContext.Provider>
    </ThemeContext.Provider>
  );
}

function Root() {
  const { theme } = useContext(ThemeContext);
  return (
    <Drawer.Navigator
      screenOptions={{
        header: ({ navigation, options }) => (
          <AppBar
            title={options.title}
            left={(
              <Button
                label="三"
                onPress={() => navigation.openDrawer()}
                backgroundColor={appStyles(theme).appbarButton.backgroundColor}
                color={appStyles(theme).appbarButton.color}
                height={appStyles(theme).appbarButton.height}
                width={appStyles(theme).appbarButton.width}
              />
            )}
            right={options.headerRight}
          />
        ),
        drawerActiveBackgroundColor: appStyles(theme).drawer.activeBackgroundColor,
        drawerStyle: {
          backgroundColor: appStyles(theme).drawer.backgroundColor,
        },
        drawerActiveTintColor: appStyles(theme).drawer.activeTintColor,
        drawerInactiveTintColor: appStyles(theme).drawer.inactiveTintColor,
        drawerLabelStyle: {
          fontSize: appStyles(theme).drawer.fontSize,
          paddingLeft: appStyles(theme).drawer.paddingLeft,
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
