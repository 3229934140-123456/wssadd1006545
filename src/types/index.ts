// 治疗类型
export type TreatmentType = 'extraction' | 'implant' | 'periodontal';

// 治疗类型名称映射
export const TREATMENT_TYPE_MAP: Record<TreatmentType, string> = {
  extraction: '拔牙手术',
  implant: '种植牙手术',
  periodontal: '牙周手术'
};

// 提醒状态
export type ReminderStatus = 'pending' | 'done' | 'discomfort';

// 提醒项
export interface Reminder {
  id: string;
  treatmentType: TreatmentType;
  title: string;
  content: string;
  detailTips?: string[];
  timeLabel: string;
  scheduledTime: string;
  dayOffset: number;
  priority: 'high' | 'normal';
  status: ReminderStatus;
  respondedAt?: string;
  discomfortReportId?: string;
}

// 疼痛程度
export type PainLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const PAIN_LEVEL_TEXT: Record<PainLevel, string> = {
  0: '完全不痛',
  1: '轻微不适',
  2: '有点痛',
  3: '中等疼痛',
  4: '比较痛',
  5: '非常痛'
};

// 肿胀程度
export type SwellingLevel = 'none' | 'mild' | 'moderate' | 'severe';

export const SWELLING_LEVEL_TEXT: Record<SwellingLevel, string> = {
  none: '没有肿胀',
  mild: '轻微肿胀',
  moderate: '明显肿胀',
  severe: '严重肿胀'
};

// 服药情况
export type MedicationStatus = 'taken' | 'partial' | 'missed' | 'not-prescribed';

export const MEDICATION_STATUS_TEXT: Record<MedicationStatus, string> = {
  taken: '按时吃药了',
  partial: '吃了一部分',
  missed: '忘记吃药了',
  'not-prescribed': '没有开药'
};

// 症状反馈记录
export interface SymptomRecord {
  id: string;
  date: string;
  painLevel: PainLevel;
  swellingLevel: SwellingLevel;
  medicationStatus: MedicationStatus;
  bleeding: boolean;
  fever: boolean;
  note?: string;
  photos?: string[];
  createdAt: string;
  source: 'daily' | 'discomfort' | 'photo';
  reminderId?: string;
}

// 治疗信息
export interface TreatmentInfo {
  id: string;
  patientName: string;
  patientAge: number;
  treatmentType: TreatmentType;
  treatmentDate: string;
  doctorName: string;
  clinicName: string;
  teethPosition?: string;
  expectedRecoveryDays: number;
  familyMembers: FamilyMember[];
  boundAt?: string;
}

// 家属信息
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  joinedAt?: string;
}

// 家属邀请信息
export interface FamilyInvite {
  treatmentId: string;
  patientName: string;
  inviteCode: string;
  qrCodeUrl?: string;
  expireAt: string;
}

// 诊所信息
export interface ClinicInfo {
  name: string;
  phone: string;
  emergencyPhone: string;
  address: string;
  workHours: string;
  returnVisitDate?: string;
}

// 不适反馈表单
export interface DiscomfortFormData {
  reminderId?: string;
  painLevel: PainLevel;
  swellingLevel: SwellingLevel;
  medicationStatus: MedicationStatus;
  bleeding: boolean;
  fever: boolean;
  photos: string[];
  note?: string;
  nextAction: 'call' | 'photo' | 'wait';
}

// 不适反馈（与症状记录关联，诊所端可见）
export interface DiscomfortReport {
  id: string;
  treatmentId: string;
  patientName: string;
  reminderId?: string;
  reminderTitle?: string;
  painLevel: PainLevel;
  swellingLevel: SwellingLevel;
  medicationStatus: MedicationStatus;
  bleeding: boolean;
  fever: boolean;
  photos: string[];
  note?: string;
  createdAt: string;
  handledAt?: string;
  handledBy?: string;
  status: 'pending' | 'contacted' | 'resolved';
  nextAction: 'call' | 'photo' | 'wait';
}

// 扫码绑定治疗的数据结构（二维码内容）
export interface ScanBindData {
  type: 'treatment-bind';
  version: '1.0';
  data: {
    treatmentId: string;
    patientName: string;
    patientAge: number;
    treatmentType: TreatmentType;
    treatmentDate: string;
    doctorName: string;
    clinicName: string;
    teethPosition?: string;
    expectedRecoveryDays: number;
    returnVisitDate?: string;
    clinic: ClinicInfo;
  };
}

// 订阅消息模板
export interface SubscriptionTemplate {
  id: string;
  title: string;
  desc: string;
  tmplId: string;
}

// 处理备注项
export interface TaskNote {
  id: string;
  content: string;
  operator: string;
  createdAt: string;
  statusChange?: 'processing' | 'done';
}

// 诊所回访待处理任务
export interface ClinicTask {
  id: string;
  type: 'discomfort' | 'symptom' | 'followup' | 'photo';
  source: 'reminder' | 'symptom' | 'contact' | 'emergency' | 'photo';
  patientName: string;
  treatmentType: TreatmentType;
  daysAfter: number;
  title: string;
  content: string;
  priority: 'high' | 'normal' | 'low';
  report?: DiscomfortReport;
  symptom?: SymptomRecord;
  createdAt: string;
  status: 'pending' | 'processing' | 'done';
  handledAt?: string;
  handledBy?: string;
  note?: string;
  notes: TaskNote[];
}

// 照片反馈表单数据
export interface PhotoFeedbackData {
  from: 'contact' | 'symptom' | 'emergency';
  photos: string[];
  painLevel?: PainLevel;
  note?: string;
}

// 任务来源文本映射
export const TASK_SOURCE_MAP: Record<ClinicTask['source'], string> = {
  reminder: '今日提醒',
  symptom: '症状反馈',
  contact: '联系诊所',
  emergency: '紧急联系',
  photo: '伤口照片'
};
