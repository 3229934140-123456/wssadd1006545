export default defineAppConfig({
  pages: [
    'pages/reminders/index',
    'pages/symptoms/index',
    'pages/contact/index',
    'pages/clinic-tasks/index',
    'pages/feedback-detail/index',
    'pages/discomfort-form/index',
    'pages/family-invite/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '口腔术后关怀',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5FAF7'
  },
  tabBar: {
    color: '#8A9AA3',
    selectedColor: '#2CB67D',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/reminders/index',
        text: '今日提醒'
      },
      {
        pagePath: 'pages/symptoms/index',
        text: '症状反馈'
      },
      {
        pagePath: 'pages/contact/index',
        text: '联系诊所'
      },
      {
        pagePath: 'pages/clinic-tasks/index',
        text: '诊所回访'
      }
    ]
  }
})
