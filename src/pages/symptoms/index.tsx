import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import {
  PAIN_LEVEL_TEXT,
  SWELLING_LEVEL_TEXT,
  MEDICATION_STATUS_TEXT,
  type PainLevel,
  type SwellingLevel,
  type MedicationStatus
} from '@/types';
import { getTodayStr } from '@/utils/date';
import PageHeader from '@/components/PageHeader';
import BigButton from '@/components/BigButton';
import SymptomItem from '@/components/SymptomItem';
import styles from './index.module.scss';

const SymptomsPage: React.FC = () => {
  const { symptoms, addSymptomRecord } = useApp();

  const [painLevel, setPainLevel] = useState<PainLevel>(1);
  const [swellingLevel, setSwellingLevel] = useState<SwellingLevel>('mild');
  const [medicationStatus, setMedicationStatus] = useState<MedicationStatus>('taken');
  const [bleeding, setBleeding] = useState(false);
  const [fever, setFever] = useState(false);

  const hasReportedToday = useMemo(() => {
    const today = getTodayStr();
    return symptoms.some(s => s.date === today);
  }, [symptoms]);

  const painTrendData = useMemo(() => {
    return symptoms.slice(0, 7).reverse().map(s => ({
      date: s.date.slice(5),
      level: s.painLevel
    }));
  }, [symptoms]);

  const getBarClass = (level: number) => {
    if (level <= 1) return styles.trendBarLow;
    if (level <= 3) return styles.trendBarMid;
    return styles.trendBarHigh;
  };

  const handleSubmit = () => {
    console.log('[SymptomsPage] 提交症状反馈:', {
      painLevel, swellingLevel, medicationStatus, bleeding, fever
    });

    addSymptomRecord({
      date: getTodayStr(),
      painLevel,
      swellingLevel,
      medicationStatus,
      bleeding,
      fever
    });

    Taro.showToast({
      title: '已记录，感谢反馈！',
      icon: 'success',
      duration: 1800
    });
  };

  const handleEmergencyReport = () => {
    console.log('[SymptomsPage] 紧急不适反馈');
    Taro.showModal({
      title: '立即告诉诊所您的情况',
      content: '您可以：\n1. 直接拨打诊所电话\n2. 拍照上传告诉我们哪里不舒服\n\n诊所会尽快与您联系！',
      confirmText: '拨打电话',
      cancelText: '拍照反馈',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({ phoneNumber: '138-0000-1200' })
            .catch(err => console.error('[拨打电话] 失败:', err));
        } else {
          Taro.navigateTo({ url: '/pages/feedback-detail/index?from=symptom' });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <PageHeader
        greeting
        title="今天身体感觉怎么样？"
        subtitle="花一分钟告诉我们，方便医生了解您的恢复情况"
        showDate
      />

      <View className={styles.quickReportCard}>
        <Text className={styles.quickReportTitle}>😟 现在很不舒服？</Text>
        <Text className={styles.quickReportSubtitle}>
          如果您觉得疼痛难忍、出血很多或者发烧了，请不要忍，马上告诉我们！
        </Text>
        <View className={styles.quickActions}>
          <BigButton
            text="紧急联系诊所"
            type="danger"
            size="block"
            icon="📞"
            onClick={handleEmergencyReport}
          />
        </View>
      </View>

      <View className={styles.overviewCard}>
        <View className={styles.overviewHeader}>
          <Text className={styles.overviewTitle}>📈 最近疼痛趋势</Text>
        </View>

        {painTrendData.length > 0 ? (
          <>
            <View className={styles.trendRow}>
              {painTrendData.map((item, idx) => (
                <View key={idx} className={styles.trendBarWrap}>
                  <Text className={styles.trendValueLabel}>{item.level}</Text>
                  <View
                    className={classnames(styles.trendBar, getBarClass(item.level))}
                    style={{ height: `${Math.max(20, (item.level / 5) * 140)}rpx` }}
                  />
                  <Text className={styles.trendDayLabel}>{item.date}</Text>
                </View>
              ))}
            </View>
            <View className={styles.legendRow}>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.dotLow)} />
                <Text className={styles.legendText}>轻微</Text>
              </View>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.dotMid)} />
                <Text className={styles.legendText}>中等</Text>
              </View>
              <View className={styles.legendItem}>
                <View className={classnames(styles.legendDot, styles.dotHigh)} />
                <Text className={styles.legendText}>严重</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={{ padding: '32rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '30rpx', color: '#8A9AA3' }}>还没有历史记录，先完成今天的反馈吧~</Text>
          </View>
        )}
      </View>

      {!hasReportedToday && (
        <View className={styles.todayFormCard}>
          <View className={styles.formHeader}>
            <Text className={styles.formTitle}>📝 今天的情况</Text>
            <Text className={styles.formSubtitle}>只需选几个选项，不会占用您太久时间</Text>
          </View>

          <View className={styles.tipBox}>
            <Text className={styles.tipText}>
              💡 温馨提示：以下都是单选题，点一下就可以选好啦
            </Text>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formGroupTitle}>1. 今天伤口疼不疼？（0分=不痛，5分=非常痛）</Text>
            <View className={styles.painLevelRow}>
              {[0, 1, 2, 3, 4, 5].map(level => (
                <View
                  key={level}
                  className={classnames(
                    styles.painLevelBtn,
                    painLevel === level && styles.active
                  )}
                  onClick={() => setPainLevel(level as PainLevel)}
                >
                  <Text className={styles.painLevelNum}>{level}</Text>
                  <Text className={styles.painLevelLabel}>
                    {level === 0 ? '不痛' : level === 5 ? '很痛' : ''}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{ marginTop: '16rpx', fontSize: '28rpx', color: '#4A5A63' }}>
              您选择了：<Text style={{ color: '#2CB67D', fontWeight: '600' }}>{PAIN_LEVEL_TEXT[painLevel]}</Text>
            </Text>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formGroupTitle}>2. 脸部有没有肿胀？</Text>
            <View className={styles.optionGrid}>
              {(['none', 'mild', 'moderate', 'severe'] as SwellingLevel[]).map(level => (
                <View
                  key={level}
                  className={classnames(
                    styles.optionBtn,
                    swellingLevel === level && styles.active
                  )}
                  onClick={() => setSwellingLevel(level)}
                >
                  <Text className={styles.optionText}>{SWELLING_LEVEL_TEXT[level]}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formGroupTitle}>3. 药有按时吃吗？</Text>
            <View className={styles.optionGrid}>
              {(['taken', 'partial', 'missed', 'not-prescribed'] as MedicationStatus[]).map(status => (
                <View
                  key={status}
                  className={classnames(
                    styles.optionBtn,
                    medicationStatus === status && styles.active
                  )}
                  onClick={() => setMedicationStatus(status)}
                >
                  <Text className={styles.optionText}>{MEDICATION_STATUS_TEXT[status]}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formGroupTitle}>4. 有没有以下情况？（有的话点一下打开）</Text>
            <View
              className={styles.switchRow}
              onClick={() => setBleeding(!bleeding)}
            >
              <Text className={styles.switchLabel}>🩸 伤口有明显出血</Text>
              <View className={classnames(styles.switchControl, bleeding && styles.on)}>
                <View className={styles.switchDot} />
              </View>
            </View>
            <View
              className={styles.switchRow}
              onClick={() => setFever(!fever)}
            >
              <Text className={styles.switchLabel}>🤒 觉得发烧了</Text>
              <View className={classnames(styles.switchControl, fever && styles.on)}>
                <View className={styles.switchDot} />
              </View>
            </View>
          </View>

          <View className={styles.submitSection}>
            <BigButton
              text="提交今天的反馈"
              subText="让医生知道您的情况"
              type="primary"
              size="block"
              icon="✓"
              onClick={handleSubmit}
            />
          </View>
        </View>
      )}

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>📋 历史反馈记录</Text>
        <Text className={styles.recordCount}>共{symptoms.length}条</Text>
      </View>

      {symptoms.length > 0 ? (
        symptoms.map(record => (
          <SymptomItem key={record.id} record={record} />
        ))
      ) : (
        <View className={styles.emptyHistory}>
          <Text className={styles.emptyIcon}>📝</Text>
          <Text className={styles.emptyText}>还没有反馈记录</Text>
          <Text className={styles.emptySubText}>每天记录一下，医生更了解您的恢复情况</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default SymptomsPage;
