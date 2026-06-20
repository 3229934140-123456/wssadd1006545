import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { TREATMENT_TYPE_MAP } from '@/types';
import { getRecoveryProgress, getDaysSinceTreatment, formatDate } from '@/utils/date';
import PageHeader from '@/components/PageHeader';
import ReminderCard from '@/components/ReminderCard';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const RemindersPage: React.FC = () => {
  const { treatment, updateReminderStatus, getRemindersForDay, getNextKeyReminders, requestSubscription } = useApp();

  const [viewDayOffset, setViewDayOffset] = useState<number>(0);

  const daysSince = useMemo(() => {
    if (!treatment) return 0;
    return getDaysSinceTreatment(treatment.treatmentDate);
  }, [treatment]);

  const currentViewDay = daysSince + viewDayOffset;

  const dayReminders = useMemo(() => {
    return getRemindersForDay(currentViewDay);
  }, [getRemindersForDay, currentViewDay]);

  const nextKeyReminders = useMemo(() => {
    return getNextKeyReminders();
  }, [getNextKeyReminders]);

  const stats = useMemo(() => {
    const done = dayReminders.filter(r => r.status === 'done').length;
    const pending = dayReminders.filter(r => r.status === 'pending').length;
    const discomfort = dayReminders.filter(r => r.status === 'discomfort').length;
    return { done, pending, discomfort, total: dayReminders.length };
  }, [dayReminders]);

  const recoveryProgress = useMemo(() => {
    if (!treatment) return 0;
    return getRecoveryProgress(treatment.treatmentDate, treatment.expectedRecoveryDays);
  }, [treatment]);

  const isToday = viewDayOffset === 0;
  const isPast = viewDayOffset < 0;
  const isFuture = viewDayOffset > 0;

  const getDayLabel = () => {
    if (isToday) return '今天';
    if (viewDayOffset === -1) return '昨天';
    if (viewDayOffset === 1) return '明天';
    if (viewDayOffset === 7) return '一周后';
    return `术后第${currentViewDay + 1}天`;
  };

  const handlePrevDay = () => {
    if (currentViewDay > 0) {
      setViewDayOffset(prev => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (treatment && currentViewDay < treatment.expectedRecoveryDays) {
      setViewDayOffset(prev => prev + 1);
    }
  };

  const handleBackToday = () => {
    setViewDayOffset(0);
  };

  const handleDone = (reminderId: string) => {
    console.log('[RemindersPage] 标记完成:', reminderId);
    if (!isToday) {
      Taro.showToast({
        title: '只能标记今天的提醒哦',
        icon: 'none'
      });
      return;
    }
    updateReminderStatus(reminderId, 'done');
    Taro.showToast({
      title: '好棒！继续保持~',
      icon: 'success',
      duration: 1500
    });
  };

  const handleSubscribe = async () => {
    console.log('[RemindersPage] 请求订阅提醒');
    const success = await requestSubscription();
    if (success) {
      Taro.showToast({ title: '已开启提醒，会及时通知您~', icon: 'success' });
    }
  };

  const handleCallFamily = (phone: string, name: string) => {
    Taro.showModal({
      title: '拨打家属电话',
      content: `确定要给${name}打电话吗？`,
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: phone }).catch(err => {
            console.error('[拨打家属电话] 失败:', err);
            Taro.showToast({ title: '拨号失败，请稍后重试', icon: 'none' });
          });
        }
      }
    });
  };

  const getReturnVisitDate = () => {
    if (!treatment) return '';
    const days = treatment.expectedRecoveryDays;
    const date = new Date(treatment.treatmentDate);
    date.setDate(date.getDate() + days);
    return formatDate(date, 'M月D日');
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={() => {
        console.log('[RemindersPage] 下拉刷新');
        handleBackToday();
        setTimeout(() => Taro.stopPullDownRefresh(), 800);
      }}
    >
      <PageHeader
        greeting
        title="王阿姨，今天感觉怎么样？"
        subtitle="我们会陪着您一步步顺利恢复"
        showDate
      />

      {treatment && (
        <View className={styles.treatmentCard}>
          <View className={styles.treatmentHeader}>
            <View className={styles.patientInfo}>
              <Text className={styles.patientName}>{treatment.patientName} · {treatment.patientAge}岁</Text>
              <Text className={styles.treatmentType}>{TREATMENT_TYPE_MAP[treatment.treatmentType]}</Text>
            </View>
            <View className={styles.treatmentBadge}>
              <Text className={styles.badgeText}>术后第{daysSince + 1}天</Text>
            </View>
          </View>

          <View className={styles.treatmentDetail}>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>主治医生</Text>
              <Text className={styles.detailValue}>{treatment.doctorName}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>治疗位置</Text>
              <Text className={styles.detailValue}>{treatment.teethPosition}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>复诊时间</Text>
              <Text className={classnames(styles.detailValue, styles.highlight)}>
                {getReturnVisitDate()}（术后第{treatment.expectedRecoveryDays}天）
              </Text>
            </View>
          </View>

          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressLabel}>恢复进度</Text>
              <Text className={styles.progressValue}>{recoveryProgress}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${recoveryProgress}%` }}
              />
            </View>
          </View>

          <View className={styles.subscribeSection} onClick={handleSubscribe}>
            <View className={styles.subscribeIcon}>🔔</View>
            <View className={styles.subscribeContent}>
              <Text className={styles.subscribeTitle}>开启消息提醒</Text>
              <Text className={styles.subscribeDesc}>关键节点会自动通知您和家人</Text>
            </View>
            <Text className={styles.subscribeArrow}>›</Text>
          </View>

          {treatment.familyMembers.length > 0 && (
            <View className={styles.familySection}>
              <Text className={styles.familyTitle}>👨‍👩‍👧 家人一起关心您：</Text>
              <View className={styles.familyList}>
                {treatment.familyMembers.map(fm => (
                  <View
                    key={fm.id}
                    className={styles.familyTag}
                    onClick={() => handleCallFamily(fm.phone, fm.name)}
                  >
                    <Text className={styles.familyTagText}>
                      {fm.name}（{fm.relationship}）{fm.isPrimary && '⭐'} 📞
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <View className={styles.daySelector}>
        <View
          className={classnames(styles.dayNavBtn, currentViewDay <= 0 && styles.disabled)}
          onClick={handlePrevDay}
        >
          <Text className={styles.dayNavText}>◀ 前一天</Text>
        </View>
        <View className={styles.dayInfo}>
          <Text className={styles.dayLabel}>{getDayLabel()}</Text>
          <Text className={styles.daySubLabel}>术后第{currentViewDay + 1}天</Text>
        </View>
        <View
          className={classnames(styles.dayNavBtn, treatment && currentViewDay >= treatment.expectedRecoveryDays && styles.disabled)}
          onClick={handleNextDay}
        >
          <Text className={styles.dayNavText}>后一天 ▶</Text>
        </View>
      </View>

      {!isToday && (
        <View className={styles.backTodayRow}>
          <BigButton
            text="回到今天"
            type="primary"
            size="block"
            icon="📅"
            onClick={handleBackToday}
          />
        </View>
      )}

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>
          {isToday ? '今天要做的事' : `${getDayLabel()}要注意的事`}
        </Text>
        <View className={styles.reminderCount}>
          <Text className={styles.countText}>{stats.total}条提醒</Text>
        </View>
      </View>

      {!isToday && (
        <View className={styles.tipBox}>
          <Text className={styles.tipText}>
            💡 {isPast ? '这是之前的注意事项，可以回顾一下' : '提前看看未来的注意事项，心里有个底~'}
          </Text>
        </View>
      )}

      <View className={styles.statsRow}>
        <View className={classnames(styles.statCard, styles.statCardDone)}>
          <Text className={styles.statNumber}>{stats.done}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
        <View className={classnames(styles.statCard, styles.statCardPending)}>
          <Text className={styles.statNumber}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待处理</Text>
        </View>
        <View className={classnames(styles.statCard, styles.statCardIssue)}>
          <Text className={styles.statNumber}>{stats.discomfort}</Text>
          <Text className={styles.statLabel}>有不适</Text>
        </View>
      </View>

      {dayReminders.length > 0 ? (
        dayReminders.map(reminder => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onDone={handleDone}
          />
        ))
      ) : (
        <View className={styles.emptyBox}>
          <Text className={styles.emptyIcon}>🎉</Text>
          <Text className={styles.emptyText}>
            {isToday ? '今天的注意事项都完成啦' : `${getDayLabel()}没有特别的提醒`}
          </Text>
          <Text className={styles.emptySubText}>
            {isToday
              ? `保持好心情，好好休息，下次复诊：${getReturnVisitDate()}`
              : '好好休息，有问题随时联系诊所'
            }
          </Text>
        </View>
      )}

      {isFuture && nextKeyReminders.length > 0 && (
        <View className={styles.keyRemindersSection}>
          <View className={styles.keyRemindersHeader}>
            <Text className={styles.keyRemindersIcon}>⭐</Text>
            <Text className={styles.keyRemindersTitle}>重要节点提醒</Text>
          </View>
          {nextKeyReminders.slice(0, 3).map(reminder => (
            <View key={reminder.id} className={styles.keyReminderItem}>
              <View className={styles.keyReminderDay}>
                <Text className={styles.keyReminderDayNum}>第{reminder.dayOffset + 1}天</Text>
              </View>
              <View className={styles.keyReminderContent}>
                <Text className={styles.keyReminderTitle}>{reminder.title}</Text>
                <Text className={styles.keyReminderDesc}>{reminder.content}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default RemindersPage;
