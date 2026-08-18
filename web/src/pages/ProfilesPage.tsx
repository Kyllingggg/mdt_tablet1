// Pages/CitizensPage.tsx
import React, { useState } from 'react';
import type { PageProps } from '../types';

interface Citizen {
    id: string;
    name: string;
    citizenId: string;
    gender: string;
    birthDate: string;
    phone: string;
    avatarUrl: string;
    fingerprint: string;
    dnaProfile: string;
    warrants: string;
    status: string;
    tags: string[];
    vehicles: string[];
    properties: string[];
    criminalHistory: string[];
    licenses: string[];
    activePoints: number;
    notes: string;
}

const INITIAL_CITIZENS: Citizen[] = [
    {
        id: '1',
        name: 'Marcus Vance',
        citizenId: '#883921',
        gender: 'Mand',
        birthDate: '14/05/1992',
        phone: '555-0192',
        avatarUrl: '',
        fingerprint: 'FP-994821',
        dnaProfile: 'DNA-883921-X',
        warrants: '2 Active',
        status: 'Wanted',
        tags: ['Bevæbnet', 'Flugtbilist'],
        vehicles: ['Sultan RS (Nummerplade: 34XYZ89)', 'Bravado Banshee (Nummerplade: 12ABC34)'],
        properties: ['Vinewood Hills Lejlighed 4B'],
        criminalHistory: ['Røveri af særlig grov beskaffenhed (12/01/2025)', 'Flugt fra politiet (03/03/2026)'],
        licenses: ['Kørekort', 'Våbentilladelse (Udløbet)'],
        activePoints: 3,
        notes: 'Mistænkes for lederrolle i lokale narkoringe. Udvis ekstrem forsigtighed ved kontakt.'
    },
    {
        id: '2',
        name: 'Jessica Taylor',
        citizenId: '#441209',
        gender: 'Kvinde',
        birthDate: '22/11/1998',
        phone: '555-8491',
        avatarUrl: '',
        fingerprint: 'FP-114209',
        dnaProfile: 'DNA-441209-A',
        warrants: 'None',
        status: 'Clean',
        tags: ['Lovlydig'],
        vehicles: ['Karin Dilettante (Nummerplade: 99DEF67)'],
        properties: ['Rockford Hills Hus 12'],
        criminalHistory: [],
        licenses: ['Kørekort'],
        activePoints: 0,
        notes: 'Ingen tidligere bemærkninger i registret.'
    }
];

