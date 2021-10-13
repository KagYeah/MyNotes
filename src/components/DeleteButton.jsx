import React from 'react';
import { func, number, shape } from 'prop-types';

import Button from './Button';
import { appStyles } from '../style';

export default function DeleteButton(props) {
  const {
    onPress, style, height, width,
  } = props;

  return (
    <Button
      label="削除"
      onPress={onPress}
      style={style}
      backgroundColor={appStyles.deleteButton.backgroundColor}
      height={height}
      width={width}
      color={appStyles.deleteButton.color}
      fontSize={appStyles.deleteButton.fontSize}
      fontWeight={appStyles.deleteButton.fontWeight}
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
