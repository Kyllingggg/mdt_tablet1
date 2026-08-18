// Pages/OverviewPage.tsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { PageProps, Officer, WantedItem, BoloItem, NewsItem } from '../types';
import { getRoleName } from '../roles';
import { fetchNui } from '../utils/fetchNui';

const ROLES_MAP: Record<number, string> = {
    10: 'Rigspolitichef',
    9: 'Politidirektør',
    8: 'Chefpolitiinspektør',
    7: 'Politiinspektør',
    6: 'Vicepolitiinspektør',
    5: 'Politikommissær',
    4: 'Politiassistent af 1. Grad',
    3: 'Politiassistent',
    2: 'Politibetjent',
    1: 'Politielev',
    0: 'Politikadet'
};

export const OverviewPage: React.FC<PageProps> = ({ currentUser }) => {

    const [officers, setOfficers] = useState<Officer[]>([]);
    const [wantedList, setWantedList] = useState<WantedItem[]>([]);
    const [boloList, setBoloList] = useState<BoloItem[]>([]);
    const [newsList, setNewsList] = useState<NewsItem[]>([]);

    useEffect(() => {
        fetchNui('getDashboardData').catch(() => console.log('Mock: getDashboardData'));

        const handleMessage = (event: MessageEvent) => {
            const { action, data } = event.data;
            if (action === 'dashboardData') {
                if (data.officers) setOfficers(data.officers);
                if (data.wantedList) setWantedList(data.wantedList);
                if (data.bolos) setBoloList(data.bolos);
                if (data.news) setNewsList(data.news);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const [isBoloOpen, setIsBoloOpen] = useState(false);
    const [isNewsOpen, setIsNewsOpen] = useState(false);

    const [boloTitle, setBoloTitle] = useState('');
    const [boloDetails, setBoloDetails] = useState('');

    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');

    const sortedGrades = Object.keys(ROLES_MAP)
        .map(Number)
        .sort((a, b) => b - a);

    const handleCreateBolo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!boloTitle.trim()) return;
        const newItem: BoloItem = {
            id: boloList.length + 1,
            title: boloTitle,
            details: boloDetails || 'No details provided',
            status: 'Active Watch',
            timestamp: Date.now()
        };
        setBoloList(prev => [newItem, ...prev]);
        setBoloTitle('');
        setBoloDetails('');
        setIsBoloOpen(false);
    };

    const handleCreateNews = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser.job_grade < 5) {
            alert('Access Denied: You do not have the required role permission (write_news) to post bulletins.');
            return;
        }
        if (!newsTitle.trim() || !newsContent.trim()) return;
        const newItem: NewsItem = {
            id: newsList.length + 1,
            title: newsTitle,
            content: newsContent,
            author: currentUser.name,
            required_grade: 5,
            timestamp: Date.now()
        };
        setNewsList(prev => [newItem, ...prev]);
        setNewsTitle('');
        setNewsContent('');
        setIsNewsOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%', fontFamily: 'inherit' }}>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--slate-6);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--slate-7);
                }

                @keyframes overlayShow {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(4px); }
                }
                @keyframes contentShow {
                    from { opacity: 0; transform: translate(-50%, -46%) scale(0.98); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                .dialog-overlay {
                    background-color: rgba(0, 0, 0, 0.5);
                    position: fixed;
                    inset: 0;
                    animation: overlayShow 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    z-index: 1000;
                }
                .dialog-content {
                    background: var(--slate-2);
                    border: 1px solid var(--slate-6);
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90vw;
                    max-width: 440px;
                    padding: 24px;
                    animation: contentShow 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    z-index: 1001;
                    color: var(--slate-12);
                }
                .dashboard-card {
                    background: var(--slate-2);
                    border: 1px solid var(--slate-6);
                    border-radius: 6px;
                    display: flex;
                    flex-direction: column;
                    height: 380px;
                    box-shadow: none;
                }
                .dashboard-card:hover {
                    border-color: var(--slate-7);
                }
                .action-button {
                    background: var(--slate-3);
                    border: 1px solid var(--slate-6);
                    color: var(--slate-12);
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s ease;
                }
                .action-button:hover {
                    background: var(--slate-4);
                    border-color: var(--slate-7);
                }
                .feed-item {
                    background: var(--slate-3);
                    border: 1px solid var(--slate-6);
                    border-radius: 6px;
                    padding: 12px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .feed-item:hover {
                    background: var(--slate-4);
                }
                .form-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: var(--slate-2);
                    border: 1px solid var(--slate-6);
                    border-radius: 4px;
                    color: var(--slate-12);
                    font-size: 13px;
                    box-sizing: border-box;
                    outline: none;
                    transition: border-color 0.15s ease;
                }
                .form-input:focus {
                    border-color: #6366f1;
                }
            `}</style>

            {/* SECTION 1: Columns Container for Wanted, BOLO, and News */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'stretch' }}>

                {/* Column 1: Wanted / Efterlysning */}
                <div className="dashboard-card" style={{ borderTop: '3px solid var(--crimson-9)' }}>
                    <div style={{ padding: '16px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--crimson-9)', fontSize: '13px' }}></i>
                            <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)', letterSpacing: '0.3px' }}>WANTED BOARD</h3>
                        </div>
                        <span style={{ fontSize: '10px', background: 'var(--crimson-4)', color: 'var(--crimson-11)', border: '1px solid var(--crimson-6)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Efterlysning
                        </span>
                    </div>

                    <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flexGrow: 1, padding: '14px' }}>
                        {[...wantedList]
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map(item => (
                                <div key={item.id} className="feed-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--crimson-11)' }}>{item.id}</span>
                                        <span style={{ color: 'var(--slate-11)' }}>Priority: <strong style={{ color: 'var(--slate-12)' }}>{item.priority}</strong></span>
                                    </div>
                                    <h4 style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)' }}>{item.title}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--slate-11)', lineHeight: '1.4' }}>{item.description}</p>
                                    <div style={{ fontSize: '11px', color: 'var(--slate-11)', borderTop: '1px solid var(--slate-6)', paddingTop: '6px', marginTop: '2px' }}>
                                        Issued by {item.issuer}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Column 2: BOLO Channel */}
                <div className="dashboard-card" style={{ borderTop: '3px solid var(--amber-9)' }}>
                    <div style={{ padding: '16px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-car-burst" style={{ color: 'var(--amber-11)', fontSize: '13px' }}></i>
                            <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)', letterSpacing: '0.3px' }}>BOLO CHANNEL</h3>
                        </div>

                        <Dialog.Root open={isBoloOpen} onOpenChange={setIsBoloOpen}>
                            <Dialog.Trigger asChild>
                                <button className="action-button" title="Add BOLO Entry">
                                    <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                </button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="dialog-overlay" />
                                <Dialog.Content className="dialog-content">
                                    <Dialog.Title style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>Create BOLO Alert</Dialog.Title>
                                    <Dialog.Description style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'var(--slate-11)' }}>
                                        Broadcast a vehicle or suspect description to active channels.
                                    </Dialog.Description>
                                    <form onSubmit={handleCreateBolo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: 500, color: '#d4d4d8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vehicle / Subject Title</label>
                                            <input
                                                type="text"
                                                value={boloTitle}
                                                onChange={e => setBoloTitle(e.target.value)}
                                                placeholder="e.g. Black Sultan RS"
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: 500, color: '#d4d4d8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Details / Last Seen</label>
                                            <textarea
                                                value={boloDetails}
                                                onChange={e => setBoloDetails(e.target.value)}
                                                placeholder="License plate, direction, suspect details..."
                                                rows={3}
                                                className="form-input"
                                                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                                            <Dialog.Close asChild>
                                                <button type="button" style={{ background: 'transparent', border: '1px solid var(--slate-6)', color: 'var(--slate-11)', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                                            </Dialog.Close>
                                            <button type="submit" style={{ background: '#f59e0b', border: 'none', color: '#18181b', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Post BOLO</button>
                                        </div>
                                    </form>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>

                    <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flexGrow: 1, padding: '14px' }}>
                        {[...boloList]
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map(item => (
                                <div key={item.id} className="feed-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--amber-9)' }}>{item.id}</span>
                                        <span style={{ color: 'var(--slate-11)' }}>Status: <strong style={{ color: 'var(--slate-12)' }}>{item.status}</strong></span>
                                    </div>
                                    <h4 style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)' }}>{item.title}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--slate-11)', lineHeight: '1.4' }}>{item.details}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Column 3: News & Bulletins */}
                <div className="dashboard-card" style={{ borderTop: '3px solid var(--indigo-9)' }}>
                    <div style={{ padding: '16px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-6)' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-bullhorn" style={{ color: 'var(--indigo-11)', fontSize: '13px' }}></i>
                                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)', letterSpacing: '0.3px' }}>NEWS & BULLETINS</h3>
                            </div>
                        </div>

                        <Dialog.Root open={isNewsOpen} onOpenChange={setIsNewsOpen}>
                            <Dialog.Trigger asChild>
                                <button className="action-button" title="Post News">
                                    <i className="fa-solid fa-plus" style={{ fontSize: '11px' }}></i>
                                </button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="dialog-overlay" />
                                <Dialog.Content className="dialog-content">
                                    <Dialog.Title style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>Post Bulletin / News</Dialog.Title>
                                    <Dialog.Description style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'var(--slate-11)' }}>
                                        Create a departmental broadcast. Requires <code style={{ color: 'var(--indigo-11)' }}>write_news</code> permission.
                                    </Dialog.Description>
                                    <form onSubmit={handleCreateNews} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: 500, color: '#d4d4d8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Headline</label>
                                            <input
                                                type="text"
                                                value={newsTitle}
                                                onChange={e => setNewsTitle(e.target.value)}
                                                placeholder="e.g. New Radio Protocols"
                                                required
                                                className="form-input"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: 500, color: '#d4d4d8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message Content</label>
                                            <textarea
                                                value={newsContent}
                                                onChange={e => setNewsContent(e.target.value)}
                                                placeholder="Write announcement details..."
                                                rows={3}
                                                required
                                                className="form-input"
                                                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                                            <Dialog.Close asChild>
                                                <button type="button" style={{ background: 'transparent', border: '1px solid var(--slate-6)', color: 'var(--slate-11)', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                                            </Dialog.Close>
                                            <button type="submit" style={{ background: 'var(--indigo-9)', border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Publish News</button>
                                        </div>
                                    </form>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>

                    <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flexGrow: 1, padding: '14px' }}>
                        {[...newsList]
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map(item => (
                                <div key={item.id} className="feed-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--indigo-11)' }}>{item.id}</span>
                                    </div>
                                    <h4 style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)' }}>{item.title}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--slate-11)', lineHeight: '1.4' }}>{item.content}</p>
                                    <div style={{ fontSize: '11px', color: 'var(--slate-11)', borderTop: '1px solid var(--slate-6)', paddingTop: '6px', marginTop: '2px' }}>
                                        Author: {item.author}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

            </div>

            {/* SECTION 2: Active Roll-Call by Role */}
            <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexShrink: 0 }}>
                    <i className="fa-solid fa-users-line" style={{ color: 'var(--indigo-11)', fontSize: '14px' }}></i>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate-12)', margin: 0, letterSpacing: '0.3px' }}>
                        ACTIVE ROLL-CALL BY ROLE
                    </h3>
                </div>

                <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                    {sortedGrades.map(grade => {
                        const gradeLabel = ROLES_MAP[grade];
                        const matchedOfficers = officers.filter(o => o.job_grade === grade);

                        return (
                            <div key={grade} style={{ display: 'grid', gridTemplateColumns: '240px 1fr', alignItems: 'center', background: 'var(--slate-4)', border: '1px solid var(--slate-6)', borderRadius: '6px', padding: '10px 16px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-12)' }}>{gradeLabel}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {matchedOfficers.length > 0 ? (
                                        matchedOfficers.map(officer => (
                                            <div key={officer.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--slate-3)', border: '1px solid var(--slate-6)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: 'var(--slate-12)' }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--indigo-9)' }}></span>
                                                <span style={{ fontWeight: 500 }}>{officer.name}</span>
                                                <span style={{ color: 'var(--slate-11)' }}>({officer.id})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '11px', color: 'var(--slate-11)', fontStyle: 'italic' }}>No active personnel</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};