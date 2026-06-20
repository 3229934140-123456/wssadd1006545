import type { Reminder, TreatmentInfo, SymptomRecord, ClinicInfo, DiscomfortReport } from '@/types';

// 诊所信息
export const mockClinicInfo: ClinicInfo = {
  name: '康美口腔诊所',
  phone: '010-88886666',
  emergencyPhone: '138-0000-1200',
  address: '北京市朝阳区健康路88号康美大厦2层',
  workHours: '周一至周日 8:30 - 18:00',
  returnVisitDate: '2026-06-27'
};

// 治疗信息
export const mockTreatmentInfo: TreatmentInfo = {
  id: 'treat_001',
  patientName: '王秀兰',
  patientAge: 68,
  treatmentType: 'extraction',
  treatmentDate: '2026-06-20',
  doctorName: '李明医生',
  clinicName: '康美口腔诊所',
  teethPosition: '左下智齿（第38号牙）',
  expectedRecoveryDays: 7,
  familyMembers: [
    {
      id: 'fm_001',
      name: '张小明',
      relationship: '儿子',
      phone: '139-1234-5678',
      isPrimary: true
    },
    {
      id: 'fm_002',
      name: '张小红',
      relationship: '女儿',
      phone: '138-8765-4321',
      isPrimary: false
    }
  ]
};

// 术后提醒数据 - 第0天（手术当天）
export const mockReminders: Reminder[] = [
  {
    id: 'rem_001',
    treatmentType: 'extraction',
    title: '咬紧纱布',
    content: '请继续咬紧伤口上的纱布，40分钟后可以取出。不要用舌头舔伤口哦。',
    detailTips: [
      '纱布咬40分钟就可以吐掉啦',
      '不要用手摸伤口，也不要反复吐口水',
      '如果还有点出血，可以再换一块纱布咬20分钟'
    ],
    timeLabel: '现在',
    scheduledTime: '14:30',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'rem_002',
    treatmentType: 'extraction',
    title: '今晚不要漱口',
    content: '今天不要漱口、不要刷牙，保护好伤口上的血凝块，这样伤口才好得快。',
    detailTips: [
      '24小时内千万不要漱口！',
      '不要用吸管喝水，吸力对伤口不好',
      '可以轻轻喝水，动作慢一点'
    ],
    timeLabel: '今晚',
    scheduledTime: '20:00',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'rem_003',
    treatmentType: 'extraction',
    title: '吃凉一点软一点',
    content: '今天可以吃凉的、软的食物，比如粥、面条、酸奶。不要吃太烫太硬的东西。',
    detailTips: [
      '用另一边牙齿嚼东西',
      '冰凉的东西可以帮助消肿（如冰淇淋）',
      '不要吃辣的、油炸的食物'
    ],
    timeLabel: '吃饭时',
    scheduledTime: '18:00',
    dayOffset: 0,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'rem_004',
    treatmentType: 'extraction',
    title: '按时吃消炎药',
    content: '请按李医生说的，饭后半小时吃消炎药和止痛药。吃了药胃不舒服的话，可以先吃点东西垫垫。',
    detailTips: [
      '阿莫西林：每天3次，每次1粒',
      '甲硝唑：每天3次，每次1粒',
      '布洛芬：痛的时候吃1粒，每天不超过4粒'
    ],
    timeLabel: '饭后',
    scheduledTime: '19:00',
    dayOffset: 0,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'rem_005',
    treatmentType: 'extraction',
    title: '今天观察是否明显出血',
    content: '今晚留意一下，如果只是口水里带点血丝是正常的。如果大口吐血或者有血块，要马上联系诊所。',
    detailTips: [
      '轻微血丝不用担心，是正常的',
      '如果出血不止，可以咬干净纱布30分钟',
      '还是止不住的话，立刻打电话给诊所'
    ],
    timeLabel: '睡前',
    scheduledTime: '22:00',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  }
];

// 更多天数的提醒（用于展示完整恢复计划）
export const mockAllReminders: Reminder[] = [
  ...mockReminders,
  {
    id: 'rem_006',
    treatmentType: 'extraction',
    title: '明天可以轻轻刷牙了',
    content: '24小时后可以刷牙了，动作要轻，避开伤口的位置。饭后可以用温盐水轻轻漱口。',
    detailTips: [
      '牙刷选软毛的',
      '伤口周围的牙齿可以轻轻刷',
      '漱口不要太用力，用清水轻轻含一下就好'
    ],
    timeLabel: '明天早上',
    scheduledTime: '08:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'rem_007',
    treatmentType: 'extraction',
    title: '拆线提醒',
    content: '您的伤口是缝了线的，7天后（6月27日上午）请来诊所拆线。拆线很快的，不用紧张。',
    detailTips: [
      '拆线时间：6月27日 上午9:00',
      '拆线前正常吃饭刷牙就可以',
      '拆线不痛，几分钟就好'
    ],
    timeLabel: '术后第7天',
    scheduledTime: '09:00',
    dayOffset: 7,
    priority: 'high',
    status: 'pending'
  }
];

// 症状反馈历史记录
export const mockSymptomRecords: SymptomRecord[] = [
  {
    id: 'sym_001',
    date: '2026-06-20',
    painLevel: 2,
    swellingLevel: 'mild',
    medicationStatus: 'taken',
    bleeding: false,
    fever: false,
    note: '麻药退了有点痛，吃了止痛药好多了',
    createdAt: '2026-06-20 18:30:00'
  },
  {
    id: 'sym_002',
    date: '2026-06-19',
    painLevel: 1,
    swellingLevel: 'none',
    medicationStatus: 'not-prescribed',
    bleeding: false,
    fever: false,
    createdAt: '2026-06-19 20:00:00'
  }
];

// 不适反馈记录
export const mockDiscomfortReports: DiscomfortReport[] = [];
