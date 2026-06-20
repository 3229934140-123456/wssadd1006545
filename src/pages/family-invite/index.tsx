import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import { generateFamilyInvite } from '@/data/mockData';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const FamilyInvitePage: React.FC = () => {
  const router = useRouter();
  const { treatment, addFamilyMember, removeFamilyMember } = useApp();
  const mode = router.params.mode as 'invite' | 'join';

  const [activeMode, setActiveMode] = useState<'invite' | 'join'>(mode || 'invite');
  const [invite] = useState(() => treatment ? generateFamilyInvite(treatment) : null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [relation, setRelation] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const relationOptions = ['儿子', '女儿', '配偶', '孙子', '孙女', '其他亲属', '朋友', '护工'];

  const handleCopyCode = () => {
    if (!invite) return;
    Taro.setClipboardData({
      data: invite.inviteCode,
      success: () => {
        Taro.showToast({ title: '邀请码已复制', icon: 'success' });
      }
    });
  };

  const handleCallFamily = (phoneNum: string) => {
    Taro.makePhoneCall({
      phoneNumber: phoneNum.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const handleRemoveFamily = (memberId: string, memberName: string) => {
    Taro.showModal({
      title: '确认移除',
      content: `确定要移除${memberName}吗？`,
      success: (res) => {
        if (res.confirm) {
          removeFamilyMember(memberId);
          Taro.showToast({ title: '已移除', icon: 'success' });
        }
      }
    });
  };

  const handleJoinFamily = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入您的姓名', icon: 'none' });
      return;
    }
    if (!phone.trim()) {
      Taro.showToast({ title: '请输入您的电话', icon: 'none' });
      return;
    }
    if (!inviteCode.trim()) {
      Taro.showToast({ title: '请输入邀请码', icon: 'none' });
      return;
    }
    if (!relation) {
      Taro.showToast({ title: '请选择您与患者的关系', icon: 'none' });
      return;
    }

    console.log('[家属加入] 提交:', { name, phone, inviteCode, relation, isPrimary });

    addFamilyMember({
      name: name.trim(),
      phone: phone.trim(),
      relationship: relation,
      isPrimary
    });

    Taro.showModal({
      title: '加入成功！',
      content: `您已成功加入${treatment?.patientName || '患者'}的家属关怀列表。现在您可以：\n\n1. 查看术后提醒\n2. 接收恢复情况通知\n3. 联系诊所`,
      showCancel: false,
      confirmText: '我知道了',
      success: () => {
        Taro.switchTab({ url: '/pages/reminders/index' });
      }
    });
  };

  const handleGoBack = () => {
    Taro.switchTab({ url: '/pages/contact/index' });
  };

  const familyMembers = treatment?.familyMembers || [];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.headerCard}>
        <Text className={styles.headerIcon}>👨‍👩‍👧‍👦</Text>
        <Text className={styles.headerTitle}>
          {activeMode === 'invite' ? '邀请家人一起关心' : '加入家属关怀'}
        </Text>
        <Text className={styles.headerSubtitle}>
          {activeMode === 'invite'
            ? '让家人一起帮忙照顾，多一份关心，多一份安心'
            : '加入后可以一起查看恢复情况，接收重要提醒'}
        </Text>
        {treatment && (
          <View className={styles.patientInfo}>
            <Text className={styles.patientName}>
              患者：{treatment.patientName} · {treatment.patientAge}岁
            </Text>
          </View>
        )}
      </View>

      <View className={styles.modeToggle}>
        <View
          className={classnames(styles.modeBtn, activeMode === 'invite' && styles.active)}
          onClick={() => setActiveMode('invite')}
        >
          <Text className={styles.modeBtnText}>我是患者/家属，要邀请</Text>
        </View>
        <View
          className={classnames(styles.modeBtn, activeMode === 'join' && styles.active)}
          onClick={() => setActiveMode('join')}
        >
          <Text className={styles.modeBtnText}>我是家属，要加入</Text>
        </View>
      </View>

      {activeMode === 'invite' && (
        <>
          <View className={styles.qrSection}>
            <Text className={styles.qrTitle}>让家属扫这个二维码</Text>
            <Text className={styles.qrSubtitle}>
              用微信扫一扫，或者输入下方的邀请码加入
            </Text>
            <View className={styles.qrCodeBox}>
              {invite?.qrCodeUrl ? (
                <Image
                  src={invite.qrCodeUrl}
                  className={styles.qrCodeImg}
                  mode="aspectFit"
                  onError={(e) => console.log('二维码加载失败:', e)}
                />
              ) : (
                <Text className={styles.qrPlaceholder}>📱</Text>
              )}
            </View>

            <View className={styles.inviteCodeSection}>
              <View>
                <Text className={styles.inviteCodeLabel}>邀请码</Text>
                <Text className={styles.inviteCode}>{invite?.inviteCode || '------'}</Text>
              </View>
              <View className={styles.copyBtn} onClick={handleCopyCode}>
                <Text className={styles.copyBtnText}>复制</Text>
              </View>
            </View>
          </View>

          <View className={styles.tipSection}>
            <Text className={styles.tipTitle}>家属加入后可以做什么？</Text>
            <View className={styles.tipList}>
              <View className={styles.tipItem}>
                <Text className={styles.tipNum}>1</Text>
                <Text className={styles.tipText}>
                  查看每天的术后提醒，帮忙监督患者是否做到
                </Text>
              </View>
              <View className={styles.tipItem}>
                <Text className={styles.tipNum}>2</Text>
                <Text className={styles.tipText}>
                  接收患者的不适反馈通知，第一时间知道情况
                </Text>
              </View>
              <View className={styles.tipItem}>
                <Text className={styles.tipNum}>3</Text>
                <Text className={styles.tipText}>
                  一键拨打诊所电话，帮忙联系医生
                </Text>
              </View>
              <View className={styles.tipItem}>
                <Text className={styles.tipNum}>4</Text>
                <Text className={styles.tipText}>
                  查看症状记录，了解恢复趋势
                </Text>
              </View>
            </View>
          </View>

          <View className={styles.familyListSection}>
            <Text className={styles.familyListTitle}>
              已加入的家人（{familyMembers.length}人）
            </Text>

            {familyMembers.length > 0 ? (
              familyMembers.map(member => (
                <View
                  key={member.id}
                  className={styles.familyItem}
                  onLongPress={() => handleRemoveFamily(member.id, member.name)}
                >
                  <View className={styles.familyAvatar}>
                    <Text>👤</Text>
                  </View>
                  <View className={styles.familyInfo}>
                    <View className={styles.familyNameRow}>
                      <Text className={styles.familyName}>{member.name}</Text>
                      <Text style={{ color: '#8A9AA3', fontWeight: '400' }}>
                        · {member.relationship}
                      </Text>
                      {member.isPrimary && (
                        <View className={styles.primaryBadge}>
                          <Text className={styles.primaryBadgeText}>主要联系人</Text>
                        </View>
                      )}
                    </View>
                    <Text className={styles.familyContact}>{member.phone}</Text>
                    {member.joinedAt && (
                      <Text className={styles.familyJoined}>
                        加入时间：{member.joinedAt}
                      </Text>
                    )}
                  </View>
                  <View
                    className={styles.familyCallBtn}
                    onClick={() => handleCallFamily(member.phone)}
                  >
                    <Text className={styles.familyCallIcon}>📞</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyFamily}>
                <Text className={styles.emptyIcon}>😊</Text>
                <Text className={styles.emptyText}>还没有家人加入，快邀请他们吧~</Text>
              </View>
            )}
          </View>
        </>
      )}

      {activeMode === 'join' && (
        <View className={styles.joinFormCard}>
          <Text className={styles.joinFormTitle}>填写您的信息</Text>
          <Text className={styles.joinFormSubtitle}>
            只需要几个简单的信息，就能一起关心家人了
          </Text>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>您的姓名</Text>
            <View className={styles.inputBox}>
              <Input
                className={styles.inputField}
                placeholder="请输入您的姓名"
                value={name}
                onInput={(e) => setName(e.detail.value)}
                maxlength={20}
              />
            </View>
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>联系电话</Text>
            <View className={styles.inputBox}>
              <Input
                className={styles.inputField}
                type="number"
                placeholder="请输入您的手机号"
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
                maxlength={11}
              />
            </View>
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>邀请码</Text>
            <View className={styles.inputBox}>
              <Input
                className={styles.inputField}
                placeholder="请输入6位邀请码"
                value={inviteCode}
                onInput={(e) => setInviteCode(e.detail.value.toUpperCase())}
                maxlength={6}
              />
            </View>
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>您与患者的关系</Text>
            <View className={styles.relationGrid}>
              {relationOptions.map(rel => (
                <View
                  key={rel}
                  className={classnames(
                    styles.relationBtn,
                    relation === rel && styles.active
                  )}
                  onClick={() => setRelation(rel)}
                >
                  <Text className={styles.relationText}>{rel}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.inputGroup}>
            <View
              className={styles.switchRow}
              onClick={() => setIsPrimary(!isPrimary)}
            >
              <Text className={styles.switchLabel}>设为主要联系人</Text>
              <View className={classnames(styles.switchControl, isPrimary && styles.on)}>
                <View className={styles.switchDot} />
              </View>
            </View>
          </View>

          <BigButton
            text="加入家属关怀"
            subText="一起关心家人的恢复"
            type="primary"
            size="block"
            icon="✓"
            onClick={handleJoinFamily}
          />
        </View>
      )}

      <View style={{ height: '160rpx' }} />

      <View className={styles.bottomActions}>
        <BigButton
          text="返回联系诊所"
          type="default"
          size="block"
          onClick={handleGoBack}
        />
      </View>
    </ScrollView>
  );
};

export default FamilyInvitePage;
