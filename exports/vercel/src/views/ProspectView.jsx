import React from 'react';
import { C, btnPrimary, mono } from '../theme.js';

const COLS = '28px 2fr 1.1fr 1fr .8fr .9fr 108px';
const MINW = 760;

export default function ProspectView({ query, setQuery, prospects, selectedCount, toggle, onEnrich, onAddToMap }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.surface, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 46, flexShrink: 0, borderBottom: '1px solid ' + C.line, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ color: '#EDEDEA', fontSize: 13, fontWeight: 600 }}>Prospect</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ border: '1px solid ' + C.borderStrong, color: '#C9C8C4', borderRadius: 8, padding: '6px 11px', fontSize: 12, cursor: 'pointer' }}>Save search</div>
          <div
            onClick={onAddToMap}
            style={selectedCount
              ? { ...btnPrimary, padding: '6px 11px' }
              : { background: C.cardAlt, color: C.textFaint, border: '1px solid ' + C.border, borderRadius: 8, padding: '6px 11px', fontSize: 12, cursor: 'not-allowed' }}
          >
            {selectedCount ? 'Add ' + selectedCount + ' to map' : 'Select accounts'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the accounts you want to find..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#EDEDEA', fontSize: 13.5 }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Radius: 20 mi', 'Type: HOA, Commercial', 'Exclude existing accounts'].map((chip) => (
              <div key={chip} style={{ border: '1px solid ' + C.borderStrong, color: C.textDim, borderRadius: 7, padding: '5px 10px', fontSize: 11.5 }}>{chip}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: C.textDim, fontSize: 11, fontFamily: mono, letterSpacing: '.1em' }}>
            {prospects.length} RESULTS - {selectedCount} SELECTED
          </div>
          <div style={{ color: C.textDim, fontSize: 11.5 }}>Sort: Est. value</div>
        </div>

        <div style={{ border: '1px solid ' + C.border, background: C.card, borderRadius: 11, overflowX: 'auto' }}>
          <div style={{ minWidth: MINW, display: 'grid', gridTemplateColumns: COLS, background: C.cardAlt, borderBottom: '1px solid ' + C.border, padding: '10px 14px', color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.08em' }}>
            <div /><div>PROPERTY</div><div>TYPE</div><div>CITY</div><div>TURF</div><div>EST. VALUE</div><div />
          </div>
          {prospects.map((p, i) => (
            <div
              key={p.name}
              onClick={() => toggle(i)}
              style={{ minWidth: MINW, display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '11px 14px', borderTop: '1px solid ' + C.line, background: p.sel ? C.cardAlt : 'transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <div style={{ color: p.sel ? C.green : '#4A4D53', fontSize: 12 }}>{p.sel ? '\u2713' : '\u25CB'}</div>
              <div style={{ color: '#EDEDEA', fontSize: 12.5 }}>{p.name}</div>
              <div style={{ color: C.textDim, fontSize: 12.5 }}>{p.type}</div>
              <div style={{ color: C.textDim, fontSize: 12.5 }}>{p.city}</div>
              <div style={{ color: C.textDim, fontSize: 12.5 }}>{p.turf}</div>
              <div style={{ color: C.textBody, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{p.value}</div>
              <div
                onClick={(e) => { e.stopPropagation(); onEnrich(p); }}
                style={{ justifySelf: 'end', border: '1px solid ' + C.borderStrong, color: C.textDim, borderRadius: 7, padding: '4px 9px', fontSize: 11, cursor: 'pointer' }}
              >
                Enrich
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
