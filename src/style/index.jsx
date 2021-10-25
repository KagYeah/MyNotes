import { Platform } from 'react-native';

// color
const black = '#000';
const blue = '#39f';
const gray = '#ccc';
const green = '#0f0';
const red = '#f00';
const white = '#fff';

const transparent = '#0000';

const colorOnMainGradientColors = white;
const colorOnSubMainBackgroundColor = black;
const mainBackgraoundColor = '#003';
const subMainBackgorundColor = '#e3e3ed';

// colors for LinearGradient
const subGradientColors = ['rgba(238, 238, 255, 0.9)', 'rgba(227, 227, 237, 0.9)'];
const mainGradientColors = ['#393960', '#000033'];
const whiteGradientColors = ['rgba(255, 255, 255, 0.9)', 'rgba(238, 238, 255, 0.9)'];

// opacity
const appOpacity = 0.9;

// eslint-disable-next-line import/prefer-default-export
export const appStyles = {
  statusbar: {
    barStyle: 'light-content',
  },
  allCheckButton: {
    backgroundColor: transparent,
    color: blue,
    width: 80,
  },
  app: {
    backgroundColor: '#eef',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  appbar: {
    gradientColors: mainGradientColors,
    height: 104,
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  appbarButton: {
    backgroundColor: transparent,
    color: colorOnMainGradientColors,
    height: 50,
    padding: 0,
    width: 68,
  },
  appbarTitle: {
    color: colorOnMainGradientColors,
    fontSize: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonLarge: {
    color: colorOnMainGradientColors,
    gradientColors: mainGradientColors,
    height: 40,
    margin: 40,
    width: 200,
  },
  buttonMedium: {
    color: colorOnMainGradientColors,
    gradientColors: mainGradientColors,
    height: 40,
    margin: 24,
    width: 80,
  },
  calendar: {
    borderColor: black,
    currenMonthNumberColor: black,
    dateBorderColor: gray,
    dateHeight: 56,
    dateWidth: 48,
    defaultBackgroundColor: white,
    dotColor: gray,
    fontSize: 18,
    holidayBackgroundColor: '#fee',
    notCurrentMonthNumberColor: gray,
    opacity: appOpacity,
    saturdayBackgroundColor: '#eaf5ff',
    todayBorderColor: black,
  },
  calendarHeader: {
    color: black,
    gradientColors: subGradientColors,
    height: 48,
    marginBottom: 48,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  calendarHeaderButton: {
    backgroundColor: transparent,
  },
  checkbox: {
    checkedColor: green,
    fontSize: 24,
    uncheckedColor: black,
  },
  circleButton: {
    color: colorOnMainGradientColors,
    gradientColors: mainGradientColors,
    size: 48,
  },
  colorPod: {
    height: 32,
    width: 32,
  },
  createButton: {
    bottom: 24,
    fontSize: 32,
    position: 'absolute',
    right: 24,
  },
  datetimeInput: {
    backgroundColor: subMainBackgorundColor,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    color: colorOnSubMainBackgroundColor,
    fontSize: 18,
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  datetimePicker: {
    backgroundColor: subMainBackgorundColor,
  },
  deleteButton: {
    backgroundColor: transparent,
    color: red,
    fontSize: 18,
    fontWeight: 'bold',
    height: 54,
    width: 68,
  },
  deleteButtonInListHeader: {
    height: 32,
    width: 68,
  },
  drawer: {
    activeBackgroundColor: white,
    activeTintColor: mainBackgraoundColor,
    backgroundColor: mainBackgraoundColor,
    inactiveTintColor: white,
    fontSize: 18,
    paddingLeft: 24,
  },
  idPasswordInput: {
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    fontSize: 18,
    height: 34,
    margin: 24,
    padding: 8,
  },
  keyboardAvoidingView: {
    behavior: Platform.OS === 'ios' ? 'padding' : null,
    verticalOffset: Platform.OS === 'ios' ? 104 : 0,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    gradientColors: subGradientColors,
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  listHeaderRight: {
    width: '20%',
  },
  listItem: {
    backgroundColor: white,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    height: 72,
    opacity: appOpacity,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  listItemRight: {
    width: '20%',
  },
  listItemTitle: {
    fontSize: 18,
    lineHeight: 32,
  },
  listItemSubTitle: {
    fontSize: 12,
    lineHeight: 24,
    paddingStart: 8,
  },
  listItemWithCheckBox: {
    gradientColors: whiteGradientColors,
  },
  loading: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: black,
    zIndex: 200,
  },
  noteBodyInput: {
    backgroundColor: transparent,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    color: black,
    fontSize: 16,
    minHeight: 400,
    // if you set opacity, edit styles.container.opacity in src/components/NoteBodyInput.jsx
    // opacity: appOpacity,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  noteTitleInput: {
    backgroundColor: white,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    color: black,
    fontSize: 18,
    maxHeight: 96,
    opacity: appOpacity,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  saveButton: {
    bottom: 24,
    fontSize: 24,
    position: 'absolute',
    right: 24,
  },
  settingListItem: {
    fontSize: 18,
    gradientColors: whiteGradientColors,
    height: 48,
  },
  typeListItem: {
    color: colorOnMainGradientColors,
    count: 3,
    fontSize: 18,
    gradientColors: mainGradientColors,
    height: 48,
    opacity: 1,
  },
  typeListBackground: {
    backgroundColor: black,
    opacity: 0.5,
  },
  uploadButton: {
    color: blue,
    fontSize: 18,
    height: 48,
  },
};
