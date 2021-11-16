import React, { useContext } from 'react';
import { func, number, shape } from 'prop-types';

import { GlobalContext } from '../contexts';
import Button from './Button';
import { appStyles } from '../style';

export default function DeleteButton(props) {
  const { theme } = useContext(GlobalContext);
  const {
    onPress, style, height, width,
  } = props;

  return (
    <Button
      label="削除"
      onPress={onPress}
      style={style}
      backgroundColor={appStyles(theme).deleteButton.backgroundColor}
      height={height}
      width={width}
      color={appStyles(theme).deleteButton.color}
      fontSize={appStyles(theme).deleteButton.fontSize}
      fontWeight={appStyles(theme).deleteButton.fontWeight}
    />
  );
}

DeleteButton.propTypes = {
  onPress: func.isRequired,
  style: shape(),
  height: number.isRequired,
  width: number.isRequired,
};

DeleteButton.defaultProps = {
  style: null,
};
