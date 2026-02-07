
import React, { useState, useEffect } from 'react';
import { AppState, ContentItem } from './types';
import { AccessGate } from './components/AccessGate';
import { AdminPanel } from './components/AdminPanel';
import { GirlfriendDashboard } from './components/GirlfriendDashboard';
import { OwnerLogin } from './components/OwnerLogin';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [content, setContent] = useState<ContentItem[]>([]);

  // Persist content to local storage
  useEffect(() => {
    const saved = localStorage.getItem('valentine_sanctuary_content');
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved content");
      }
    }
  }, []);

  const saveContent = (newContent: ContentItem[]) => {
    setContent(newContent);
    localStorage.setItem('valentine_sanctuary_content', JSON.stringify(newContent));
  };

  const handleGirlfriendAccess = (key: string) => {
    if (key === '51825') {
      setAppState(AppState.GIRLFRIEND_DASHBOARD);
    }
  };

  const handleAdminRequest = () => {
    setAppState(AppState.OWNER_LOGIN);
  };

  const handleAdminLogin = (code: string) => {
    if (code === '093009') {
      setAppState(AppState.OWNER_ADMIN);
      return true;
    }
    return false;
  };

  const addContent = (item: ContentItem) => {
    const newContent = [item, ...content];
    saveContent(newContent);
  };

  const deleteContent = (id: string) => {
    const newContent = content.filter(item => item.id !== id);
    saveContent(newContent);
  };

  const logout = () => {
    setAppState(AppState.LOCKED);
  };

  return (
    <div className="min-h-screen bg-pink-50 selection:bg-pink-200 selection:text-pink-900">
      {appState === AppState.LOCKED && (
        <AccessGate 
          onAccess={handleGirlfriendAccess} 
          onAdminRequest={handleAdminRequest}
        />
      )}

      {appState === AppState.OWNER_LOGIN && (
        <OwnerLogin 
          onLogin={handleAdminLogin}
          onBack={logout}
        />
      )}

      {appState === AppState.GIRLFRIEND_DASHBOARD && (
        <GirlfriendDashboard 
          content={content} 
          onLogout={logout}
        />
      )}

      {appState === AppState.OWNER_ADMIN && (
        <AdminPanel 
          content={content}
          onAddContent={addContent} 
          onDelete={deleteContent}
          onLogout={logout} 
        />
      )}
    </div>
  );
};

export default App;
