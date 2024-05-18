import React from 'react';
import ReactDOM from 'react-dom/client';  // 'client' をインポート
import App from './App';  // App コンポーネントをインポート
import './App.css';  // グローバルスタイルをインポート
import { ActiveProvider, GlobalIdProvider } from './ActiveContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
// createRoot を使用して root を作成


root.render(
  <React.StrictMode>
    <ActiveProvider>
      <GlobalIdProvider>
        <App />
      </GlobalIdProvider>
    </ActiveProvider>
  </React.StrictMode>
);
