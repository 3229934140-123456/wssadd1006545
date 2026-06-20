import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import BigButton from '@/components/BigButton';
import { useApp } from '@/store/AppContext';
import styles from './index.module.scss';

const FeedbackDetailPage: React.FC = () => {
  const { clinic, addDiscomfortReport } = useApp();

  const handleCallClinic = () => {
    console.log('[FeedbackDetail] 拨打诊所电话');
    Taro.makePhoneCall({
      phoneNumber: clinic.emergencyPhone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const handleTakePhoto = () => {
    console.log('[FeedbackDetail] 拍照上传');
    Taro.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        console.log('[FeedbackDetail] 选择图片成功:', res.tempFilePaths);
        addDiscomfortReport({
          type: 'other',
          description: '用户上传了伤口照片',
          level: 'moderate',
          photos: res.tempFilePaths
        });
        Taro.showModal({
          title: '照片已上传',
          content: '您的照片已经同步给诊所的回访人员了，他们会尽快查看并联系您。',
          showCancel: false,
          confirmText: '好的，谢谢'
        });
      },
      fail: (err) => {
        console.error('[FeedbackDetail] 选择图片失败:', err);
        Taro.showToast({
          title: '拍照功能需真机体验',
          icon: 'none'
        });
      }
    });
  };

  const handleGoBack = () => {
    Taro.navigateBack().catch(() => {
      Taro.switchTab({ url: '/pages/reminders/index' });
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.wrapper}>
        <View className={styles.iconBox}>
          <Text className={styles.iconText}>💚</Text>
        </View>
        <Text className={styles.title}>功能正在完善中</Text>
        <Text className={styles.subtitle}>
          我们正在努力把反馈功能做得更好更简单。{'\n'}
          现在您可以直接拨打电话告诉我们，或者拍张照片上传，诊所的医生都会收到的~
        </Text>

        <View className={styles.actionList}>
          <BigButton
            text="立即拨打诊所电话"
            subText={clinic.emergencyPhone}
            type="danger"
            size="block"
            icon="📞"
            onClick={handleCallClinic}
          />
          <BigButton
            text="拍照上传伤口情况"
            subText="拍张照片让医生看看"
            type="warning"
            size="block"
            icon="📷"
            onClick={handleTakePhoto}
          />
        </View>

        <View className={styles.backBtn}>
          <BigButton
            text="返回首页"
            type="default"
            size="normal"
            onClick={handleGoBack}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default FeedbackDetailPage;
