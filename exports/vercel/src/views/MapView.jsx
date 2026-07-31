import React from 'react';
import { C } from '../theme.js';

export default function MapView({ active, showing, pinned, clearPinned, mapSearch, setMapSearch, onSync, onSurrounding, onAsk }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      visibility: active ? 'visible' : 'hidden',
      pointerEvents: active ? 'auto' : 'none',
    }}>
      {/* Swap this static image for the live Mapbox canvas. Keep the node mounted across tabs. */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/map-canvas.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: pinned ? 'rgba(11,11,13,.22)' : 'transparent', transition: 'background .3s ease', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 46, background: C.surface, borderBottom: '1px solid ' + C.line, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <div style={{ flex: 1, maxWidth: 380, display: 'flex', alignItems: 'center', gap: 8, background: C.card, border: '1px solid ' + C.border, borderRadius: 8, padding: '6px 11px' }}>
          <span style={{ color: C.textMute, fontSize: 12 }}>&#8981;</span>
          <input
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            placeholder="Search accounts..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#EDEDEA', fontSize: 12.5 }}
          />
        </div>
        <div style={{ flex: 1 }} />
        <div onClick={onSync} style={{ display: 'flex', alignItems: 'center', gap: 7, background: C.card, border: '1px solid ' + C.border, borderRadius: 8, padding: '6px 11px', color: C.textBody, fontSize: 12, cursor: 'pointer' }}>
          &#8635; Sync from Clay
        </div>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#1F6F45', color: '#DFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>RC</div>
      </div>

      {pinned && (
        <div style={{ position: 'absolute', top: 62, left: 16, background: 'rgba(15,16,18,.93)', border: '1px solid ' + C.borderStrong, borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(6px)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }} />
          <span style={{ color: '#EDEDEA', fontSize: 12.5 }}>{pinned}</span>
          <span onClick={clearPinned} style={{ color: C.textDim, fontSize: 12, cursor: 'pointer' }}>x</span>
        </div>
      )}

      <div style={{ position: 'absolute', top: 62, right: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['\u25C8', '\u2630'].map((glyph) => (
          <div key={glyph} style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(15,16,18,.93)', border: '1px solid ' + C.borderStrong, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9C8C4', fontSize: 14, cursor: 'pointer' }}>{glyph}</div>
        ))}
        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.greenText, fontSize: 16, cursor: 'pointer' }}>+</div>
      </div>

      <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div onClick={onSurrounding} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15,16,18,.93)', border: '1px solid ' + C.borderStrong, borderRadius: 9, padding: '9px 13px', color: C.textBody, fontSize: 12.5, cursor: 'pointer', backdropFilter: 'blur(6px)' }}>
          &#9678; Find surrounding businesses
        </div>
        <div onClick={onAsk} style={{ background: 'rgba(15,16,18,.93)', border: '1px solid ' + C.borderStrong, borderRadius: 9, padding: '9px 13px', color: C.textBody, fontSize: 12.5, cursor: 'pointer', backdropFilter: 'blur(6px)' }}>
          Ask about these accounts
        </div>
      </div>
    </div>
  );
}
