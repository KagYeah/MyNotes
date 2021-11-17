import React from 'react';
import { func, number, shape } from 'prop-types';

import Button from './Button';

export default function DeleteButton(props) {
  const {
    onPress, style, height, width,
  } = props;

  return (
    <Button
      label="削除"
      onPress={onPress}
      style={style}
      backgroundColor="#0000"
      height={height}
      width={width}
      color="#f00"
      fontSize={18}
      fontWeight="bold"
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
