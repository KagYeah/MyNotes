import React, { useContext } from 'react';
import {
  element, func, number, oneOfType, shape, string,
} from 'prop-types';

import { GlobalContext } from '../contexts';
import Button from './Button';
import appTheme from '../style/theme';

export default function CircleButton(props) {
  const { theme } = useContext(GlobalContext);
  const {
    label, onPress, style, size, fontSize, fontWeight,
  } = props;

  return (
    <Button
      label={label}
      onPress={onPress}
      style={style}
      borderRadius={size / 2}
      height={size}
      width={size}
      color={appTheme[theme].colorOnGradientColors1}
      fontSize={fontSize}
      fontWeight={fontWeight}
      linearGradient
      options={{ colors: appTheme[theme].gradientColors1 }}
    />
  );
}

CircleButton.propTypes = {
  label: oneOfType([string, element]).isRequired,
  onPress: func.isRequired,
  style: shape(),
  size: number,
  fontSize: number,
  fontWeight: string,
};

CircleButton.defaultProps = {
  style: {},
  size: 48,
  fontSize: 24,
  fontWeight: 'normal',
};
