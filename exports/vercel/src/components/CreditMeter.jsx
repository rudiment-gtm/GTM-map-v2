import React from 'react';
import { C, mono } from '../theme.js';

export default function CreditMeter({ credits, monthly }) {
  const pct = Math.max(0, Math.min(100, (credits / monthly) * 100));
  return (
    <div style={{
      margin: '12px 14px', background: C.card, border: '1px solid ' + C.border,
      borderRadius: 10, padding: '11px 12px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.1em' }}>CREDITS</div>
        <div style={{ color: '#EDEDEA', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>
          {credits.toLocaleString()} <span style={{ color: C.textMute }}>/ {monthly.toLocaleString()}</span>
        </div>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: pct < 10 ? C.warn : C.green, borderRadius: 999, transition: 'width .35s ease' }} />
      </div>
      <div style={{ color: C.textMute, fontSize: 10.5 }}>Standard plan - resets Aug 1</div>
    </div>
  );
}
