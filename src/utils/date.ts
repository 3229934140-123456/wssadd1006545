import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format);
};

export const formatTime = (date: string | Date, format = 'HH:mm'): string => {
  return dayjs(date).format(format);
};

export const getDaysSinceTreatment = (treatmentDate: string): number => {
  const today = dayjs().startOf('day');
  const treatDay = dayjs(treatmentDate).startOf('day');
  return today.diff(treatDay, 'day');
};

export const getRecoveryProgress = (treatmentDate: string, expectedDays: number): number => {
  const daysPassed = getDaysSinceTreatment(treatmentDate);
  const progress = Math.min(100, Math.round((daysPassed / expectedDays) * 100));
  return Math.max(0, progress);
};

export const getFriendlyDateLabel = (dayOffset: number): string => {
  if (dayOffset === 0) return '今天';
  if (dayOffset === 1) return '明天';
  if (dayOffset === 7) return '一周后';
  return `第${dayOffset + 1}天`;
};

export const getTodayStr = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

export const getNowStr = (): string => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};
