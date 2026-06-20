import type {
  Reminder,
  TreatmentInfo,
  SymptomRecord,
  ClinicInfo,
  DiscomfortReport,
  ScanBindData,
  FamilyInvite,
  ClinicTask,
  TreatmentType
} from '@/types';

// 诊所信息
export const mockClinicInfo: ClinicInfo = {
  name: '康美口腔诊所',
  phone: '010-88886666',
  emergencyPhone: '138-0000-1200',
  address: '北京市朝阳区健康路88号康美大厦2层',
  workHours: '周一至周日 8:30 - 18:00',
  returnVisitDate: '2026-06-27'
};

// 默认治疗信息（拔牙手术）
export const mockTreatmentInfo: TreatmentInfo = {
  id: 'treat_ext_001',
  patientName: '王秀兰',
  patientAge: 68,
  treatmentType: 'extraction',
  treatmentDate: '2026-06-20',
  doctorName: '李明医生',
  clinicName: '康美口腔诊所',
  teethPosition: '左下智齿（第38号牙）',
  expectedRecoveryDays: 7,
  boundAt: '2026-06-20 14:00:00',
  familyMembers: [
    {
      id: 'fm_001',
      name: '张小明',
      relationship: '儿子',
      phone: '139-1234-5678',
      isPrimary: true,
      joinedAt: '2026-06-20 14:05:00'
    },
    {
      id: 'fm_002',
      name: '张小红',
      relationship: '女儿',
      phone: '138-8765-4321',
      isPrimary: false,
      joinedAt: '2026-06-20 14:10:00'
    }
  ]
};

