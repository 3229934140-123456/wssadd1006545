import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showDate?: boolean;
  greeting?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showDate = false,
  greeting = false,
  className
}) => {
  const today = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 6) return '夜深了，注意休息';
    if (hour < 12) return '早上好呀';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <View className={classnames(styles.pageHeader, className)}>
      {greeting && (
        <Text className={styles.greeting}>{getGreeting()}</Text>
      )}
      <Text className={styles.title}>{title}</Text>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      {showDate && <Text className={styles.dateText}>{dateStr}</Text>}
    </View>
  );
};

export default PageHeader;
