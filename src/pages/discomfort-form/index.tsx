import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import {
  PAIN_LEVEL_TEXT,
  SWELLING_LEVEL_TEXT,
  MEDICATION_STATUS_TEXT,
  type PainLevel,
  type SwellingLevel,
  type MedicationStatus,
  type DiscomfortFormData
} from '@/types';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const DiscomfortFormPage: React.FC = () => {
  const router = useRouter();
  const { reminders, clinic, submitDiscomfortForm } = useApp();

  const reminderId = router.params.reminderId as string;

  const currentReminder = useMemo(() => {
    return reminderId ? reminders.find(r => r.id === reminderId) : undefined;
  }, [reminderId, reminders]);

  const [painLevel, setPainLevel] = useState<PainLevel>(2);
  const [swellingLevel, setSwellingLevel] = useState<SwellingLevel>('mild');
  const [medicationStatus, setMedicationStatus] = useState<MedicationStatus>('taken');
  const [bleeding, setBleeding] = useState(false);
  const [fever, setFever] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState<'call' | 'photo' | 'wait'>('wait');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 3 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        console.log('[不适反馈] 选择图片:', res.tempFilePaths);
        setPhotos(prev => [...prev, ...res.tempFilePaths]);
      },
      fail: (err) => {
        console.error('[不适反馈] 选择图片失败:', err);
        Taro.showToast({
          title: '拍照功能需真机体验',
          icon: 'none'
        });
      }
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid = useMemo(() => {
    return painLevel !== null && swellingLevel !== null && medicationStatus !== null;
  }, [painLevel, swellingLevel, medicationStatus]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      Taro.showToast({ title: '请先选择所有选项', icon: 'none' });
      return;
    }

    console.log('[不适反馈] 提交表单');

    const formData: DiscomfortFormData = {
      reminderId: reminderId || undefined,
      painLevel,
      swellingLevel,
      medicationStatus,
      bleeding,
      fever,
      photos,
      nextAction
    };

    submitDiscomfortForm(formData);

    setShowSuccess(true);

    if (nextAction === 'call') {
      setTimeout(() => {
        Taro.makePhoneCall({
          phoneNumber: clinic.emergencyPhone.replace(/-/g, '')
        }).catch(err => console.error('[拨打电话] 失败:', err));
      }, 500);
    }
  };

  const handleGoBack = () => {
    Taro.switchTab({ url: '/pages/reminders/index' });
  };

  const handleGoSymptoms = () => {
    Taro.switchTab({ url: '/pages/symptoms/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.wrapper}>
        <View className={styles.headerCard}>
          <Text className={styles.headerIcon}>💚</Text>
          <Text className={styles.headerTitle}>别担心，我们在</Text>
          <Text className={styles.headerSubtitle}>
            花一分钟告诉我们您的情况，诊所的回访人员会第一时间看到并联系您~
          </Text>
          {currentReminder && (
            <View className={styles.reminderInfo}>
              <Text className={styles.reminderLabel}>针对提醒：</Text>
              <Text className={styles.reminderText}>{currentReminder.title}</Text>
            </View>
          )}
        </View>

        <View className={styles.formCard}>
          <View className={styles.formGroup}>
            <Text className={styles.formGroupTitle}>
              <Text className={styles.questionNumber}>1</Text>
              现在伤口有多痛？
            </Text>
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
            <View className={styles.selectedValue}>
              <Text className={styles.selectedValueText}>
                您选择了：{PAIN_LEVEL_TEXT[painLevel]}
              </Text>
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formGroupTitle}>
              <Text className={styles.questionNumber}>2</Text>
              脸部有没有肿胀？
            </Text>
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
            <Text className={styles.formGroupTitle}>
              <Text className={styles.questionNumber}>3</Text>
              药有按时吃吗？
            </Text>
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
            <Text className={styles.formGroupTitle}>
              <Text className={styles.questionNumber}>4</Text>
              有没有以下情况？
            </Text>
            <View
              className={styles.switchRow}
              onClick={() => setBleeding(!bleeding)}
            >
              <Text className={styles.switchLabel}>
                <Text className={styles.switchIcon}>🩸</Text>
                伤口有明显出血
              </Text>
              <View className={classnames(styles.switchControl, bleeding && styles.on)}>
                <View className={styles.switchDot} />
              </View>
            </View>
            <View
              className={styles.switchRow}
              onClick={() => setFever(!fever)}
            >
              <Text className={styles.switchLabel}>
                <Text className={styles.switchIcon}>🤒</Text>
                觉得发烧了
              </Text>
              <View className={classnames(styles.switchControl, fever && styles.on)}>
                <View className={styles.switchDot} />
              </View>
            </View>
          </View>
        </View>

        <View className={styles.nextStepSection}>
          <Text className={styles.nextStepTitle}>接下来您希望怎么做？</Text>
          <Text className={styles.nextStepSubtitle}>
            不管选哪个，您的情况都会同步给诊所的回访人员~
          </Text>
          <View className={styles.nextStepButtons}>
            <View
              className={classnames(
                styles.nextStepBtn,
                styles.danger,
                nextAction === 'call' && styles.active
              )}
              onClick={() => setNextAction('call')}
            >
              <Text className={styles.nextStepBtnIcon}>📞</Text>
              <View className={styles.nextStepBtnContent}>
                <Text className={styles.nextStepBtnText}>现在就打电话给诊所</Text>
                <Text className={styles.nextStepBtnDesc}>紧急情况请选这个，医生会立刻接听</Text>
              </View>
            </View>
            <View
              className={classnames(
                styles.nextStepBtn,
                styles.warning,
                nextAction === 'photo' && styles.active
              )}
              onClick={() => setNextAction('photo')}
            >
              <Text className={styles.nextStepBtnIcon}>📷</Text>
              <View className={styles.nextStepBtnContent}>
                <Text className={styles.nextStepBtnText}>拍张照片给医生看看</Text>
                <Text className={styles.nextStepBtnDesc}>拍清楚伤口，医生可以更好判断情况</Text>
              </View>
            </View>
            <View
              className={classnames(
                styles.nextStepBtn,
                nextAction === 'wait' && styles.active
              )}
              onClick={() => setNextAction('wait')}
            >
              <Text className={styles.nextStepBtnIcon}>⏳</Text>
              <View className={styles.nextStepBtnContent}>
                <Text className={styles.nextStepBtnText}>先提交反馈，等诊所联系</Text>
                <Text className={styles.nextStepBtnDesc}>不是特别急，回访人员看到后会联系您</Text>
              </View>
            </View>
          </View>
        </View>

        {(nextAction === 'photo' || photos.length > 0) && (
          <View className={styles.photoSection}>
            <Text className={styles.photoTitle}>📷 上传伤口照片</Text>
            <Text className={styles.photoTip}>
              建议在光线好的地方拍，尽量拍清楚伤口的位置。最多可以上传3张照片。
            </Text>
            {photos.length < 3 && (
              <View className={styles.photoBtn} onClick={handleChooseImage}>
                <Text className={styles.photoBtnIcon}>📷</Text>
                <Text className={styles.photoBtnText}>点击拍照或从相册选择</Text>
              </View>
            )}
            {photos.length > 0 && (
              <View className={styles.photoPreviewRow}>
                {photos.map((photo, idx) => (
                  <View key={idx} className={styles.photoPreviewItem}>
                    <Image src={photo} className={styles.photoPreviewImg} mode="aspectFill" />
                    <View
                      className={styles.photoRemoveBtn}
                      onClick={() => handleRemovePhoto(idx)}
                    >
                      ×
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View className={styles.tipBox}>
          <Text className={styles.tipText}>
            💡 温馨提示：您填写的信息会自动同步给诊所的回访人员。如果疼痛难忍、大量出血或者发烧超过38度，请立刻拨打紧急电话！
          </Text>
        </View>

        <View className={styles.submitSection}>
          <BigButton
            text="提交我的情况"
            subText="让医生知道我现在怎么样了"
            type="primary"
            size="block"
            icon="✓"
            onClick={handleSubmit}
            disabled={!isFormValid}
          />
          <BigButton
            text="返回首页"
            type="default"
            size="block"
            onClick={handleGoBack}
          />
        </View>
      </View>

      {showSuccess && (
        <View className={styles.successOverlay} onClick={(e) => e.stopPropagation()}>
          <View className={styles.successCard}>
            <Text className={styles.successIcon}>✅</Text>
            <Text className={styles.successTitle}>提交成功啦！</Text>
            <Text className={styles.successSubtitle}>
              您的情况已经同步给诊所的回访人员，他们会尽快联系您~{'\n'}
              同时也自动记录到了您的症状反馈里。
            </Text>
            <View className={styles.successActions}>
              <BigButton
                text="去症状反馈看看"
                type="primary"
                size="block"
                onClick={handleGoSymptoms}
              />
              <BigButton
                text="返回今日提醒"
                type="default"
                size="block"
                onClick={handleGoBack}
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default DiscomfortFormPage;
