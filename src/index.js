import React from 'react';
import ReactDOM from 'react-dom/client';  // 'client' をインポート
import App from './App';  // App コンポーネントをインポート
import './App.css';  // グローバルスタイルをインポート
import { ActiveProvider, GlobalIdProvider, UseHoveredProvider, PortalClickedProvider } from './ActiveContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
// createRoot を使用して root を作成


root.render(
  <React.StrictMode>
    <ActiveProvider>
      <GlobalIdProvider>
        <UseHoveredProvider>
          <PortalClickedProvider>
            <App />
          </PortalClickedProvider>
        </UseHoveredProvider>
      </GlobalIdProvider>
    </ActiveProvider>
  </React.StrictMode>
);