export const CitizensPage: React.FC<PageProps> = ({ currentUser }) => {
    const [citizens, setCitizens] = useState<Citizen[]>(INITIAL_CITIZENS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

    const filteredCitizens = citizens.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.citizenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.fingerprint.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFieldChange = (field: keyof Citizen, value: any) => {
        if (!selectedCitizen) return;
        setSelectedCitizen({
            ...selectedCitizen,
            [field]: value
        });
    };

    const handleSaveProfile = () => {
        if (!selectedCitizen) return;
        setCitizens(citizens.map(c => c.id === selectedCitizen.id ? selectedCitizen : c));
        setSelectedCitizen(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', position: 'relative' }}>
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--slate-12)' }}>Citizens</h2>
                <p style={{ color: 'var(--slate-11, #94949e)', fontSize: '13px', margin: 0 }}>Citizen criminal records and identification directory.</p>
            </div>

            {/* Search & Action Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, citizen ID or fingerprint..."
                    style={{ flex: 1, background: 'var(--slate-2)', border: '1px solid var(--slate-6)', borderRadius: '4px', padding: '10px 14px', color: 'var(--slate-12)', fontSize: '13px', outline: 'none' }}
                />
                <button
                    style={{ background: 'var(--slate-4)', border: '1px solid var(--slate-6)', color: 'var(--slate-12)', borderRadius: '4px', padding: '0 20px', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}
                >
                    Search
                </button>
                <button
                    onClick={() => {
                        const newCitizen: Citizen = {
                            id: Date.now().toString(),
                            name: 'Ny Borger',
                            citizenId: `#${Math.floor(100000 + Math.random() * 900000)}`,
                            gender: '',
                            birthDate: '',
                            phone: '',
                            avatarUrl: '',
                            fingerprint: `FP-${Math.floor(100000 + Math.random() * 900000)}`,
                            dnaProfile: `DNA-${Math.floor(100000 + Math.random() * 900000)}`,
                            warrants: 'None',
                            status: 'Clean',
                            tags: [],
                            vehicles: [],
                            properties: [],
                            criminalHistory: [],
                            licenses: [],
                            activePoints: 0,
                            notes: ''
                        };
                        setCitizens([newCitizen, ...citizens]);
                        setSelectedCitizen(newCitizen);
                    }}
                    style={{ background: '#10b981', border: 'none', color: 'white', borderRadius: '4px', padding: '0 20px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                >
                    View registry
                </button>
            </div>

            {/* Citizens List Table */}
            <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', overflow: 'hidden', flex: 1 }} className="mdt-scrollbar">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px', background: 'var(--slate-4)', fontSize: '12px', fontWeight: 600, color: 'var(--slate-11)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span>Name</span>
                    <span>Citizen ID</span>
                    <span>Warrants</span>
                    <span>Status</span>
                </div>
                {filteredCitizens.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-11)', fontSize: '13px' }}>Ingen borgere fundet.</div>
                ) : (
                    filteredCitizens.map((citizen) => (
                        <div
                            key={citizen.id}
                            onClick={() => setSelectedCitizen(citizen)}
                            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 20px', borderTop: '1px solid var(--slate-6)', alignItems: 'center', fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-5)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ fontWeight: 600, color: 'var(--slate-12)' }}>{citizen.name}</span>
                            <span style={{ color: 'var(--slate-11)' }}>{citizen.citizenId}</span>
                            <td>
                                <span style={{ color: citizen.warrants !== 'None' ? 'var(--crimson-9)' : 'var(--slate-11)', fontWeight: citizen.warrants !== 'None' ? 600 : 400, background: citizen.warrants !== 'None' ? 'var(--crimson-4)' : 'transparent', padding: citizen.warrants !== 'None' ? '4px 8px' : '0', borderRadius: '6px', width: 'fit-content', display: 'inline-block' }}>
                                    {citizen.warrants}
                                </span>
                            </td>
                            <span style={{ color: citizen.status === 'Wanted' ? 'var(--crimson-9)' : '#46a758', fontWeight: 500 }}>{citizen.status}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Citizen Detail Modal (Matching provided image layout) */}
            {selectedCitizen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
                    <div style={{ background: '#1e2025', border: '1px solid #2a2e39', borderRadius: '8px', width: '100%', maxWidth: '1280px', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>

                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#16181d', borderBottom: '1px solid #2a2e39' }}>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>{selectedCitizen.name} ({selectedCitizen.citizenId})</span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleSaveProfile}
                                    style={{ background: '#10b981', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                >
                                    Gem & Luk
                                </button>
                                <button
                                    onClick={() => setSelectedCitizen(null)}
                                    style={{ background: '#334155', border: 'none', color: '#f8fafc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Luk
                                </button>
                            </div>
                        </div>

                        {/* Modal Body Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.2fr', gap: '20px', padding: '24px', flex: 1, overflowY: 'auto' }} className="mdt-scrollbar">

                            {/* Column 1: Avatar & Notes Editor */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '6px', height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🙁</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>NOT FOUND</div>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#141619', border: '1px solid #2a2e39', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', background: '#1b1e24', borderBottom: '1px solid #2a2e39', padding: '8px 12px', gap: '8px' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: 600 }}>B</button>
                                        <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
                                        <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>•</button>
                                        <button style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>≡</button>
                                        <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '12px' }}>Paragraph</span>
                                    </div>
                                    <textarea
                                        value={selectedCitizen.notes}
                                        onChange={(e) => handleFieldChange('notes', e.target.value)}
                                        placeholder="Skriv noter om borgeren her..."
                                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#f8fafc', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Column 2: Detaljer */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detaljer</div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>NAVN</label>
                                        <input type="text" value={selectedCitizen.name} onChange={(e) => handleFieldChange('name', e.target.value)} style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>KØN</label>
                                        <input type="text" value={selectedCitizen.gender} onChange={(e) => handleFieldChange('gender', e.target.value)} style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>FØDSELSDATO</label>
                                        <input type="text" value={selectedCitizen.birthDate} onChange={(e) => handleFieldChange('birthDate', e.target.value)} style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>TELEFON</label>
                                        <input type="text" value={selectedCitizen.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>PROFILBILLEDE URL</label>
                                        <input type="text" value={selectedCitizen.avatarUrl} onChange={(e) => handleFieldChange('avatarUrl', e.target.value)} placeholder="https://..." style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>FINGERAFTRYK</label>
                                        <input type="text" value={selectedCitizen.fingerprint} onChange={(e) => handleFieldChange('fingerprint', e.target.value)} style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>DNA PROFIL</label>
                                        <input type="text" value={selectedCitizen.dnaProfile} onChange={(e) => handleFieldChange('dnaProfile', e.target.value)} style={{ background: '#141619', border: '1px solid #2a2e39', borderRadius: '4px', padding: '8px 12px', color: '#f8fafc', fontSize: '13px', outline: 'none' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Tags, Køretøjer, Ejendomme, Kriminalhistorik, Licenser, Aktive Klip */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* Tags */}
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TAGS</span>
                                        <button style={{ background: '#10b981', border: 'none', color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Håndtere</button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {selectedCitizen.tags.length === 0 ? (
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>Ingen tags</span>
                                        ) : (
                                            selectedCitizen.tags.map((tag, idx) => (
                                                <span key={idx} style={{ background: '#2a2e39', color: '#f8fafc', fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>{tag}</span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Køretøjer */}
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '12px 16px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>KØRETØJER</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {selectedCitizen.vehicles.length === 0 ? (
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>Ingen køretøjer registreret</span>
                                        ) : (
                                            selectedCitizen.vehicles.map((v, idx) => (
                                                <span key={idx} style={{ fontSize: '12px', color: '#cbd5e1' }}>{v}</span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Ejendomme */}
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '12px 16px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>EJENDOMME</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {selectedCitizen.properties.length === 0 ? (
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>Ingen ejendomme registreret</span>
                                        ) : (
                                            selectedCitizen.properties.map((p, idx) => (
                                                <span key={idx} style={{ fontSize: '12px', color: '#cbd5e1' }}>{p}</span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Kriminalhistorik */}
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '12px 16px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>KRIMINALHISTORIK</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {selectedCitizen.criminalHistory.length === 0 ? (
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>Ingen kriminalhistorik</span>
                                        ) : (
                                            selectedCitizen.criminalHistory.map((c, idx) => (
                                                <span key={idx} style={{ fontSize: '12px', color: '#fca5a5' }}>{c}</span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Licenser */}
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LICENSER</span>
                                        <button style={{ background: '#10b981', border: 'none', color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Håndtere</button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {selectedCitizen.licenses.length === 0 ? (
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>Ingen licenser</span>
                                        ) : (
                                            selectedCitizen.licenses.map((lic, idx) => (
                                                <span key={idx} style={{ background: '#2a2e39', color: '#f8fafc', fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>{lic}</span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Kørekort – Aktive klip */}
                                <div style={{ background: '#16181d', border: '1px solid #2a2e39', borderRadius: '6px', padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>KØREKORT – AKTIVE KLIP</span>
                                        <span style={{ fontSize: '11px', background: '#2a2e39', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{selectedCitizen.activePoints}/6</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#f8fafc', fontSize: '14px' }}>
                                            {selectedCitizen.activePoints}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', color: '#f8fafc', marginBottom: '4px' }}>
                                                {selectedCitizen.activePoints === 0 ? 'Ingen aktive klip' : `${selectedCitizen.activePoints} aktive klip registreret`}
                                            </div>
                                            <div style={{ width: '100%', height: '4px', background: '#2a2e39', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ width: `${(selectedCitizen.activePoints / 6) * 100}%`, height: '100%', background: '#10b981' }}></div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                                                <span>0</span>
                                                <span>Grænse: 6</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};