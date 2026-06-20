import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { TREATMENT_TYPE_MAP } from '@/types';
import { getRecoveryProgress, getDaysSinceTreatment, formatDate } from '@/utils/date';
import PageHeader from '@/components/PageHeader';
import ReminderCard from '@/components/ReminderCard';
import styles from './index.module.scss';

const RemindersPage: React.FC = () => {
  const { treatment, reminders, updateReminderStatus, getTodayReminders, requestSubscription } = useApp();

  const todayReminders = useMemo(() => {
    return getTodayReminders();
  }, [getTodayReminders]);

  const stats = useMemo(() => {
    const done = todayReminders.filter(r => r.status === 'done').length;
    const pending = todayReminders.filter(r => r.status === 'pending').length;
    const discomfort = todayReminders.filter(r => r.status === 'discomfort').length;
    return { done, pending, discomfort, total: todayReminders.length };
  }, [todayReminders]);

  const recoveryProgress = useMemo(() => {
    if (!treatment) return 0;
    return getRecoveryProgress(treatment.treatmentDate, treatment.expectedRecoveryDays);
  }, [treatment]);

  const daysSince = useMemo(() => {
    if (!treatment) return 0;
    return getDaysSinceTreatment(treatment.treatmentDate);
  }, [treatment]);

  const handleDone = (reminderId: string) => {
    console.log('[RemindersPage] 标记完成:', reminderId);
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

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresh={() => {
        console.log('[RemindersPage] 下拉刷新');
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

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>今天要做的事</Text>
        <View className={styles.reminderCount}>
          <Text className={styles.countText}>{stats.total}条提醒</Text>
        </View>
      </View>

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

      {todayReminders.length > 0 ? (
        todayReminders.map(reminder => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onDone={handleDone}
            onDiscomfort={() => {}}
          />
        ))
      ) : (
        <View className={styles.emptyBox}>
          <Text className={styles.emptyIcon}>🎉</Text>
          <Text className={styles.emptyText}>今天的注意事项都完成啦</Text>
          <Text className={styles.emptySubText}>
            保持好心情，好好休息{treatment ? `，下次复诊：${formatDate(treatment.treatmentDate, 'M月D日')}后第${treatment.expectedRecoveryDays}天` : ''}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RemindersPage;
