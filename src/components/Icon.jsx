import React from 'react';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { useFonts } from '@use-expo/font';
import { number, oneOf, string } from 'prop-types';

import icomoon from '../../assets/fonts/icomoon.ttf';
import selection from '../../assets/fonts/selection.json';

export default function Icon(props) {
  const [fontloaded] = useFonts({ icomoon });
  const { name, size, color } = props;
  const CustomIcon = createIconSetFromIcoMoon(selection);

  if (!fontloaded) {
    return null;
  }

  return <CustomIcon name={name} size={size} color={color} />;
}

Icon.propTypes = {
  name: oneOf([
    'arrow-left',
    'arrow-right',
    'arrow-down',
    'checkbox-checked',
    'checkbox-unchecked',
    'check',
    'dot',
    'menu',
    'plus',
  ]).isRequired,
  size: number,
  color: string,
};

Icon.defaultProps = {
  size: 24,
  color: '#000',
};
