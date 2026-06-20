import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useApp } from '@/store/AppContext';
import {
  TREATMENT_TYPE_MAP,
  PAIN_LEVEL_TEXT,
  SWELLING_LEVEL_TEXT,
  MEDICATION_STATUS_TEXT,
  TASK_SOURCE_MAP
} from '@/types';
import type { TaskNote } from '@/types';
import BigButton from '@/components/BigButton';
import styles from './index.module.scss';

const TaskDetailPage: React.FC = () => {
  const router = useRouter();
  const { clinicTasks, handleClinicTask, addTaskNote, clinic } = useApp();

  const taskId = router.params.taskId as string;

  const task = useMemo(() => {
    return clinicTasks.find(t => t.id === taskId);
  }, [clinicTasks, taskId]);

  const [noteInput, setNoteInput] = useState('');

  const handleAddNote = () => {
    if (!noteInput.trim() || !task) return;
    addTaskNote(task.id, noteInput.trim());
    setNoteInput('');
    Taro.showToast({ title: '备注已添加', icon: 'success' });
  };

  const handleProcess = () => {
    if (!task) return;
    handleClinicTask(task.id, 'processing', '开始联系患者');
    Taro.showToast({ title: '已标记为处理中', icon: 'success' });
  };

  const handleDone = () => {
    if (!task) return;
    Taro.showModal({
      title: '确认完成',
      content: '确认该任务已处理完成吗？',
      success: (res) => {
        if (res.confirm) {
          handleClinicTask(task.id, 'done', '已联系患者，情况正常');
          Taro.showToast({ title: '已标记为完成', icon: 'success' });
        }
      }
    });
  };

  const handleCall = () => {
    if (!task) return;
    const phone = task.report?.photos?.length ? clinic.phone : clinic.emergencyPhone;
    Taro.makePhoneCall({
      phoneNumber: phone.replace(/-/g, '')
    }).catch(err => console.error('[拨打电话] 失败:', err));
  };

  const handlePreviewPhoto = (photo: string) => {
    if (!task?.report?.photos) return;
    Taro.previewImage({
      urls: task.report.photos as string[],
      current: photo
    });
  };

  const getStatusBadge = () => {
    if (!task) return null;
    switch (task.status) {
      case 'pending':
        return { text: '待处理', className: styles.statusPending };
      case 'processing':
        return { text: '处理中', className: styles.statusProcessing };
      case 'done':
        return { text: '已完成', className: styles.statusDone };
      default:
        return { text: task.status, className: '' };
    }
  };

  const getTimeLineItems = (): { time: string; content: string; type: 'create' | 'note' | 'status' }[] => {
    if (!task) return [];
    const items: { time: string; content: string; type: 'create' | 'note' | 'status' }[] = [
      { time: task.createdAt, content: '患者提交反馈', type: 'create' }
    ];
    task.notes.forEach((note: TaskNote) => {
      if (note.statusChange) {
        const statusText = note.statusChange === 'processing' ? '标记为处理中' : '标记为已完成';
        items.push({ time: note.createdAt, content: `${note.operator}：${statusText}${note.content && note.content !== '开始处理' && note.content !== '处理完成' ? ' - ' + note.content : ''}`, type: 'status' });
      } else {
        items.push({ time: note.createdAt, content: `${note.operator}：${note.content}`, type: 'note' });
      }
    });
    return items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  };

  const statusBadge = getStatusBadge();
  const timelineItems = getTimeLineItems();

  if (!task) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.emptyBox}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>任务不存在或已删除</Text>
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
        <View className={styles.headerTop}>
          <View className={styles.patientInfo}>
            <Text className={styles.patientName}>
              {task.patientName} · {TREATMENT_TYPE_MAP[task.treatmentType]}
            </Text>
            <Text className={styles.patientDays}>术后第{task.daysAfter + 1}天</Text>
          </View>
          {statusBadge && (
            <View className={classnames(styles.statusBadge, statusBadge.className)}>
              <Text className={styles.statusText}>{statusBadge.text}</Text>
            </View>
          )}
        </View>
        <View className={styles.sourceRow}>
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
          {task.priority === 'high' && (
            <View className={styles.priorityHigh}>
              <Text className={styles.priorityText}>紧急</Text>
            </View>
          )}
        </View>
        <Text className={styles.taskTitle}>{task.title}</Text>
        <Text className={styles.taskContent}>{task.content}</Text>
      </View>

      {task.report && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📝</Text>
            <Text className={styles.sectionTitle}>患者反馈详情</Text>
          </View>

          <View className={styles.detailGrid}>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>疼痛程度</Text>
              <Text className={styles.detailValue}>{PAIN_LEVEL_TEXT[task.report.painLevel]}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>肿胀情况</Text>
              <Text className={classnames(
                styles.detailValue,
                task.report.swellingLevel === 'severe' && styles.textDanger
              )}>{SWELLING_LEVEL_TEXT[task.report.swellingLevel]}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>服药情况</Text>
              <Text className={classnames(
                styles.detailValue,
                task.report.medicationStatus === 'missed' && styles.textWarning
              )}>{MEDICATION_STATUS_TEXT[task.report.medicationStatus]}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>异常情况</Text>
              <Text className={classnames(
                styles.detailValue,
                (task.report.bleeding || task.report.fever) && styles.textDanger
              )}>
                {task.report.bleeding ? '有出血' : ''}
                {task.report.bleeding && task.report.fever ? '、' : ''}
                {task.report.fever ? '有发烧' : ''}
                {!task.report.bleeding && !task.report.fever ? '无异常' : ''}
              </Text>
            </View>
          </View>

          {task.report.photos && task.report.photos.length > 0 && (
            <View className={styles.photoSection}>
              <Text className={styles.photoTitle}>📷 反馈照片</Text>
              <View className={styles.photoRow}>
                {task.report.photos.map((photo, idx) => (
                  <View key={idx} className={styles.photoItem}>
                    <Image
                      src={photo}
                      className={styles.photoImg}
                      mode="aspectFill"
                      onClick={() => handlePreviewPhoto(photo as string)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          {task.report.note && (
            <View className={styles.patientNote}>
              <Text className={styles.patientNoteLabel}>患者备注：</Text>
              <Text className={styles.patientNoteText}>{task.report.note}</Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>⏰</Text>
          <Text className={styles.sectionTitle}>处理时间线</Text>
        </View>

        <View className={styles.timeline}>
          {timelineItems.map((item, idx) => (
            <View key={idx} className={styles.timelineItem}>
              <View className={classnames(
                styles.timelineDot,
                item.type === 'create' && styles.dotCreate,
                item.type === 'status' && styles.dotStatus,
                item.type === 'note' && styles.dotNote
              )} />
              <View className={styles.timelineContent}>
                <Text className={styles.timelineText}>{item.content}</Text>
                <Text className={styles.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {task.status !== 'done' && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>✏️</Text>
            <Text className={styles.sectionTitle}>补充备注</Text>
          </View>
          <Textarea
            className={styles.noteInput}
            placeholder="记录一下处理进展，下次回访能看到..."
            value={noteInput}
            onInput={(e) => setNoteInput(e.detail.value)}
            maxlength={200}
          />
          <View className={styles.noteActions}>
            <Text className={styles.noteCount}>{noteInput.length}/200</Text>
            <BigButton
              text="添加备注"
              type="primary"
              size="normal"
              onClick={handleAddNote}
              disabled={!noteInput.trim()}
            />
          </View>
        </View>
      )}

      <View className={styles.bottomActions}>
        {task.status === 'pending' && (
          <>
            <BigButton
              text="📞 联系患者"
              type="default"
              size="block"
              onClick={handleCall}
            />
            <BigButton
              text="开始处理"
              type="primary"
              size="block"
              onClick={handleProcess}
            />
          </>
        )}
        {task.status === 'processing' && (
          <>
            <BigButton
              text="📞 再次联系"
              type="default"
              size="block"
              onClick={handleCall}
            />
            <BigButton
              text="标记完成"
              type="success"
              size="block"
              onClick={handleDone}
            />
          </>
        )}
        {task.status === 'done' && (
          <BigButton
            text="返回列表"
            type="primary"
            size="block"
            onClick={() => Taro.navigateBack()}
          />
        )}
      </View>

      <View style={{ height: '60rpx' }} />
    </ScrollView>
  );
};

export default TaskDetailPage;
