const colorOnMainGradientColors = '#fff';
const appOpacity = 0.9;
const mainGradientColors = ['#393960', '#000033'];
const subGradientColors = ['rgba(238, 238, 255, 0.9)', 'rgba(227, 227, 237, 0.9)'];
const whiteGradientColors = ['rgba(255, 255, 255, 0.9)', 'rgba(238, 238, 255, 0.9)'];
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
    backgroundColor: '#0000',
    color: '#fff',
    height: 50,
    padding: 0,
    width: 68,
  },
  appbarTitle: {
    color: '#fff',
    fontSize: 32,
  },
  checkbox: {
    checkedColor: '#0f0',
    fontSize: 24,
    uncheckedColor: '#000',
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
    backgroundColor: '#0000',
    color: '#f00',
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
    backgroundColor: '#fff',
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
