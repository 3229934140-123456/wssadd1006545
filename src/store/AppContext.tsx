import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type {
  Reminder,
  TreatmentInfo,
  SymptomRecord,
  ClinicInfo,
  DiscomfortReport,
  ClinicTask,
  FamilyMember,
  ReminderStatus,
  TreatmentType,
  ScanBindData,
  DiscomfortFormData,
  PainLevel,
  SwellingLevel,
  MedicationStatus,
  PhotoFeedbackData
} from '@/types';
import {
  SWELLING_LEVEL_TEXT,
  PAIN_LEVEL_TEXT
} from '@/types';
import {
  mockTreatmentInfo,
  mockClinicInfo,
  mockSymptomRecords,
  mockDiscomfortReports,
  mockClinicTasks,
  getReminderTemplate,
  mockScanData_Extraction,
  mockScanData_Implant,
  mockScanData_Periodontal
} from '@/data/mockData';
import { getNowStr, getTodayStr, getDaysSinceTreatment } from '@/utils/date';
import * as storage from '@/utils/storage';

interface AppState {
  treatment: TreatmentInfo | null;
  clinic: ClinicInfo;
  reminders: Reminder[];
  symptoms: SymptomRecord[];
  discomfortReports: DiscomfortReport[];
  clinicTasks: ClinicTask[];
  isBound: boolean;
}

