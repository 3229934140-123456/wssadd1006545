import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import {
  TREATMENT_TYPE_MAP,
  SWELLING_LEVEL_TEXT,
  MEDICATION_STATUS_TEXT,
  TASK_SOURCE_MAP
} from '@/types';
import type { ClinicTask } from '@/types';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const ClinicTasksPage: React.FC = () => {
  const { clinicTasks, handleClinicTask, refreshFromStorage, clinic } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'done'>('pending');

  const filteredTasks = useMemo(() => {
    return clinicTasks.filter(t => t.status === activeTab);
  }, [clinicTasks, activeTab]);

  const stats = useMemo(() => {
    return {
      pending: clinicTasks.filter(t => t.status === 'pending').length,
      processing: clinicTasks.filter(t => t.status === 'processing').length,
      done: clinicTasks.filter(t => t.status === 'done').length,
      total: clinicTasks.length
    };
  }, [clinicTasks]);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return styles.priorityHigh;
      case 'normal': return styles.priorityNormal;
      case 'low': return styles.priorityLow;
      default: return '';
    }
  };

  const handleProcess = (taskId: string) => {
    console.log('[诊所回访] 开始处理:', taskId);
    handleClinicTask(taskId, 'processing', '正在联系患者');
    Taro.showToast({ title: '已标记为处理中', icon: 'success' });
  };

  const handleDone = (taskId: string) => {
    Taro.showModal({
      title: '确认完成',
      content: '确认该任务已处理完成吗？',
      success: (res) => {
        if (res.confirm) {
          handleClinicTask(taskId, 'done', '已联系患者，情况正常');
          Taro.showToast({ title: '已标记为完成', icon: 'success' });
        }
      }
    });
  };

  const handleCall = (task: ClinicTask) => {
    console.log('[诊所回访] 拨打患者家属电话');
    const phone = task.report?.photos?.[0] ? clinic.phone : clinic.emergencyPhone;
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const handleRefresh = () => {
    console.log('[诊所回访] 下拉刷新');
    refreshFromStorage();
    setTimeout(() => Taro.stopPullDownRefresh(), 800);
  };

  const handleCallClinic = () => {
    Taro.makePhoneCall({
      phoneNumber: clinic.phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '紧急';
      case 'normal': return '普通';
      case 'low': return '低';
      default: return priority;
    }
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.header}>
        <Text className={styles.headerTitle}>👩‍⚕️ 诊所回访工作台</Text>
        <Text className={styles.headerSubtitle}>
          查看和处理患者的不适反馈，及时回访关怀
        </Text>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.processing}</Text>
            <Text className={styles.statLabel}>处理中</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.done}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabBtn, activeTab === 'pending' && styles.active)}
          onClick={() => setActiveTab('pending')}
        >
          <Text className={styles.tabBtnText}>
            待处理
            {stats.pending > 0 && (
              <Text className={styles.tabBadge}>{stats.pending}</Text>
            )}
          </Text>
        </View>
        <View
          className={classnames(styles.tabBtn, activeTab === 'processing' && styles.active)}
          onClick={() => setActiveTab('processing')}
        >
          <Text className={styles.tabBtnText}>
            处理中
            {stats.processing > 0 && (
              <Text className={styles.tabBadge}>{stats.processing}</Text>
            )}
          </Text>
        </View>
        <View
          className={classnames(styles.tabBtn, activeTab === 'done' && styles.active)}
          onClick={() => setActiveTab('done')}
        >
          <Text className={styles.tabBtnText}>已完成</Text>
        </View>
      </View>

      {stats.total === 0 ? (
        <View className={styles.emptyBox}>
          <Text className={styles.emptyIcon}>🎉</Text>
          <Text className={styles.emptyText}>暂时没有待处理的任务</Text>
          <Text className={styles.emptySubText}>
            当患者报告不适或提交症状反馈后，这里会出现待处理任务
          </Text>
          <View style={{ marginTop: '32rpx' }}>
            <BigButton
              text="拨打诊所电话"
              type="primary"
              size="normal"
              icon="📞"
              onClick={handleCallClinic}
            />
          </View>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View className={styles.emptyBox}>
          <Text className={styles.emptyIcon}>✅</Text>
          <Text className={styles.emptyText}>
            {activeTab === 'pending' ? '暂无待处理任务' :
             activeTab === 'processing' ? '暂无处理中任务' : '暂无已完成任务'}
          </Text>
          <Text className={styles.emptySubText}>
            下拉可以刷新任务列表
          </Text>
        </View>
      ) : (
        filteredTasks.map(task => (
          <View
            key={task.id}
            className={classnames(
              styles.taskCard,
              getPriorityClass(task.priority),
              task.status === 'done' && styles.statusDone
            )}
          >
            <View className={styles.taskHeader}>
              <View className={styles.taskPatientInfo}>
                <View className={styles.patientNameRow}>
                  <Text className={styles.taskPatientName}>
                    {task.patientName} · {TREATMENT_TYPE_MAP[task.treatmentType]}
                  </Text>
                  <View className={classnames(
                    styles.sourceBadge,
                    task.type === 'photo' && styles.sourcePhoto,
                    task.type === 'discomfort' && styles.sourceDiscomfort,
                    task.source === 'emergency' && styles.sourceEmergency
                  )}>
                    <Text className={styles.sourceBadgeText}>
                      {task.type === 'photo' ? '📷 ' : ''}
                      {TASK_SOURCE_MAP[task.source]}
                    </Text>
                  </View>
                </View>
                <Text className={styles.taskTreatment}>
                  术后第{task.daysAfter + 1}天
                </Text>
              </View>
              <View className={classnames(styles.priorityBadge, task.priority)}>
                <Text className={styles.priorityText}>{getPriorityText(task.priority)}</Text>
              </View>
            </View>

            <View className={styles.taskContent}>
              <Text className={styles.taskTitle}>{task.title}</Text>
              <Text className={styles.taskDesc}>{task.content}</Text>

              {task.report && (
                <View className={styles.taskDetails}>
                  <View className={styles.detailTag}>
                    <Text className={styles.detailTagText}>
                      疼痛 {task.report.painLevel}/5
                    </Text>
                  </View>
                  <View className={styles.detailTag}>
                    <Text className={styles.detailTagText}>
                      {SWELLING_LEVEL_TEXT[task.report.swellingLevel]}
                    </Text>
                  </View>
                  <View className={styles.detailTag}>
                    <Text className={styles.detailTagText}>
                      {MEDICATION_STATUS_TEXT[task.report.medicationStatus]}
                    </Text>
                  </View>
                  {task.report.bleeding && (
                    <View className={classnames(styles.detailTag, styles.danger)}>
                      <Text className={styles.detailTagText}>有出血</Text>
                    </View>
                  )}
                  {task.report.fever && (
                    <View className={classnames(styles.detailTag, styles.danger)}>
                      <Text className={styles.detailTagText}>有发烧</Text>
                    </View>
                  )}
                </View>
              )}

              {task.report?.photos && task.report.photos.length > 0 && (
                <View className={styles.photoPreviewRow}>
                  {task.report.photos.map((photo, idx) => (
                    <View key={idx} className={styles.photoPreviewItem}>
                      <Image
                        src={photo}
                        className={styles.photoPreviewImg}
                        mode="aspectFill"
                        onClick={() => {
                          Taro.previewImage({
                            urls: task.report!.photos as string[],
                            current: photo
                          });
                        }}
                      />
                    </View>
                  ))}
                </View>
              )}

              {task.report?.note && (
                <View style={{ marginTop: '16rpx', padding: '16rpx', background: '#FFF4E6', borderRadius: '12rpx' }}>
                  <Text style={{ fontSize: '26rpx', color: '#FF9F43' }}>
                    患者备注：{task.report.note}
                  </Text>
                </View>
              )}
            </View>

            <View className={styles.taskFooter}>
              <Text className={styles.taskTime}>
                提交时间：{task.createdAt}
                {task.handledAt && ` · 处理：${task.handledAt}`}
              </Text>

              {task.status === 'pending' && (
                <View className={styles.taskActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.call)}
                    onClick={() => handleCall(task)}
                  >
                    <Text className={styles.actionBtnText}>📞 联系</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.process)}
                    onClick={() => handleProcess(task.id)}
                  >
                    <Text className={styles.actionBtnText}>处理中</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.done)}
                    onClick={() => handleDone(task.id)}
                  >
                    <Text className={styles.actionBtnText}>完成</Text>
                  </View>
                </View>
              )}

              {task.status === 'processing' && (
                <View className={styles.taskActions}>
                  <View
                    className={classnames(styles.actionBtn, styles.call)}
                    onClick={() => handleCall(task)}
                  >
                    <Text className={styles.actionBtnText}>📞 再次联系</Text>
                  </View>
                  <View
                    className={classnames(styles.actionBtn, styles.done)}
                    onClick={() => handleDone(task.id)}
                  >
                    <Text className={styles.actionBtnText}>完成</Text>
                  </View>
                </View>
              )}

              {task.status === 'done' && (
                <View className={styles.statusBadge}>
                  <Text className={styles.statusText}>✓ {task.handledBy} 已处理</Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}

      {stats.total > 0 && (
        <Text className={styles.refreshTip}>下拉可以刷新最新数据</Text>
      )}
    </ScrollView>
  );
};

export default ClinicTasksPage;
