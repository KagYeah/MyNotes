import React, { useContext } from 'react';
import { func } from 'prop-types';

import { GlobalContext } from '../contexts';
import CircleButton from './CircleButton';
import { appStyles } from '../style';

export default function CreateButton(props) {
  const { theme } = useContext(GlobalContext);
  const { onPress } = props;

  return (
    <CircleButton
      label="＋"
      onPress={onPress}
      style={{
        bottom: appStyles(theme).createButton.bottom,
        position: 'absolute',
        right: appStyles(theme).createButton.right,
      }}
      size={appStyles(theme).circleButton.size}
      fontSize={appStyles(theme).createButton.fontSize}
    />
  );
}

CreateButton.propTypes = {
  onPress: func.isRequired,
};
