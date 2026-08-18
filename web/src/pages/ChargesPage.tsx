// Pages/ChargesPage.tsx
import React from 'react';
import type { PageProps } from '../types';

export const ChargesPage: React.FC<PageProps> = ({ currentUser }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0' }}>Sigtelser</h2>
                <p style={{ color: 'var(--slate-11, #94949e)', fontSize: '13px', margin: 0 }}>Penal code and standard sentencing guidelines.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', padding: '24px', transition: 'none' }}
                     
                     >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--slate-12)' }}>Armed Robbery</h4>
                        <span style={{ fontSize: '12px', color: 'var(--crimson-9)', fontWeight: 600, background: 'var(--crimson-4)', padding: '4px 10px', borderRadius: '4px' }}>$10,000 / 50 Mo.</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--slate-11)', lineHeight: '1.5' }}>Robbery or attempted robbery committed using a lethal firearm or bludgeon weapon.</p>
                </div>
                <div style={{ background: 'var(--slate-3)', border: '1px solid var(--slate-6)', borderRadius: '6px', padding: '24px', transition: 'none' }}
                     
                     >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--slate-12)' }}>Assault on LEO</h4>
                        <span style={{ fontSize: '12px', color: 'var(--crimson-9)', fontWeight: 600, background: 'var(--crimson-4)', padding: '4px 10px', borderRadius: '4px' }}>$7,500 / 35 Mo.</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--slate-11)', lineHeight: '1.5' }}>Physical assault or battery directed towards a licensed law enforcement officer on duty.</p>
                </div>
            </div>
        </div>
    );
};