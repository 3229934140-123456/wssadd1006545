import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { PAIN_LEVEL_TEXT, SWELLING_LEVEL_TEXT, MEDICATION_STATUS_TEXT } from '@/types';
import type { SymptomRecord } from '@/types';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

interface SymptomItemProps {
  record: SymptomRecord;
}

const SymptomItem: React.FC<SymptomItemProps> = ({ record }) => {
  const getPainColor = (level: number) => {
    if (level <= 1) return styles.painLow;
    if (level <= 3) return styles.painMid;
    return styles.painHigh;
  };

  return (
    <View className={styles.symptomItem}>
      <View className={styles.itemHeader}>
        <View className={styles.headerLeft}>
          <Text className={styles.dateText}>{formatDate(record.date, 'M月D日')}反馈</Text>
          {record.source === 'discomfort' && (
            <View className={styles.sourceTag}>
              <Text className={styles.sourceTagText}>⚠ 不适反馈</Text>
            </View>
          )}
          {record.source === 'daily' && (
            <View className={classnames(styles.sourceTag, styles.sourceTagDaily)}>
              <Text className={styles.sourceTagText}>日常记录</Text>
            </View>
          )}
        </View>
        <View className={classnames(styles.painBadge, getPainColor(record.painLevel))}>
          <Text className={styles.painText}>疼痛 {record.painLevel}/5</Text>
        </View>
      </View>

      <View className={styles.symptomGrid}>
        <View className={styles.symptomCell}>
          <Text className={styles.cellLabel}>疼痛</Text>
          <Text className={styles.cellValue}>{PAIN_LEVEL_TEXT[record.painLevel]}</Text>
        </View>
        <View className={styles.symptomCell}>
          <Text className={styles.cellLabel}>肿胀</Text>
          <Text className={classnames(styles.cellValue, record.swellingLevel === 'severe' && styles.textDanger)}>
            {SWELLING_LEVEL_TEXT[record.swellingLevel]}
          </Text>
        </View>
        <View className={styles.symptomCell}>
          <Text className={styles.cellLabel}>服药</Text>
          <Text className={classnames(styles.cellValue, record.medicationStatus === 'missed' && styles.textWarning)}>
            {MEDICATION_STATUS_TEXT[record.medicationStatus]}
          </Text>
        </View>
        <View className={styles.symptomCell}>
          <Text className={styles.cellLabel}>异常</Text>
          <Text className={classnames(styles.cellValue, (record.bleeding || record.fever) && styles.textDanger)}>
            {record.bleeding ? '出血' : record.fever ? '发烧' : '无'}
          </Text>
        </View>
      </View>

      {record.note && (
        <View className={styles.noteBox}>
          <Text className={styles.noteLabel}>备注：</Text>
          <Text className={styles.noteText}>{record.note}</Text>
        </View>
      )}

      <View className={styles.recordTime}>
        <Text className={styles.timeText}>记录于 {record.createdAt}</Text>
      </View>
    </View>
  );
};

export default SymptomItem;
