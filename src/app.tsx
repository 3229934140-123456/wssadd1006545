import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AppProvider } from '@/store/AppContext';
import './app.scss';

function App(props: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[App] 小程序启动');
  }, []);

  useDidShow(() => {
    console.log('[App] onShow - 页面显示');
  });

  useDidHide(() => {
    console.log('[App] onHide - 页面隐藏');
  });

  return <AppProvider>{props.children}</AppProvider>;
}

export default App;
