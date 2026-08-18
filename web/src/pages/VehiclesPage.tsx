// Pages/VehiclesPage.tsx
import React from 'react';
import type { PageProps } from '../types';

export const VehiclesPage: React.FC<PageProps> = ({ currentUser }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0' }}>Køretøjsregister</h2>
                <p style={{ color: 'var(--slate-11, #94949e)', fontSize: '13px', margin: 0 }}>Vehicle registration and plate lookup logs.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Search by license plate or model..."
                    style={{ flex: 1, background: 'var(--slate-2)', border: '1px solid var(--slate-6)', borderRadius: '4px', padding: '10px 14px', color: 'var(--slate-12)', fontSize: '13px', outline: 'none', transition: 'none' }}
                    
                    
                />
                <button style={{ background: 'var(--slate-4)', border: '1px solid var(--slate-6)', color: 'var(--slate-12)', borderRadius: '4px', padding: '0 20px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', transition: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-5)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--slate-4)'}
                >
                    Lookup
                </button>
            </div>
            <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 1fr', padding: '14px 20px', background: 'var(--slate-4)', fontSize: '12px', fontWeight: 600, color: 'var(--slate-11)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <span>License Plate</span>
                    <span>Model</span>
                    <span>Owner</span>
                    <span>Status</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 1fr', padding: '16px 20px', borderTop: '1px solid var(--slate-6)', alignItems: 'center', fontSize: '13px', transition: 'background 0.2s' }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slate-5)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontWeight: 600, color: 'var(--slate-12)' }}>34XYZ789</span>
                    <span style={{ color: 'var(--slate-11)' }}>Sultan RS</span>
                    <span style={{ color: 'var(--slate-12)', fontWeight: 500 }}>Marcus Vance</span>
                    <span style={{ color: 'var(--amber-9)', fontWeight: 600, background: 'var(--amber-4)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>BOLO Alert</span>
                </div>
            </div>
        </div>
    );
};