interface AppContextType extends AppState {
  bindTreatment: (scanData: ScanBindData) => void;
  unbindTreatment: () => void;
  updateReminderStatus: (reminderId: string, status: ReminderStatus) => void;
  addSymptomRecord: (record: Omit<SymptomRecord, 'id' | 'createdAt'>) => void;
  submitDiscomfortForm: (formData: DiscomfortFormData) => DiscomfortReport;
  submitPhotoFeedback: (data: PhotoFeedbackData) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'joinedAt'>) => void;
  removeFamilyMember: (memberId: string) => void;
  handleClinicTask: (taskId: string, status: 'processing' | 'done', note?: string) => void;
  getTodayReminders: () => Reminder[];
  getRemindersForDay: (dayOffset: number) => Reminder[];
  getNextKeyReminders: () => Reminder[];
  getDiscomfortLevel: (level: PainLevel) => 'mild' | 'moderate' | 'severe';
  simulateScanCode: (type: TreatmentType) => ScanBindData;
  requestSubscription: () => Promise<boolean>;
  refreshFromStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    treatment: null,
    clinic: mockClinicInfo,
    reminders: [],
    symptoms: [],
    discomfortReports: [],
    clinicTasks: [],
    isBound: false
  });

  // 初始化：从本地存储读取数据
  useEffect(() => {
    const storedTreatment = storage.getTreatment();
    const storedReminders = storage.getReminders();
    const storedSymptoms = storage.getSymptoms();
    const storedDiscomforts = storage.getDiscomforts();
    const storedClinicInfo = storage.getClinicInfo();
    const storedClinicTasks = storage.getClinicTasks();
    const storedBound = storage.getBoundFlag();

    console.log('[AppContext] 从本地存储读取数据:', {
      hasTreatment: !!storedTreatment,
      remindersCount: storedReminders.length,
      symptomsCount: storedSymptoms.length,
      discomfortsCount: storedDiscomforts.length,
      isBound: storedBound
    });

    if (storedTreatment && storedBound) {
      setState({
        treatment: storedTreatment,
        clinic: storedClinicInfo || mockClinicInfo,
        reminders: storedReminders.length > 0 ? storedReminders : getReminderTemplate(storedTreatment.treatmentType),
        symptoms: storedSymptoms,
        discomfortReports: storedDiscomforts,
        clinicTasks: storedClinicTasks,
        isBound: true
      });
    } else {
      setState({
        treatment: mockTreatmentInfo,
        clinic: mockClinicInfo,
        reminders: getReminderTemplate(mockTreatmentInfo.treatmentType),
        symptoms: mockSymptomRecords,
        discomfortReports: mockDiscomfortReports,
        clinicTasks: mockClinicTasks,
        isBound: true
      });
    }
  }, []);

  // 持久化到本地存储
  useEffect(() => {
    if (!state.isBound || !state.treatment) return;
    storage.saveTreatment(state.treatment);
    storage.saveReminders(state.reminders);
    storage.saveSymptoms(state.symptoms);
    storage.saveDiscomforts(state.discomfortReports);
    storage.saveClinicInfo(state.clinic);
    storage.saveClinicTasks(state.clinicTasks);
    storage.setBoundFlag(state.isBound);
    console.log('[AppContext] 状态已持久化到本地存储');
  }, [state]);

  const bindTreatment = useCallback((scanData: ScanBindData) => {
    console.log('[AppContext] 扫码绑定治疗:', scanData);

    const newTreatment: TreatmentInfo = {
      id: scanData.data.treatmentId,
      patientName: scanData.data.patientName,
      patientAge: scanData.data.patientAge,
      treatmentType: scanData.data.treatmentType,
      treatmentDate: scanData.data.treatmentDate,
      doctorName: scanData.data.doctorName,
      clinicName: scanData.data.clinicName,
      teethPosition: scanData.data.teethPosition,
      expectedRecoveryDays: scanData.data.expectedRecoveryDays,
      boundAt: getNowStr(),
      familyMembers: []
    };

    const newReminders = getReminderTemplate(scanData.data.treatmentType);

    const newClinic = {
      ...scanData.data.clinic,
      returnVisitDate: scanData.data.returnVisitDate
    };

    storage.clearAllStorage();

    setState(prev => ({
      ...prev,
      treatment: newTreatment,
      clinic: newClinic,
      reminders: newReminders,
      symptoms: [],
      discomfortReports: [],
      clinicTasks: [],
      isBound: true
    }));

    console.log('[AppContext] 绑定成功，治疗信息已更新');
  }, []);

  const unbindTreatment = useCallback(() => {
    console.log('[AppContext] 解绑治疗');
    storage.clearAllStorage();
    setState({
      treatment: null,
      clinic: mockClinicInfo,
      reminders: [],
      symptoms: [],
      discomfortReports: [],
      clinicTasks: [],
      isBound: false
    });
  }, []);

  const updateReminderStatus = useCallback((reminderId: string, status: ReminderStatus) => {
    console.log('[AppContext] 更新提醒状态:', reminderId, status);
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r =>
        r.id === reminderId
          ? { ...r, status, respondedAt: getNowStr() }
          : r
      )
    }));
  }, []);

  const addSymptomRecord = useCallback((record: Omit<SymptomRecord, 'id' | 'createdAt'>) => {
    const newRecord: SymptomRecord = {
      ...record,
      id: `sym_${Date.now()}`,
      createdAt: getNowStr(),
      source: record.source || 'daily'
    };
    console.log('[AppContext] 添加症状记录:', newRecord);

    setState(prev => ({
      ...prev,
      symptoms: [newRecord, ...prev.symptoms]
    }));
  }, []);

  const getDiscomfortLevel = useCallback((painLevel: PainLevel): 'mild' | 'moderate' | 'severe' => {
    if (painLevel <= 2) return 'mild';
    if (painLevel <= 4) return 'moderate';
    return 'severe';
  }, []);

  const submitDiscomfortForm = useCallback((formData: DiscomfortFormData): DiscomfortReport => {
    console.log('[AppContext] 提交不适反馈:', formData);

    if (!state.treatment) {
      throw new Error('未绑定治疗信息');
    }

    const reminder = formData.reminderId
      ? state.reminders.find(r => r.id === formData.reminderId)
      : undefined;

    const newReport: DiscomfortReport = {
      id: `rep_${Date.now()}`,
      treatmentId: state.treatment.id,
      patientName: state.treatment.patientName,
      reminderId: formData.reminderId,
      reminderTitle: reminder?.title,
      painLevel: formData.painLevel,
      swellingLevel: formData.swellingLevel,
      medicationStatus: formData.medicationStatus,
      bleeding: formData.bleeding,
      fever: formData.fever,
      photos: formData.photos,
      note: formData.note,
      createdAt: getNowStr(),
      status: 'pending',
      nextAction: formData.nextAction
    };

    const newSymptom: Omit<SymptomRecord, 'id' | 'createdAt'> = {
      date: getTodayStr(),
      painLevel: formData.painLevel,
      swellingLevel: formData.swellingLevel,
      medicationStatus: formData.medicationStatus,
      bleeding: formData.bleeding,
      fever: formData.fever,
      note: formData.note,
      photos: formData.photos,
      source: 'discomfort',
      reminderId: formData.reminderId
    };

    const daysAfter = getDaysSinceTreatment(state.treatment.treatmentDate);
    const newTask: ClinicTask = {
      id: `task_${Date.now()}`,
      type: 'discomfort',
      source: formData.reminderId ? 'reminder' : 'symptom',
      patientName: state.treatment.patientName,
      treatmentType: state.treatment.treatmentType,
      daysAfter,
      title: `${reminder?.title || '不适反馈'} - ${formData.bleeding ? '出血' : ''}${formData.fever ? '发烧' : ''}`,
      content: `疼痛${formData.painLevel}分，${SWELLING_LEVEL_TEXT[formData.swellingLevel]}，${formData.bleeding ? '有出血' : '无出血'}，${formData.fever ? '有发烧' : '无发烧'}`,
      priority: newReport.status === 'pending' && (formData.bleeding || formData.fever || formData.painLevel >= 4) ? 'high' : 'normal',
      report: newReport,
      createdAt: getNowStr(),
      status: 'pending'
    };

    setState(prev => {
      const updatedReminders = formData.reminderId
        ? prev.reminders.map(r =>
            r.id === formData.reminderId
              ? { ...r, status: 'discomfort' as ReminderStatus, respondedAt: getNowStr(), discomfortReportId: newReport.id }
              : r
          )
        : prev.reminders;

      return {
        ...prev,
        reminders: updatedReminders,
        discomfortReports: [newReport, ...prev.discomfortReports],
        symptoms: [
          {
            ...newSymptom,
            id: `sym_${Date.now() + 1}`,
            createdAt: getNowStr()
          },
          ...prev.symptoms
        ],
        clinicTasks: [newTask, ...prev.clinicTasks]
      };
    });

    console.log('[AppContext] 不适反馈已提交，已同步到：提醒状态、症状记录、诊所待处理任务');
    return newReport;
  }, [state.treatment, state.reminders]);

  const submitPhotoFeedback = useCallback((data: PhotoFeedbackData) => {
    console.log('[AppContext] 提交照片反馈:', data);
    if (!state.treatment) {
      throw new Error('未绑定治疗信息');
    }

    const painLevel = data.painLevel ?? 2;
    const daysAfter = getDaysSinceTreatment(state.treatment.treatmentDate);
    const nowStr = getNowStr();
    const todayStr = getTodayStr();

    const sourceMap: Record<PhotoFeedbackData['from'], ClinicTask['source']> = {
      contact: 'contact',
      symptom: 'symptom',
      emergency: 'emergency'
    };
    const taskSource = sourceMap[data.from];

    const titleMap: Record<PhotoFeedbackData['from'], string> = {
      contact: '伤口照片反馈',
      symptom: '症状照片反馈',
      emergency: '紧急照片反馈'
    };

    const newReport: DiscomfortReport = {
      id: `rep_photo_${Date.now()}`,
      treatmentId: state.treatment.id,
      patientName: state.treatment.patientName,
      painLevel,
      swellingLevel: 'mild',
      medicationStatus: 'taken',
      bleeding: false,
      fever: false,
      photos: data.photos,
      note: data.note,
      createdAt: nowStr,
      status: 'pending',
      nextAction: 'photo'
    };

    const newSymptom: Omit<SymptomRecord, 'id' | 'createdAt'> = {
      date: todayStr,
      painLevel,
      swellingLevel: 'mild',
      medicationStatus: 'taken',
      bleeding: false,
      fever: false,
      note: data.note || '伤口照片反馈',
      photos: data.photos,
      source: 'photo'
    };

    const newTask: ClinicTask = {
      id: `task_${Date.now()}`,
      type: 'photo',
      source: taskSource,
      patientName: state.treatment.patientName,
      treatmentType: state.treatment.treatmentType,
      daysAfter,
      title: titleMap[data.from],
      content: `患者上传了${data.photos.length}张伤口照片${data.note ? '，备注：' + data.note : ''}${data.painLevel !== undefined ? '，疼痛' + data.painLevel + '分' : ''}`,
      priority: data.from === 'emergency' ? 'high' : 'normal',
      report: newReport,
      createdAt: nowStr,
      status: 'pending'
    };

    setState(prev => ({
      ...prev,
      discomfortReports: [newReport, ...prev.discomfortReports],
      symptoms: [
        {
          ...newSymptom,
          id: `sym_${Date.now() + 1}`,
          createdAt: nowStr
        },
        ...prev.symptoms
      ],
      clinicTasks: [newTask, ...prev.clinicTasks]
    }));

    console.log('[AppContext] 照片反馈已提交，已同步到：症状记录、诊所待处理任务');
  }, [state.treatment]);

  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id' | 'joinedAt'>) => {
    console.log('[AppContext] 添加家属:', member);
    const newMember: FamilyMember = {
      ...member,
      id: `fm_${Date.now()}`,
      joinedAt: getNowStr()
    };

    setState(prev => {
      if (!prev.treatment) return prev;
      const updatedMembers = member.isPrimary
        ? prev.treatment.familyMembers.map(m => ({ ...m, isPrimary: false }))
        : prev.treatment.familyMembers;

      return {
        ...prev,
        treatment: {
          ...prev.treatment,
          familyMembers: [...updatedMembers, newMember]
        }
      };
    });
  }, []);

  const removeFamilyMember = useCallback((memberId: string) => {
    console.log('[AppContext] 移除家属:', memberId);
    setState(prev => {
      if (!prev.treatment) return prev;
      return {
        ...prev,
        treatment: {
          ...prev.treatment,
          familyMembers: prev.treatment.familyMembers.filter(m => m.id !== memberId)
        }
      };
    });
  }, []);

  const handleClinicTask = useCallback((taskId: string, status: 'processing' | 'done', note?: string) => {
    console.log('[AppContext] 处理诊所任务:', taskId, status, note);
    setState(prev => ({
      ...prev,
      clinicTasks: prev.clinicTasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status,
              handledAt: getNowStr(),
              handledBy: '回访人员',
              note: note || t.note
            }
          : t
      ),
      discomfortReports: prev.discomfortReports.map(r =>
        r.id === prev.clinicTasks.find(t => t.id === taskId)?.report?.id
          ? { ...r, status: status === 'done' ? 'resolved' : 'contacted', handledAt: getNowStr() }
          : r
      )
    }));
  }, []);

  const getTodayReminders = useCallback((): Reminder[] => {
    if (!state.treatment) return [];
    const daysSince = getDaysSinceTreatment(state.treatment.treatmentDate);
    return state.reminders.filter(r => r.dayOffset === daysSince);
  }, [state.treatment, state.reminders]);

  const getRemindersForDay = useCallback((dayOffset: number): Reminder[] => {
    return state.reminders.filter(r => r.dayOffset === dayOffset);
  }, [state.reminders]);

  const getNextKeyReminders = useCallback((): Reminder[] => {
    if (!state.treatment) return [];
    const daysSince = getDaysSinceTreatment(state.treatment.treatmentDate);
    const futureDays = [1, 3, 7, 14, 30].filter(d => d > daysSince);
    return futureDays.slice(0, 2).flatMap(d =>
      state.reminders.filter(r => r.dayOffset === d && r.priority === 'high')
    );
  }, [state.treatment, state.reminders]);

  const simulateScanCode = useCallback((type: TreatmentType): ScanBindData => {
    console.log('[AppContext] 模拟扫码:', type);
    switch (type) {
      case 'implant':
        return JSON.parse(JSON.stringify(mockScanData_Implant));
      case 'periodontal':
        return JSON.parse(JSON.stringify(mockScanData_Periodontal));
      case 'extraction':
      default:
        return JSON.parse(JSON.stringify(mockScanData_Extraction));
    }
  }, []);

  const requestSubscription = useCallback(async (): Promise<boolean> => {
    console.log('[AppContext] 请求订阅消息');
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
          console.log('[AppContext] 订阅成功');
        }, 500);
      });
    } catch (err) {
      console.error('[AppContext] 订阅失败:', err);
      return false;
    }
  }, []);

  const refreshFromStorage = useCallback(() => {
    console.log('[AppContext] 从本地存储刷新');
    const storedTreatment = storage.getTreatment();
    const storedReminders = storage.getReminders();
    const storedSymptoms = storage.getSymptoms();
    const storedDiscomforts = storage.getDiscomforts();
    const storedClinicTasks = storage.getClinicTasks();

    if (storedTreatment) {
      setState({
        treatment: storedTreatment,
        clinic: storage.getClinicInfo() || mockClinicInfo,
        reminders: storedReminders,
        symptoms: storedSymptoms,
        discomfortReports: storedDiscomforts,
        clinicTasks: storedClinicTasks,
        isBound: true
      });
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        bindTreatment,
        unbindTreatment,
        updateReminderStatus,
        addSymptomRecord,
        submitDiscomfortForm,
        submitPhotoFeedback,
        addFamilyMember,
        removeFamilyMember,
        handleClinicTask,
        getTodayReminders,
        getRemindersForDay,
        getNextKeyReminders,
        getDiscomfortLevel,
        simulateScanCode,
        requestSubscription,
        refreshFromStorage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
};
