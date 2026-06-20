import Taro from '@tarojs/taro';
import type {
  TreatmentInfo,
  Reminder,
  SymptomRecord,
  DiscomfortReport,
  FamilyMember,
  ClinicInfo,
  ClinicTask
} from '@/types';

const STORAGE_KEYS = {
  TREATMENT: 'oral_treatment_info',
  REMINDERS: 'oral_reminders_list',
  SYMPTOMS: 'oral_symptom_records',
  DISCOMFORTS: 'oral_discomfort_reports',
  FAMILY_MEMBERS: 'oral_family_members',
  CLINIC_INFO: 'oral_clinic_info',
  CLINIC_TASKS: 'oral_clinic_tasks',
  BOUND_FLAG: 'oral_treatment_bound',
  LAST_SYNC_TIME: 'oral_last_sync_time'
};

const safeSetStorage = <T>(key: string, data: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(data));
    console.log(`[Storage] 保存成功: ${key}`);
  } catch (err) {
    console.error(`[Storage] 保存失败: ${key}`, err);
  }
};

const safeGetStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    if (data === '' || data === null || data === undefined) {
      return defaultValue;
    }
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`[Storage] 读取失败: ${key}`, err);
    return defaultValue;
  }
};

const safeRemoveStorage = (key: string): void => {
  try {
    Taro.removeStorageSync(key);
    console.log(`[Storage] 删除成功: ${key}`);
  } catch (err) {
    console.error(`[Storage] 删除失败: ${key}`, err);
  }
};

// 治疗信息
export const saveTreatment = (treatment: TreatmentInfo): void => {
  safeSetStorage(STORAGE_KEYS.TREATMENT, treatment);
};

export const getTreatment = (): TreatmentInfo | null => {
  return safeGetStorage<TreatmentInfo | null>(STORAGE_KEYS.TREATMENT, null);
};

export const removeTreatment = (): void => {
  safeRemoveStorage(STORAGE_KEYS.TREATMENT);
};

// 提醒列表
export const saveReminders = (reminders: Reminder[]): void => {
  safeSetStorage(STORAGE_KEYS.REMINDERS, reminders);
};

export const getReminders = (): Reminder[] => {
  return safeGetStorage<Reminder[]>(STORAGE_KEYS.REMINDERS, []);
};

// 症状记录
export const saveSymptoms = (symptoms: SymptomRecord[]): void => {
  safeSetStorage(STORAGE_KEYS.SYMPTOMS, symptoms);
};

export const getSymptoms = (): SymptomRecord[] => {
  return safeGetStorage<SymptomRecord[]>(STORAGE_KEYS.SYMPTOMS, []);
};

// 不适反馈
export const saveDiscomforts = (reports: DiscomfortReport[]): void => {
  safeSetStorage(STORAGE_KEYS.DISCOMFORTS, reports);
};

export const getDiscomforts = (): DiscomfortReport[] => {
  return safeGetStorage<DiscomfortReport[]>(STORAGE_KEYS.DISCOMFORTS, []);
};

// 家属信息
export const saveFamilyMembers = (members: FamilyMember[]): void => {
  safeSetStorage(STORAGE_KEYS.FAMILY_MEMBERS, members);
};

export const getFamilyMembers = (): FamilyMember[] => {
  return safeGetStorage<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, []);
};

// 诊所信息
export const saveClinicInfo = (clinic: ClinicInfo): void => {
  safeSetStorage(STORAGE_KEYS.CLINIC_INFO, clinic);
};

export const getClinicInfo = (): ClinicInfo | null => {
  return safeGetStorage<ClinicInfo | null>(STORAGE_KEYS.CLINIC_INFO, null);
};

// 诊所待处理任务
export const saveClinicTasks = (tasks: ClinicTask[]): void => {
  safeSetStorage(STORAGE_KEYS.CLINIC_TASKS, tasks);
};

export const getClinicTasks = (): ClinicTask[] => {
  return safeGetStorage<ClinicTask[]>(STORAGE_KEYS.CLINIC_TASKS, []);
};

// 绑定状态
export const setBoundFlag = (bound: boolean): void => {
  safeSetStorage(STORAGE_KEYS.BOUND_FLAG, bound);
};

export const getBoundFlag = (): boolean => {
  return safeGetStorage<boolean>(STORAGE_KEYS.BOUND_FLAG, false);
};

// 清除所有数据（解绑时使用）
export const clearAllStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    safeRemoveStorage(key);
  });
  console.log('[Storage] 已清除所有本地数据');
};

// 导出存储Key，方便调试
export const STORAGE_DEBUG = STORAGE_KEYS;
