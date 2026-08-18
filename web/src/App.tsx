// App.tsx
import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import '@radix-ui/colors/slate-dark.css';
import '@radix-ui/colors/indigo-dark.css';
import '@radix-ui/colors/crimson-dark.css';
import '@radix-ui/colors/amber-dark.css';

import { OverviewPage } from './pages/OverviewPage';
import { ChatPage } from './pages/ChatPage';
import { CitizensPage } from './pages/ProfilesPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { ChargesPage } from './pages/ChargesPage';
import type { UserProfile } from './types';
import { hasPermission, setRoles } from './roles';
import { fetchNui } from './utils/fetchNui';

const isFiveM = typeof (window as any).GetParentResourceName === 'function';

interface TabItem {
    id: string;
    title: string;
    category: string;
}

export const App = () => {
    const [visible, setVisible] = useState(!isFiveM);
    const [activeCategory, setActiveCategory] = useState<string>('overview');

    const [currentUser] = useState<UserProfile>({
        identifier: 'char_1042',
        name: 'Roman Castillo',
        callsign: '#10-06',
        job_grade: 10,
        mdt_active: true,
    });


    const [tabs, setTabs] = useState<TabItem[]>([
        { id: 'overview-main', title: 'Forside', category: 'overview' }
    ]);
    const [activeTabId, setActiveTabId] = useState<string>('overview-main');

    useEffect(() => {
        fetchNui('getRoles').catch(() => console.log('Mock: getRoles'));

        const handleMessage = (event: MessageEvent) => {
            const { action, data } = event.data;
            if (action === 'setVisible') setVisible(data);
            if (action === 'rolesData') setRoles(data);
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const openTab = (id: string, title: string, category: string) => {
        if (category === 'chat' && !hasPermission(currentUser.job_grade, 'view_interchat')) return;
        if (category === 'profiles' && !hasPermission(currentUser.job_grade, 'manage_profiles')) return;
        if (category === 'vehicles' && !hasPermission(currentUser.job_grade, 'manage_vehicles')) return;
        if (category === 'charges' && !hasPermission(currentUser.job_grade, 'manage_charges')) return;

        if (!tabs.some(tab => tab.id === id)) {
            setTabs([...tabs, { id, title, category }]);
        }
        setActiveTabId(id);
        setActiveCategory(category);
    };

    const createNewTab = () => {
        const newId = `custom-tab-${Date.now()}`;
        const newTitle = `Forside ${tabs.length + 1}`;
        setTabs([...tabs, { id: newId, title: newTitle, category: 'overview' }]);
        setActiveTabId(newId);
        setActiveCategory('overview');
    };

    const resetCurrentTabToOverview = () => {
        setTabs(tabs.map(tab => {
            if (tab.id === activeTabId) {
                return { ...tab, title: 'Forside', category: 'overview' };
            }
            return tab;
        }));
        setActiveCategory('overview');
    };

    const closeTab = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newTabs = tabs.filter(tab => tab.id !== id);
        if (newTabs.length === 0) return;

        setTabs(newTabs);
        if (activeTabId === id) {
            const lastTab = newTabs[newTabs.length - 1];
            setActiveTabId(lastTab.id);
            setActiveCategory(lastTab.category);
        }
    };

    const renderPageContent = (category: string) => {
        switch (category) {
            case 'overview':
                return <OverviewPage currentUser={currentUser} />;
            case 'chat':
                return <ChatPage currentUser={currentUser} />;
            case 'profiles':
                return <CitizensPage currentUser={currentUser} />;
            case 'vehicles':
                return <VehiclesPage currentUser={currentUser} />;
            case 'charges':
                return <ChargesPage currentUser={currentUser} />;
            default:
                return <OverviewPage currentUser={currentUser} />;
        }
    };

    if (!visible) {
        return (
            <div className="dark" style={{ background: '#09090b', color: 'var(--slate-12)', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
                <div style={{ background: 'var(--slate-2)', border: '1px solid var(--slate-6)', padding: '32px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--indigo-4)', border: '1px solid var(--indigo-6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: 'var(--indigo-11)', fontSize: '20px' }}></i>
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Browser Development Mode</h2>
                    <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--slate-11)' }}>Viser MDT</p>
                    <button
                        onClick={() => setVisible(true)}
                        style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'background 0.15s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#4f46e5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#6366f1'}
                    >
                        Åben Tablet.
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="dark"
            style={{
                display: 'flex',
                width: '1420px',
                height: '840px',
                background: 'var(--slate-1)',
                color: 'var(--slate-12)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '8px',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                border: '1px solid var(--slate-6)',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
            }}
        >
            <style>{`
              .mdt-scrollbar::-webkit-scrollbar {
                  width: 6px;
                  height: 6px;
              }
              .mdt-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
              }
              .mdt-scrollbar::-webkit-scrollbar-thumb {
                  background: var(--slate-6);
                  border-radius: 4px;
              }
              .mdt-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: var(--slate-7);
              }
              .nav-btn {
                  transition: background 0.15s;
              }
              .nav-btn:hover {
                  background: var(--slate-4) !important;
                  color: var(--slate-12) !important;
              }
              .icon-btn {
                  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .icon-btn:hover {
                  background: var(--slate-4) !important;
              }
              .tab-trigger {
                  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .tab-trigger:hover:not([data-state="active"]) {
                  background: var(--slate-3) !important;
              }
          `}</style>

            {/* UNIFIED LEFT SIDEBAR */}
            <div style={{ width: '240px', background: 'var(--slate-2)', borderRight: '1px solid var(--slate-6)', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10 }}>

                <div style={{ height: '56px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--slate-6)' }}>
                    <div style={{ background: 'var(--indigo-4)', border: '1px solid var(--indigo-6)', width: '30px', height: '30px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: '#818cf8', fontSize: '13px' }}></i>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: '1.2' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f4f4f5', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>MDT</span>
                        <span style={{ fontSize: '10px', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Los Santos Politi</span>
                    </div>
                </div>

                <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>

                    <button
                        className="nav-btn"
                        onClick={() => openTab('overview-main', 'Forside', 'overview')}
                        style={{
                            textAlign: 'left', padding: '10px 12px',
                            background: activeCategory === 'overview' ? 'var(--indigo-4)' : 'transparent',
                            color: activeCategory === 'overview' ? 'var(--indigo-11)' : 'var(--slate-11)',
                            border: '1px solid transparent',
                            borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <i className="fa-solid fa-house" style={{ width: '14px', fontSize: '12px' }}></i> Forside
                    </button>

                    {hasPermission(currentUser.job_grade, 'view_interchat') && (
                        <button
                            className="nav-btn"
                            onClick={() => openTab('chat-tab', 'Intern chat', 'chat')}
                            style={{
                                textAlign: 'left', padding: '10px 12px',
                                background: activeCategory === 'chat' ? 'var(--indigo-4)' : 'transparent',
                                color: activeCategory === 'chat' ? 'var(--indigo-11)' : 'var(--slate-11)',
                                border: '1px solid transparent',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            <i className="fa-solid fa-comments" style={{ width: '14px', fontSize: '12px' }}></i> Intern chat
                        </button>
                    )}

                    {hasPermission(currentUser.job_grade, 'manage_profiles') && (
                        <button
                            className="nav-btn"
                            onClick={() => openTab('profiles-tab', 'Profiler', 'profiles')}
                            style={{
                                textAlign: 'left', padding: '10px 12px',
                                background: activeCategory === 'profiles' ? 'var(--indigo-4)' : 'transparent',
                                color: activeCategory === 'profiles' ? 'var(--indigo-11)' : 'var(--slate-11)',
                                border: '1px solid transparent',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            <i className="fa-solid fa-user" style={{ width: '14px', fontSize: '12px' }}></i> Profiler
                        </button>
                    )}

                    {hasPermission(currentUser.job_grade, 'manage_vehicles') && (
                        <button
                            className="nav-btn"
                            onClick={() => openTab('vehicles-tab', 'Køretøjsregister', 'vehicles')}
                            style={{
                                textAlign: 'left', padding: '10px 12px',
                                background: activeCategory === 'vehicles' ? 'var(--indigo-4)' : 'transparent',
                                color: activeCategory === 'vehicles' ? 'var(--indigo-11)' : 'var(--slate-11)',
                                border: '1px solid transparent',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            <i className="fa-solid fa-car" style={{ width: '14px', fontSize: '12px' }}></i> Køretøjsregister
                        </button>
                    )}

                    {hasPermission(currentUser.job_grade, 'manage_charges') && (
                        <button
                            className="nav-btn"
                            onClick={() => openTab('charges-tab', 'Sigtelser', 'charges')}
                            style={{
                                textAlign: 'left', padding: '10px 12px',
                                background: activeCategory === 'charges' ? 'var(--indigo-4)' : 'transparent',
                                color: activeCategory === 'charges' ? 'var(--indigo-11)' : 'var(--slate-11)',
                                border: '1px solid transparent',
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px'
                            }}
                        >
                            <i className="fa-solid fa-clipboard-list" style={{ width: '14px', fontSize: '12px' }}></i> Sigtelser
                        </button>
                    )}
                </div>

                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--slate-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
                    <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 500 }}>Encrypted Connection</span>
                </div>
            </div>

            {/* RIGHT WORKSPACE AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'transparent' }}>

                {/* TOP BAR */}
                <div style={{ height: '56px', background: 'var(--slate-1)', borderBottom: '1px solid var(--slate-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0, zIndex: 10 }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '100%', overflowX: 'auto' }} className="mdt-scrollbar">
                        <button
                            className="icon-btn"
                            onClick={resetCurrentTabToOverview}
                            title="Reset current tab to overview"
                            style={{
                                width: '32px', height: '32px', background: 'transparent', border: '1px solid transparent',
                                color: '#a1a1aa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', fontSize: '12px', flexShrink: 0, boxShadow: 'none'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--slate-12)'; e.currentTarget.style.background = 'var(--slate-4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--slate-11)'; e.currentTarget.style.background = 'var(--slate-3)'; }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>

                        <Tabs.Root
                            value={activeTabId}
                            onValueChange={(val) => {
                                setActiveTabId(val);
                                const found = tabs.find(t => t.id === val);
                                if (found) setActiveCategory(found.category);
                            }}
                            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
                        >
                            <Tabs.List style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '100%', background: 'transparent', border: 'none' }}>
                                {tabs.map(tab => {
                                    const isActive = tab.id === activeTabId;
                                    return (
                                        <Tabs.Trigger
                                            key={tab.id}
                                            value={tab.id}
                                            className="tab-trigger"
                                            style={{
                                                padding: '0 14px',
                                                height: '34px',
                                                background: isActive ? 'var(--slate-4)' : 'transparent',
                                                color: isActive ? 'var(--slate-12)' : 'var(--slate-11)',
                                                border: '1px solid transparent',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '12px',
                                                fontWeight: isActive ? 600 : 500,
                                                flexShrink: 0,
                                                boxShadow: 'none'
                                            }}
                                        >
                                            <span>{tab.title}</span>
                                            {tabs.length > 1 && (
                                                <span
                                                    onClick={(e) => closeTab(e, tab.id)}
                                                    style={{
                                                        fontSize: '11px',
                                                        width: '18px',
                                                        height: '18px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '4px',
                                                        color: '#a1a1aa',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-5)'; e.currentTarget.style.color = 'var(--slate-12)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </span>
                                            )}
                                        </Tabs.Trigger>
                                    );
                                })}
                            </Tabs.List>
                        </Tabs.Root>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <button
                            className="icon-btn"
                            onClick={createNewTab}
                            title="Create new tab"
                            style={{
                                width: '32px', height: '32px', background: 'var(--slate-3)', border: '1px solid var(--slate-6)',
                                borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-12)',
                                cursor: 'pointer', fontSize: '12px', boxShadow: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-4)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--slate-3)'}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>

                        <div style={{ width: '1px', height: '20px', background: 'var(--slate-6)' }}></div>

                        <div style={{ fontSize: '11px', color: 'var(--indigo-11)', background: 'var(--indigo-4)', border: '1px solid var(--indigo-6)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.3px' }}>
                            {currentUser.callsign}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--slate-3)', border: '1px solid var(--slate-6)', padding: '4px 10px 4px 6px', borderRadius: '4px' }}>
                            <div style={{ width: '22px', height: '22px', background: '#6366f1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                                {currentUser.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#f4f4f5' }}>{currentUser.name}</span>
                        </div>
                    </div>
                </div>

                {/* CONTENT CONTAINER */}
                <div className="mdt-scrollbar" style={{ flex: 1, background: 'var(--slate-1)', padding: '24px', overflowY: 'auto' }}>
                    {renderPageContent(activeCategory)}
                </div>

            </div>
        </div>
    );
};

export default App;