// ==================== 拔牙手术提醒模板 ====================
const extractionReminders: Reminder[] = [
  // 第0天（手术当天）
  {
    id: 'ext_0_1',
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
    id: 'ext_0_2',
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
    id: 'ext_0_3',
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
    id: 'ext_0_4',
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
    id: 'ext_0_5',
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
  },
  // 第1天
  {
    id: 'ext_1_1',
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
    id: 'ext_1_2',
    treatmentType: 'extraction',
    title: '可以开始热敷消肿了',
    content: '手术48小时后，可以用温热的毛巾敷在脸上，帮助消肿。每次15分钟，每天3-4次。',
    detailTips: [
      '注意温度不要太烫，避免烫伤',
      '隔着毛巾敷，不要直接接触皮肤',
      '如果肿胀越来越严重，要及时联系医生'
    ],
    timeLabel: '随时',
    scheduledTime: '10:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'ext_1_3',
    treatmentType: 'extraction',
    title: '今天可以吃半流质食物啦',
    content: '今天可以吃鸡蛋羹、软面包、煮烂的面条等半流质食物，还是不要用伤口那边咀嚼哦。',
    detailTips: [
      '食物温度要适中，不要太烫',
      '多吃蔬菜水果，补充营养',
      '不要抽烟喝酒，会影响伤口愈合'
    ],
    timeLabel: '三餐',
    scheduledTime: '12:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  // 第2-3天
  {
    id: 'ext_2_1',
    treatmentType: 'extraction',
    title: '观察伤口恢复情况',
    content: '今天看看伤口有没有白色的假膜，那是正常的保护组织，不要用手去碰。如果有剧烈疼痛或恶臭，可能是干槽症，要马上联系诊所。',
    detailTips: [
      '伤口有点发白是正常的，不要紧张',
      '如果疼痛越来越厉害，要及时看医生',
      '保持口腔清洁，饭后漱口'
    ],
    timeLabel: '上午',
    scheduledTime: '10:00',
    dayOffset: 2,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'ext_3_1',
    treatmentType: 'extraction',
    title: '继续保持口腔卫生',
    content: '继续好好刷牙，伤口附近轻轻刷。可以用漱口水含漱，帮助清洁伤口。',
    detailTips: [
      '每天早晚认真刷牙',
      '饭后用清水或漱口水漱口',
      '动作轻柔，避免刺激伤口'
    ],
    timeLabel: '早晚',
    scheduledTime: '08:00',
    dayOffset: 3,
    priority: 'normal',
    status: 'pending'
  },
  // 第7天（拆线）
  {
    id: 'ext_7_1',
    treatmentType: 'extraction',
    title: '今天要去医院拆线啦',
    content: '您的伤口是缝了线的，今天请来诊所拆线。拆线很快的，不用紧张，几分钟就好。',
    detailTips: [
      '拆线时间：上午9:00，请准时到',
      '拆线前正常吃饭刷牙就可以',
      '拆线不痛，很快就好了',
      '拆完线后医生会检查伤口愈合情况'
    ],
    timeLabel: '上午',
    scheduledTime: '09:00',
    dayOffset: 7,
    priority: 'high',
    status: 'pending'
  }
];

// ==================== 种植牙手术提醒模板 ====================
const implantReminders: Reminder[] = [
  // 第0天
  {
    id: 'imp_0_1',
    treatmentType: 'implant',
    title: '咬紧纱布止血',
    content: '请咬紧伤口上的纱布1小时，帮助止血。不要用舌头舔手术区域，也不要反复吐口水。',
    detailTips: [
      '纱布咬紧1小时后可以取出',
      '口中有淡淡血丝是正常的，不用担心',
      '如果大量出血，请立刻联系诊所'
    ],
    timeLabel: '现在',
    scheduledTime: '14:30',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'imp_0_2',
    treatmentType: 'implant',
    title: '24小时内不要刷牙漱口',
    content: '手术当天不要刷牙、不要漱口，保护手术区域的血凝块，这对种植体愈合非常重要。',
    detailTips: [
      '24小时内绝对不要刷牙漱口',
      '不要用吸管喝水',
      '可以喝温水，小口慢慢喝'
    ],
    timeLabel: '今天',
    scheduledTime: '15:00',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'imp_0_3',
    treatmentType: 'implant',
    title: '今天吃凉软食物',
    content: '今天只能吃凉的、软的食物，比如冰淇淋、酸奶、粥等。食物温度不要超过体温。',
    detailTips: [
      '用非手术侧咀嚼',
      '避免太烫、太硬、太辣的食物',
      '冰凉的食物可以帮助消肿止痛'
    ],
    timeLabel: '三餐',
    scheduledTime: '18:00',
    dayOffset: 0,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'imp_0_4',
    treatmentType: 'implant',
    title: '今天冷敷消肿',
    content: '手术48小时内请冷敷。用冰袋隔着毛巾敷在手术区域对应的脸上，每次15分钟，休息15分钟。',
    detailTips: [
      '冰袋不要直接接触皮肤，避免冻伤',
      '每次冷敷不超过20分钟',
      '晚上睡觉可以适当垫高头部'
    ],
    timeLabel: '随时',
    scheduledTime: '16:00',
    dayOffset: 0,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'imp_0_5',
    treatmentType: 'implant',
    title: '按时服用抗生素',
    content: '请按医嘱按时服用抗生素，预防感染。即使没有不适，也要吃完整个疗程。',
    detailTips: [
      '抗生素一定要按时按量吃完',
      '止痛药只有痛的时候吃',
      '如果出现皮疹等过敏反应，立即停药并联系医生'
    ],
    timeLabel: '饭后',
    scheduledTime: '19:00',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  // 第1天
  {
    id: 'imp_1_1',
    treatmentType: 'implant',
    title: '可以开始轻轻刷牙了',
    content: '24小时后可以刷牙了，但手术区域要避开，其他牙齿正常刷。可以用漱口水轻轻含漱。',
    detailTips: [
      '手术区域周围的牙齿可以轻轻刷',
      '用软毛牙刷，动作要轻',
      '漱口水含在口中轻轻晃动即可'
    ],
    timeLabel: '早上',
    scheduledTime: '08:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'imp_1_2',
    treatmentType: 'implant',
    title: '48小时后可以热敷',
    content: '手术48小时后，可以改为热敷，帮助活血化瘀、消肿。用温热的毛巾，每次15分钟。',
    detailTips: [
      '热敷温度不要太烫',
      '如果肿胀加重或疼痛加剧，停止热敷并联系医生',
      '每天可以热敷3-4次'
    ],
    timeLabel: '随时',
    scheduledTime: '10:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  // 第3天
  {
    id: 'imp_3_1',
    treatmentType: 'implant',
    title: '注意休息，避免剧烈运动',
    content: '本周内避免剧烈运动、重体力劳动。充足的休息有助于伤口愈合。',
    detailTips: [
      '不要跑步、游泳等剧烈运动',
      '不要长时间弯腰低头',
      '保证充足睡眠'
    ],
    timeLabel: '全天',
    scheduledTime: '09:00',
    dayOffset: 3,
    priority: 'normal',
    status: 'pending'
  },
  // 第7天（拆线）
  {
    id: 'imp_7_1',
    treatmentType: 'implant',
    title: '本周日来拆线复查',
    content: '术后7天请来诊所拆线，医生会检查种植体愈合情况。拆线很快，不会痛的。',
    detailTips: [
      '请按预约时间准时到',
      '拆线前正常饮食刷牙',
      '拆完线后医生会告知下一步注意事项'
    ],
    timeLabel: '上午',
    scheduledTime: '09:00',
    dayOffset: 7,
    priority: 'high',
    status: 'pending'
  },
  // 第30天（复查）
  {
    id: 'imp_30_1',
    treatmentType: 'implant',
    title: '一个月后复查',
    content: '种植术后1个月请来复查，拍X光片看看种植体和骨头结合的情况。',
    detailTips: [
      '请提前电话预约',
      '带上之前的检查资料',
      '如果这期间有任何不适，随时联系我们'
    ],
    timeLabel: '上午',
    scheduledTime: '09:00',
    dayOffset: 30,
    priority: 'high',
    status: 'pending'
  }
];

// ==================== 牙周手术提醒模板 ====================
const periodontalReminders: Reminder[] = [
  // 第0天
  {
    id: 'per_0_1',
    treatmentType: 'periodontal',
    title: '咬紧牙周塞治剂',
    content: '医生给您上的牙周保护剂（塞治剂），请保护好它，有助于伤口愈合。如果有大块脱落，请联系诊所。',
    detailTips: [
      '塞治剂可以保护伤口、减轻疼痛',
      '不要用手去抠、去碰',
      '少量脱落是正常的，完全掉了要联系医生'
    ],
    timeLabel: '现在',
    scheduledTime: '15:00',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'per_0_2',
    treatmentType: 'periodontal',
    title: '今天不要刷牙漱口',
    content: '手术当天不要刷牙、不要漱口，也不要用舌头舔手术区域。让伤口好好休息。',
    detailTips: [
      '24小时内不要刷牙漱口',
      '不要用吸管',
      '可以喝温凉水，小口慢喝'
    ],
    timeLabel: '今天',
    scheduledTime: '15:30',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'per_0_3',
    treatmentType: 'periodontal',
    title: '吃温凉软的食物',
    content: '今天吃温凉、软烂的食物，比如粥、面条、蒸蛋。不要用手术区域的牙齿咀嚼。',
    detailTips: [
      '用健康一侧的牙齿吃饭',
      '食物不要太烫太硬',
      '避免辛辣刺激食物'
    ],
    timeLabel: '三餐',
    scheduledTime: '18:00',
    dayOffset: 0,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'per_0_4',
    treatmentType: 'periodontal',
    title: '按时吃药',
    content: '请按医嘱服用消炎药和止痛药。牙周手术后的恢复很重要，不要自行停药。',
    detailTips: [
      '消炎药请按时吃完整个疗程',
      '漱口水明天开始使用',
      '如有不适随时联系医生'
    ],
    timeLabel: '饭后',
    scheduledTime: '19:00',
    dayOffset: 0,
    priority: 'high',
    status: 'pending'
  },
  // 第1天
  {
    id: 'per_1_1',
    treatmentType: 'periodontal',
    title: '开始用漱口水',
    content: '今天可以开始用医生开的漱口水了，每天2次，每次含漱1分钟。不要用力漱口，轻轻含着就好。',
    detailTips: [
      '漱口水用10-15ml即可',
      '含在口中30秒到1分钟后吐掉',
      '用完漱口水后半小时内不要吃东西喝水'
    ],
    timeLabel: '早晚',
    scheduledTime: '08:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  {
    id: 'per_1_2',
    treatmentType: 'periodontal',
    title: '非手术区域可以正常刷牙',
    content: '今天开始可以刷牙了，但手术区域先不要刷。其他牙齿正常刷，保持口腔卫生很重要。',
    detailTips: [
      '用软毛牙刷',
      '避开手术区域',
      '动作要轻柔'
    ],
    timeLabel: '早晚',
    scheduledTime: '08:00',
    dayOffset: 1,
    priority: 'normal',
    status: 'pending'
  },
  // 第7天（复查）
  {
    id: 'per_7_1',
    treatmentType: 'periodontal',
    title: '一周后复查',
    content: '术后7天请来诊所复查，医生会检查牙周愈合情况，可能会更换或去除塞治剂。',
    detailTips: [
      '请按预约时间就诊',
      '复查后医生会告知下一步护理方案',
      '如果期间有严重疼痛或肿胀，及时联系'
    ],
    timeLabel: '上午',
    scheduledTime: '09:00',
    dayOffset: 7,
    priority: 'high',
    status: 'pending'
  },
  // 第14天
  {
    id: 'per_14_1',
    treatmentType: 'periodontal',
    title: '两周后可以轻轻刷牙',
    content: '复查后医生确认没问题，可以用超软毛牙刷轻轻刷手术区域了。动作一定要轻哦。',
    detailTips: [
      '选用超软毛牙刷',
      '顺着牙龈方向轻轻刷',
      '不要用力按压'
    ],
    timeLabel: '早晚',
    scheduledTime: '08:00',
    dayOffset: 14,
    priority: 'normal',
    status: 'pending'
  },
  // 第30天
  {
    id: 'per_30_1',
    treatmentType: 'periodontal',
    title: '每月定期复查',
    content: '牙周治疗后需要定期复查维护，建议每1-2个月来诊所做一次牙周维护，这样才能保持治疗效果。',
    detailTips: [
      '请预约下次复查时间',
      '坚持每天认真刷牙',
      '使用牙线和牙缝刷清洁牙缝'
    ],
    timeLabel: '上午',
    scheduledTime: '09:00',
    dayOffset: 30,
    priority: 'high',
    status: 'pending'
  }
];

// 根据治疗类型获取提醒模板
export const getReminderTemplate = (type: TreatmentType): Reminder[] => {
  switch (type) {
    case 'extraction':
      return JSON.parse(JSON.stringify(extractionReminders));
    case 'implant':
      return JSON.parse(JSON.stringify(implantReminders));
    case 'periodontal':
      return JSON.parse(JSON.stringify(periodontalReminders));
    default:
      return JSON.parse(JSON.stringify(extractionReminders));
  }
};

// 默认显示当前天数的提醒（拔牙，第0天）
export const mockReminders: Reminder[] = getReminderTemplate('extraction');

// 全部提醒数据（用于调试）
export const mockAllReminders: Reminder[] = [
  ...extractionReminders,
  ...implantReminders,
  ...periodontalReminders
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
    createdAt: '2026-06-20 18:30:00',
    source: 'daily'
  }
];

// 不适反馈记录
export const mockDiscomfortReports: DiscomfortReport[] = [];

// 扫码绑定数据（模拟二维码内容）
export const mockScanData_Extraction: ScanBindData = {
  type: 'treatment-bind',
  version: '1.0',
  data: {
    treatmentId: 'treat_ext_001',
    patientName: '王秀兰',
    patientAge: 68,
    treatmentType: 'extraction',
    treatmentDate: '2026-06-20',
    doctorName: '李明医生',
    clinicName: '康美口腔诊所',
    teethPosition: '左下智齿（第38号牙）',
    expectedRecoveryDays: 7,
    returnVisitDate: '2026-06-27',
    clinic: mockClinicInfo
  }
};

export const mockScanData_Implant: ScanBindData = {
  type: 'treatment-bind',
  version: '1.0',
  data: {
    treatmentId: 'treat_imp_002',
    patientName: '王秀兰',
    patientAge: 68,
    treatmentType: 'implant',
    treatmentDate: '2026-06-20',
    doctorName: '张医生',
    clinicName: '康美口腔诊所',
    teethPosition: '右下第6号牙',
    expectedRecoveryDays: 30,
    returnVisitDate: '2026-06-27',
    clinic: mockClinicInfo
  }
};

export const mockScanData_Periodontal: ScanBindData = {
  type: 'treatment-bind',
  version: '1.0',
  data: {
    treatmentId: 'treat_per_003',
    patientName: '王秀兰',
    patientAge: 68,
    treatmentType: 'periodontal',
    treatmentDate: '2026-06-20',
    doctorName: '刘医生',
    clinicName: '康美口腔诊所',
    teethPosition: '下前牙区',
    expectedRecoveryDays: 14,
    returnVisitDate: '2026-06-27',
    clinic: mockClinicInfo
  }
};

// 家属邀请信息
export const generateFamilyInvite = (treatment: TreatmentInfo): FamilyInvite => {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    treatmentId: treatment.id,
    patientName: treatment.patientName,
    inviteCode,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=family_${treatment.id}_${inviteCode}`,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
};

// 诊所待处理任务
export const mockClinicTasks: ClinicTask[] = [];

// 订阅消息模板
export const SUBSCRIPTION_TEMPLATES = [
  {
    id: 'postop_reminder',
    title: '术后每日提醒',
    desc: '术后每天关键时间点的护理提醒',
    tmplId: 'tmpl_postop_001'
  },
  {
    id: 'return_visit',
    title: '复诊提醒',
    desc: '提前一天提醒您回诊所复查',
    tmplId: 'tmpl_return_001'
  },
  {
    id: 'medication',
    title: '服药提醒',
    desc: '提醒您按时吃药',
    tmplId: 'tmpl_med_001'
  }
];
