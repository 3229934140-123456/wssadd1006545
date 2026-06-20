import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import {
  PAIN_LEVEL_TEXT,
  SWELLING_LEVEL_TEXT,
  MEDICATION_STATUS_TEXT
} from '@/types';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const SymptomDetailPage: React.FC = () => {
  const router = useRouter();
  const { symptoms, clinic } = useApp();

  const recordId = router.params.recordId as string;

  const record = useMemo(() => {
    return symptoms.find(s => s.id === recordId);
  }, [symptoms, recordId]);

  const handlePreviewPhoto = (photo: string) => {
    if (!record?.photos) return;
    Taro.previewImage({
      urls: record.photos,
      current: photo
    });
  };

  const handleCallClinic = () => {
    Taro.makePhoneCall({
      phoneNumber: clinic.phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const getSourceLabel = () => {
    if (!record) return '';
    switch (record.source) {
      case 'daily': return '日常记录';
      case 'discomfort': return '不适反馈';
      case 'photo': return '照片反馈';
      default: return '症状记录';
    }
  };

  const getSourceClass = () => {
    if (!record) return '';
    switch (record.source) {
      case 'daily': return styles.sourceDaily;
      case 'discomfort': return styles.sourceDiscomfort;
      case 'photo': return styles.sourcePhoto;
      default: return '';
    }
  };

  if (!record) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyBox}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>记录不存在或已删除</Text>
          <BigButton
            text="返回列表"
            type="primary"
            size="normal"
            onClick={() => Taro.navigateBack()}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.sourceRow}>
          <View className={classnames(styles.sourceBadge, getSourceClass())}>
            <Text className={styles.sourceBadgeText}>
              {record.source === 'photo' ? '📷 ' : ''}
              {getSourceLabel()}
            </Text>
          </View>
          {record.source === 'discomfort' && (
            <View className={styles.discomfortBadge}>
              <Text className={styles.discomfortText}>不适反馈</Text>
            </View>
          )}
        </View>
        <Text className={styles.title}>
          {record.date.slice(5).replace('-', '月')}日 {getSourceLabel()}详情
        </Text>
        <Text className={styles.subtitle}>
          记录于 {record.createdAt}
        </Text>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>📊</Text>
          <Text className={styles.sectionTitle}>身体情况</Text>
        </View>

        <View className={styles.detailList}>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>疼痛程度</Text>
            <View className={classnames(
              styles.painBadge,
              record.painLevel <= 1 && styles.painLow,
              record.painLevel > 1 && record.painLevel <= 3 && styles.painMid,
              record.painLevel > 3 && styles.painHigh
            )}>
              <Text className={styles.painText}>
                {record.painLevel}分 · {PAIN_LEVEL_TEXT[record.painLevel]}
              </Text>
            </View>
          </View>

          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>肿胀情况</Text>
            <Text className={classnames(
              styles.detailValue,
              record.swellingLevel === 'severe' && styles.textDanger
            )}>{SWELLING_LEVEL_TEXT[record.swellingLevel]}</Text>
          </View>

          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>服药情况</Text>
            <Text className={classnames(
              styles.detailValue,
              record.medicationStatus === 'missed' && styles.textWarning
            )}>{MEDICATION_STATUS_TEXT[record.medicationStatus]}</Text>
          </View>

          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>异常情况</Text>
            <View className={styles.abnormalList}>
              {record.bleeding && (
                <View className={classnames(styles.abnormalTag, styles.abnormalDanger)}>
                  <Text className={styles.abnormalText}>🩸 有出血</Text>
                </View>
              )}
              {record.fever && (
                <View className={classnames(styles.abnormalTag, styles.abnormalDanger)}>
                  <Text className={styles.abnormalText}>🤒 有发烧</Text>
                </View>
              )}
              {!record.bleeding && !record.fever && (
                <Text className={styles.detailValue}>无异常</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {record.photos && record.photos.length > 0 && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📷</Text>
            <Text className={styles.sectionTitle}>反馈照片</Text>
          </View>
          <View className={styles.photoGrid}>
            {record.photos.map((photo, idx) => (
              <View key={idx} className={styles.photoItem}>
                <Image
                  src={photo}
                  className={styles.photoImg}
                  mode="aspectFill"
                  onClick={() => handlePreviewPhoto(photo)}
                />
              </View>
            ))}
          </View>
          <Text className={styles.photoTip}>
            💡 点击照片可以放大查看
          </Text>
        </View>
      )}

      {record.note && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📝</Text>
            <Text className={styles.sectionTitle}>备注说明</Text>
          </View>
          <View className={styles.noteBox}>
            <Text className={styles.noteText}>{record.note}</Text>
          </View>
        </View>
      )}

      <View className={styles.tipSection}>
        <Text className={styles.tipTitle}>💡 恢复小贴士</Text>
        <View className={styles.tipList}>
          <Text className={styles.tipItem}>• 保持口腔清洁，饭后用温水漱口</Text>
          <Text className={styles.tipItem}>• 避免吃太硬、太烫的食物</Text>
          <Text className={styles.tipItem}>• 保证充足的休息，有助于恢复</Text>
        </View>
      </View>

      <View className={styles.bottomActions}>
        <BigButton
          text="📞 有问题？联系诊所"
          type="default"
          size="block"
          onClick={handleCallClinic}
        />
        <BigButton
          text="返回列表"
          type="primary"
          size="block"
          onClick={() => Taro.navigateBack()}
        />
      </View>

      <View style={{ height: '60rpx' }} />
    </ScrollView>
  );
};

export default SymptomDetailPage;
