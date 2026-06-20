import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/AppContext';
import PageHeader from '@/components/PageHeader';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const ContactPage: React.FC = () => {
  const { clinic, treatment } = useApp();

  const handleCallClinic = () => {
    console.log('[ContactPage] 拨打诊所电话');
    Taro.makePhoneCall({
      phoneNumber: clinic.phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const handleCallEmergency = () => {
    console.log('[ContactPage] 拨打紧急电话');
    Taro.makePhoneCall({
      phoneNumber: clinic.emergencyPhone.replace(/-/g, '')
    }).catch(err => console.error('[拨打紧急电话] 失败:', err));
  };

  const handleUploadPhoto = () => {
    console.log('[ContactPage] 拍照上传');
    Taro.navigateTo({ url: '/pages/feedback-detail/index?from=contact' });
  };

  const handleScanBind = () => {
    console.log('[ContactPage] 扫码绑定');
    Taro.showToast({
      title: '扫码功能需真机体验',
      icon: 'none',
      duration: 1500
    });
  };

  const handleReturnVisit = () => {
    console.log('[ContactPage] 预约复诊');
    Taro.showModal({
      title: '预约复诊',
      content: clinic.returnVisitDate
        ? `您的复诊时间是：${clinic.returnVisitDate}\n\n需要修改或确认吗？`
        : '请直接拨打诊所电话预约复诊时间',
      confirmText: '确认时间',
      cancelText: '修改时间',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已确认，祝您早日康复！', icon: 'success' });
        } else {
          handleCallClinic();
        }
      }
    });
  };

  const handleAddFamily = () => {
    console.log('[ContactPage] 添加家属');
    Taro.showToast({ title: '请让家属扫码加入', icon: 'none', duration: 2000 });
  };

  const handleCallFamily = (phone: string, name: string) => {
    console.log('[ContactPage] 拨打家属电话:', name);
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打家属电话] 失败:', err));
  };

  const handleCopyAddress = () => {
    console.log('[ContactPage] 复制地址');
    Taro.setClipboardData({
      data: clinic.address,
      success: () => {
        Taro.showToast({ title: '地址已复制', icon: 'success' });
      }
    }).catch(err => console.error('[复制地址] 失败:', err));
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <PageHeader
        greeting
        title="需要帮助随时联系我们"
        subtitle="诊所和家人都会陪着您顺利恢复"
        showDate
      />

      <View className={styles.clinicCard}>
        <Text className={styles.clinicName}>🏥 {clinic.name}</Text>
        <Text className={styles.clinicWorkHours}>营业时间：{clinic.workHours}</Text>
        <View className={styles.phoneButtons}>
          <BigButton
            text="拨打诊所电话"
            subText={clinic.phone}
            type="default"
            size="block"
            icon="📞"
            onClick={handleCallClinic}
          />
          <BigButton
            text="紧急联系（24小时）"
            subText={clinic.emergencyPhone}
            type="danger"
            size="block"
            icon="🚨"
            onClick={handleCallEmergency}
          />
        </View>
      </View>

      <View className={styles.actionCards}>
        <View className={styles.actionCard} onClick={handleUploadPhoto}>
          <View className={`${styles.actionIconWrap} ${styles.orange}`}>
            <Text className={styles.actionIcon}>📷</Text>
          </View>
          <View className={styles.actionContent}>
            <Text className={styles.actionTitle}>拍照反馈伤口情况</Text>
            <Text className={styles.actionDesc}>拍张照片告诉医生您的伤口怎么样了</Text>
          </View>
          <Text className={styles.actionArrow}>›</Text>
        </View>

        <View className={styles.actionCard} onClick={handleReturnVisit}>
          <View className={`${styles.actionIconWrap} ${styles.green}`}>
            <Text className={styles.actionIcon}>📅</Text>
          </View>
          <View className={styles.actionContent}>
            <Text className={styles.actionTitle}>查看复诊时间</Text>
            <Text className={styles.actionDesc}>
              {clinic.returnVisitDate ? `下次复诊：${clinic.returnVisitDate}` : '点击预约复诊时间'}
            </Text>
          </View>
          <Text className={styles.actionArrow}>›</Text>
        </View>

        <View className={styles.actionCard} onClick={handleScanBind}>
          <View className={`${styles.actionIconWrap} ${styles.blue}`}>
            <Text className={styles.actionIcon}>🔗</Text>
          </View>
          <View className={styles.actionContent}>
            <Text className={styles.actionTitle}>扫码绑定治疗</Text>
            <Text className={styles.actionDesc}>
              {treatment ? `已绑定：${treatment.treatmentDate}的治疗` : '前台扫码后绑定本次治疗信息'}
            </Text>
          </View>
          <Text className={styles.actionArrow}>›</Text>
        </View>
      </View>

      <View className={styles.infoSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>📍</Text>
          <Text className={styles.sectionTitleText}>诊所信息</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoIcon}>🏠</Text>
          <View className={styles.infoContent}>
            <Text className={styles.infoLabel}>诊所地址</Text>
            <Text
              className={`${styles.infoValue} ${styles.infoValueLink}`}
              onClick={handleCopyAddress}
            >
              {clinic.address}（点击复制）
            </Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoIcon}>👨‍⚕️</Text>
          <View className={styles.infoContent}>
            <Text className={styles.infoLabel}>主治医生</Text>
            <Text className={styles.infoValue}>
              {treatment ? treatment.doctorName : '请扫码绑定治疗'}
            </Text>
          </View>
        </View>
        {treatment?.teethPosition && (
          <View className={styles.infoRow}>
            <Text className={styles.infoIcon}>🦷</Text>
            <View className={styles.infoContent}>
              <Text className={styles.infoLabel}>治疗位置</Text>
              <Text className={styles.infoValue}>{treatment.teethPosition}</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.familySection}>
        <View className={styles.familyHeader}>
          <Text className={styles.familyTitle}>👨‍👩‍👧 关心我的家人</Text>
          <View className={styles.addBtn} onClick={handleAddFamily}>
            <Text className={styles.addBtnText}>+ 添加家属</Text>
          </View>
        </View>

        {treatment?.familyMembers && treatment.familyMembers.length > 0 ? (
          <View className={styles.familyList}>
            {treatment.familyMembers.map(fm => (
              <View key={fm.id} className={styles.familyItem}>
                <View className={styles.familyAvatar}>
                  <Text>👤</Text>
                </View>
                <View className={styles.familyInfo}>
                  <View className={styles.familyNameRow}>
                    <Text className={styles.familyName}>{fm.name}</Text>
                    <Text className={styles.familyName} style={{ color: '#8A9AA3', fontWeight: '400' }}>
                      · {fm.relationship}
                    </Text>
                    {fm.isPrimary && (
                      <View className={styles.primaryBadge}>
                        <Text className={styles.primaryBadgeText}>主要联系人</Text>
                      </View>
                    )}
                  </View>
                  <Text className={styles.familyContact}>{fm.phone}</Text>
                </View>
                <View
                  className={styles.familyCallBtn}
                  onClick={() => handleCallFamily(fm.phone, fm.name)}
                >
                  <Text className={styles.familyCallIcon}>📞</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ padding: '32rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '30rpx', color: '#8A9AA3' }}>
              还没有家属加入，让家人扫码一起关心您吧~
            </Text>
          </View>
        )}
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipTitle}>💡 温馨提示</Text>
        <Text className={styles.tipText}>
          如果只是有点不舒服，请先在"症状反馈"里记录一下，诊所的回访人员会定期查看。{'\n'}
          如果疼痛难忍、大量出血或者发烧了，请立刻拨打紧急电话！
        </Text>
      </View>
    </ScrollView>
  );
};

export default ContactPage;
