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
}

// 疼痛程度
export type PainLevel = 0 | 1 | 2 | 3 | 4 | 5;

// 疼痛等级文字
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
}

// 家属信息
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
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

// 不适反馈
export interface DiscomfortReport {
  id: string;
  reminderId?: string;
  type: 'pain' | 'swelling' | 'bleeding' | 'fever' | 'other';
  description: string;
  level: 'mild' | 'moderate' | 'severe';
  photos: string[];
  createdAt: string;
  syncedToClinic: boolean;
}
