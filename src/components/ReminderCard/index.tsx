import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { Reminder } from '@/types';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

interface ReminderCardProps {
  reminder: Reminder;
  onDone: (id: string) => void;
  onDiscomfort: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDone, onDiscomfort }) => {
  const [expanded, setExpanded] = useState(false);
  const isDone = reminder.status === 'done';
  const hasDiscomfort = reminder.status === 'discomfort';

  const getStatusText = () => {
    if (isDone) return '✓ 我已做到';
    if (hasDiscomfort) return '⚠ 有不舒服';
    return '';
  };

  const getStatusClass = () => {
    if (isDone) return styles.statusDone;
    if (hasDiscomfort) return styles.statusDiscomfort;
    return '';
  };

  return (
    <View
      className={classnames(
        styles.reminderCard,
        reminder.priority === 'high' && styles.highPriority,
        isDone && styles.cardDone,
        hasDiscomfort && styles.cardDiscomfort
      )}
    >
      <View className={styles.cardHeader}>
        <View className={styles.timeBadge}>
          <Text className={styles.timeLabel}>{reminder.timeLabel}</Text>
          <Text className={styles.timeValue}>{reminder.scheduledTime}</Text>
        </View>
        {reminder.priority === 'high' && (
          <View className={styles.priorityTag}>
            <Text className={styles.priorityText}>重要</Text>
          </View>
        )}
        {(isDone || hasDiscomfort) && (
          <View className={classnames(styles.statusBadge, getStatusClass())}>
            <Text className={styles.statusText}>{getStatusText()}</Text>
          </View>
        )}
      </View>

      <View className={styles.cardBody}>
        <Text className={styles.title}>{reminder.title}</Text>
        <Text className={styles.content}>{reminder.content}</Text>

        {reminder.detailTips && reminder.detailTips.length > 0 && (
          <View
            className={styles.expandTrigger}
            onClick={() => setExpanded(!expanded)}
          >
            <Text className={styles.expandText}>
              {expanded ? '收起详细说明 ▲' : '查看详细说明 ▼'}
            </Text>
          </View>
        )}

        {expanded && reminder.detailTips && reminder.detailTips.length > 0 && (
          <View className={styles.tipsList}>
            {reminder.detailTips.map((tip, idx) => (
              <View key={idx} className={styles.tipItem}>
                <Text className={styles.tipDot}>•</Text>
                <Text className={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {!isDone && !hasDiscomfort && (
        <View className={styles.cardActions}>
          <BigButton
            text="我已做到"
            subText="按要求做了"
            type="success"
            size="normal"
            icon="✓"
            onClick={() => onDone(reminder.id)}
          />
          <BigButton
            text="我有不舒服"
            subText="身体不对劲"
            type="danger"
            size="normal"
            icon="⚠"
            onClick={() => onDiscomfort(reminder.id)}
          />
        </View>
      )}

      {reminder.respondedAt && (
        <View className={styles.respondTime}>
          <Text className={styles.respondTimeText}>反馈时间：{reminder.respondedAt}</Text>
        </View>
      )}
    </View>
  );
};

export default ReminderCard;
