import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { PAIN_LEVEL_TEXT, type PainLevel } from '@/types';
import PageHeader from '@/components/PageHeader';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const FeedbackDetailPage: React.FC = () => {
  const router = useRouter();
  const { submitPhotoFeedback, clinic } = useApp();

  const from = (router.params.from as 'contact' | 'symptom' | 'emergency') || 'contact';
  const [photos, setPhotos] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState<PainLevel | ''>('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isEmergency = from === 'emergency';

  const handleChoosePhoto = () => {
    Taro.chooseImage({
      count: 3 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        console.log('[PhotoFeedback] 选择图片:', res.tempFilePaths);
        setPhotos(prev => [...prev, ...res.tempFilePaths].slice(0, 3));
      },
      fail: (err) => {
        console.error('[PhotoFeedback] 选择图片失败:', err);
        const mockUrls = [
          'https://images.unsplash.com/photo-1606811841689-23dfddce2e75?w=200&h=200&fit=crop',
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=200&fit=crop',
          'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&h=200&fit=crop'
        ];
        const addCount = Math.min(3 - photos.length, 1);
        const newPhotos = mockUrls.slice(photos.length, photos.length + addCount);
        if (newPhotos.length > 0) {
          setPhotos(prev => [...prev, ...newPhotos]);
          Taro.showToast({ title: '已添加模拟照片', icon: 'success' });
        } else {
          Taro.showToast({ title: '最多上传3张照片', icon: 'none' });
        }
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreviewPhoto = (index: number) => {
    Taro.previewImage({
      urls: photos,
      current: photos[index]
    });
  };

  const handleSubmit = () => {
    if (photos.length === 0) {
      Taro.showToast({ title: '请先上传至少1张照片', icon: 'none' });
      return;
    }
    setSubmitting(true);
    try {
      submitPhotoFeedback({
        from,
        photos,
        painLevel: painLevel === '' ? undefined : painLevel,
        note: note || undefined
      });
      setSubmitted(true);
    } catch (err) {
      console.error('[PhotoFeedback] 提交失败:', err);
      Taro.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCallClinic = () => {
    const phone = isEmergency ? clinic.emergencyPhone : clinic.phone;
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const handleBack = () => {
    Taro.switchTab({ url: '/pages/clinic-tasks/index' });
  };

  const getPageTitle = () => {
    switch (from) {
      case 'emergency': return '紧急情况拍照反馈';
      case 'symptom': return '症状照片反馈';
      default: return '拍照反馈伤口情况';
    }
  };

  const getPageSubtitle = () => {
    switch (from) {
      case 'emergency': return '拍张照片告诉我们情况，诊所会立即处理';
      case 'symptom': return '拍张照片记录今天的症状情况';
      default: return '拍张伤口照片，医生会尽快查看并回访';
    }
  };

  if (submitted) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.successWrap}>
          <View className={styles.successIconBox}>
            <Text className={styles.successIcon}>✓</Text>
          </View>
          <Text className={styles.successTitle}>提交成功！</Text>
          <Text className={styles.successSubtitle}>
            您的照片已经同步给诊所的回访人员了{'\n'}
            他们会尽快查看并联系您
          </Text>

          <View className={styles.successInfoCard}>
            <View className={styles.successInfoRow}>
              <Text className={styles.successInfoLabel}>上传照片</Text>
              <Text className={styles.successInfoValue}>{photos.length}张</Text>
            </View>
            {painLevel !== '' && (
              <View className={styles.successInfoRow}>
                <Text className={styles.successInfoLabel}>疼痛程度</Text>
                <Text className={styles.successInfoValue}>{PAIN_LEVEL_TEXT[painLevel]}</Text>
              </View>
            )}
            {note && (
              <View className={styles.successInfoRow}>
                <Text className={styles.successInfoLabel}>备注说明</Text>
                <Text className={styles.successInfoValue}>{note}</Text>
              </View>
            )}
          </View>

          <View className={styles.successActions}>
            {isEmergency && (
              <BigButton
                text="立即拨打诊所电话"
                subText={clinic.emergencyPhone}
                type="danger"
                size="block"
                icon="📞"
                onClick={handleCallClinic}
              />
            )}
            <BigButton
              text="查看诊所回访进度"
              type="primary"
              size="block"
              icon="👩‍⚕️"
              onClick={handleBack}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <PageHeader
        greeting={false}
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        showDate
      />

      {isEmergency && (
        <View className={styles.emergencyTip}>
          <Text className={styles.emergencyTipIcon}>🚨</Text>
          <View className={styles.emergencyTipContent}>
            <Text className={styles.emergencyTipTitle}>情况紧急？</Text>
            <Text className={styles.emergencyTipText}>
              可以直接拨打诊所电话，医生会马上接听
            </Text>
          </View>
          <View className={styles.emergencyCallBtn} onClick={handleCallClinic}>
            <Text className={styles.emergencyCallText}>📞</Text>
          </View>
        </View>
      )}

      <View className={styles.sectionCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>📷</Text>
          <Text className={styles.sectionTitle}>上传伤口照片</Text>
          <Text className={styles.sectionRequired}>（必填）</Text>
        </View>
        <Text className={styles.sectionDesc}>
          请拍清楚伤口位置，最多上传3张照片，诊所医生会仔细查看
        </Text>

        <View className={styles.photoGrid}>
          {photos.map((photo, idx) => (
            <View key={idx} className={styles.photoItem}>
              <Image
                src={photo}
                className={styles.photoImg}
                mode="aspectFill"
                onClick={() => handlePreviewPhoto(idx)}
              />
              <View
                className={styles.photoRemove}
                onClick={() => handleRemovePhoto(idx)}
              >
                <Text className={styles.photoRemoveIcon}>×</Text>
              </View>
            </View>
          ))}
          {photos.length < 3 && (
            <View className={styles.photoAdd} onClick={handleChoosePhoto}>
              <Text className={styles.photoAddIcon}>+</Text>
              <Text className={styles.photoAddText}>添加照片</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>😣</Text>
          <Text className={styles.sectionTitle}>现在疼不疼？</Text>
          <Text className={styles.sectionOptional}>（选填）</Text>
        </View>
        <View className={styles.painLevelRow}>
          {[0, 1, 2, 3, 4, 5].map(level => (
            <View
              key={level}
              className={classnames(
                styles.painLevelBtn,
                painLevel === level && styles.active
              )}
              onClick={() => setPainLevel(painLevel === level ? '' : level as PainLevel)}
            >
              <Text className={styles.painLevelNum}>{level}</Text>
              <Text className={styles.painLevelLabel}>
                {level === 0 ? '不痛' : level === 5 ? '很痛' : ''}
              </Text>
            </View>
          ))}
        </View>
        {painLevel !== '' && (
          <Text className={styles.painSelected}>
            您选择了：<Text style={{ color: '#2CB67D', fontWeight: '600' }}>
              {PAIN_LEVEL_TEXT[painLevel]}
            </Text>
          </Text>
        )}
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>📝</Text>
          <Text className={styles.sectionTitle}>想补充说明一下？</Text>
          <Text className={styles.sectionOptional}>（选填）</Text>
        </View>
        <Textarea
          className={styles.noteInput}
          placeholder="比如：伤口有点痒、纱布上有血丝等，越详细医生越了解情况"
          value={note}
          onInput={(e) => setNote(e.detail.value)}
          maxlength={200}
        />
        <Text className={styles.noteCount}>{note.length}/200</Text>
      </View>

      <View className={styles.submitSection}>
        <BigButton
          text={submitting ? '提交中...' : '提交反馈'}
          subText={photos.length > 0 ? `已上传${photos.length}张照片` : '请先上传照片'}
          type={isEmergency ? 'danger' : 'primary'}
          size="block"
          icon="✓"
          disabled={submitting || photos.length === 0}
          onClick={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default FeedbackDetailPage;
