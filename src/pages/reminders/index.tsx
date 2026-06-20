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
  const { treatment, reminders, updateReminderStatus, addDiscomfortReport } = useApp();

  const todayReminders = useMemo(() => {
    return reminders.filter(r => r.dayOffset === 0);
  }, [reminders]);

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

  const handleDiscomfort = (reminderId: string) => {
    console.log('[RemindersPage] 报告不适:', reminderId);
    updateReminderStatus(reminderId, 'discomfort');

    const reminder = reminders.find(r => r.id === reminderId);
    addDiscomfortReport({
      reminderId,
      type: 'other',
      description: `针对提醒"${reminder?.title || reminderId}"报告不适`,
      level: 'mild',
      photos: []
    });

    Taro.showModal({
      title: '别担心，我们来了',
      content: '您的情况已经同步给诊所的回访人员啦。\n\n如果现在就不舒服，可以给诊所打电话，或者拍照上传告诉我们具体情况。',
      confirmText: '我要打电话',
      cancelText: '先去反馈',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: '010-88886666'
          }).catch(err => console.error('[拨打电话] 失败:', err));
        } else if (res.cancel) {
          Taro.navigateTo({
            url: '/pages/feedback-detail/index?from=reminder&reminderId=' + reminderId
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

          {treatment.familyMembers.length > 0 && (
            <View className={styles.familySection}>
              <Text className={styles.familyTitle}>👨‍👩‍👧 家人一起关心您：</Text>
              <View className={styles.familyList}>
                {treatment.familyMembers.map(fm => (
                  <View key={fm.id} className={styles.familyTag}>
                    <Text className={styles.familyTagText}>
                      {fm.name}（{fm.relationship}）{fm.isPrimary && '⭐'}
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
            onDiscomfort={handleDiscomfort}
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
