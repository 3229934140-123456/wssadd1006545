import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Reminder, TreatmentInfo, SymptomRecord, ClinicInfo, DiscomfortReport, ReminderStatus } from '@/types';
import {
  mockTreatmentInfo,
  mockReminders,
  mockSymptomRecords,
  mockClinicInfo,
  mockDiscomfortReports
} from '@/data/mockData';
import { getNowStr } from '@/utils/date';

interface AppState {
  treatment: TreatmentInfo | null;
  clinic: ClinicInfo;
  reminders: Reminder[];
  symptoms: SymptomRecord[];
  discomfortReports: DiscomfortReport[];
}

interface AppContextType extends AppState {
  updateReminderStatus: (reminderId: string, status: ReminderStatus) => void;
  addSymptomRecord: (record: Omit<SymptomRecord, 'id' | 'createdAt'>) => void;
  addDiscomfortReport: (report: Omit<DiscomfortReport, 'id' | 'createdAt' | 'syncedToClinic'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    treatment: mockTreatmentInfo,
    clinic: mockClinicInfo,
    reminders: mockReminders,
    symptoms: mockSymptomRecords,
    discomfortReports: mockDiscomfortReports
  });

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
      createdAt: getNowStr()
    };
    console.log('[AppContext] 添加症状记录:', newRecord);
    setState(prev => ({
      ...prev,
      symptoms: [newRecord, ...prev.symptoms]
    }));
  }, []);

  const addDiscomfortReport = useCallback((report: Omit<DiscomfortReport, 'id' | 'createdAt' | 'syncedToClinic'>) => {
    const newReport: DiscomfortReport = {
      ...report,
      id: `rep_${Date.now()}`,
      createdAt: getNowStr(),
      syncedToClinic: true
    };
    console.log('[AppContext] 添加不适报告并同步诊所:', newReport);
    setState(prev => ({
      ...prev,
      discomfortReports: [newReport, ...prev.discomfortReports]
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateReminderStatus,
        addSymptomRecord,
        addDiscomfortReport
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
