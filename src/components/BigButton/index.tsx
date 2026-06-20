import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

type ButtonType = 'primary' | 'success' | 'danger' | 'warning' | 'default';
type ButtonSize = 'normal' | 'large' | 'block';

interface BigButtonProps {
  text: string;
  subText?: string;
  type?: ButtonType;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  icon?: string;
}

const BigButton: React.FC<BigButtonProps> = ({
  text,
  subText,
  type = 'primary',
  size = 'normal',
  onClick,
  disabled = false,
  icon
}) => {
  const handleClick = () => {
    if (disabled) return;
    Taro.vibrateShort({ type: 'light' }).catch(() => {});
    onClick?.();
  };

  return (
    <View
      className={classnames(
        styles.bigButton,
        styles[`type${type.charAt(0).toUpperCase() + type.slice(1)}`],
        styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
        disabled && styles.disabled
      )}
      onClick={handleClick}
    >
      {icon && <Text className={styles.icon}>{icon}</Text>}
      <View className={styles.textContent}>
        <Text className={styles.mainText}>{text}</Text>
        {subText && <Text className={styles.subText}>{subText}</Text>}
      </View>
    </View>
  );
};

export default BigButton;
