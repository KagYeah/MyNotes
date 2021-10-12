import React from 'react';
import { func } from 'prop-types';

import CircleButton from './CircleButton';
import { appStyles } from '../style';

export default function CreateButton(props) {
  const { onPress } = props;

  return (
    <CircleButton
      label="＋"
      onPress={onPress}
      style={{
        bottom: appStyles.createButton.bottom,
        position: 'absolute',
        right: appStyles.createButton.right,
      }}
      size={appStyles.circleButton.size}
      fontSize={appStyles.createButton.fontSize}
    />
  );
}

CreateButton.propTypes = {
  onPress: func.isRequired,
};
