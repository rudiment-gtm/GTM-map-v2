import React from 'react';
import { C } from '../theme.js';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'absolute', right: 20, bottom: 20, zIndex: 40,
      background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 10,
      padding: '11px 15px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 14px 34px rgba(0,0,0,.5)',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
      <span style={{ color: '#EDEDEA', fontSize: 12.5 }}>{message}</span>
    </div>
  );
}
