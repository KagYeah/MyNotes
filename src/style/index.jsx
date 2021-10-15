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
  typeListItem: {
    color: colorOnMainGradientColors,
    count: 3,
    fontSize: 18,
    gradientColors: mainGradientColors,
  },
  typeListBackground: {
    backgroundColor: black,
    opacity: 0.5,
  },
};
