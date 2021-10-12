// color
const black = '#000';
const green = '#0f0';
const red = '#f00';
const white = '#fff';

const transparent = '#0000';

const colorOnMainGradientColors = white;

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
  app: {
    backgroundColor: '#eef',
  },
  appbar: {
    gradientColors: mainGradientColors,
    height: 104,
    paddingBottom: 16,
    paddingHorizontal: 16,
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
  deleteButton: {
    backgroundColor: transparent,
    color: red,
    fontWeight: 'bold',
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
};
