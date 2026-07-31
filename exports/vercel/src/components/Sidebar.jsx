import React from 'react';
import { C, mono } from '../theme.js';
import { FILTER_OPTIONS, RECENT_CHATS, TOTAL_ACCOUNTS } from '../data.js';
import CreditMeter from './CreditMeter.jsx';

const TABS = [
  { id: 'chat', label: 'Chat' },
  { id: 'map', label: 'Map' },
  { id: 'prospect', label: 'Prospect' },
  { id: 'enrich', label: 'Enrich' },
];

const navItem = { padding: '9px 10px', borderRadius: 8, color: '#B9BCC2', fontSize: 13, cursor: 'pointer' };
const navItemActive = { ...navItem, background: C.cardAlt, color: '#EDEDEA', fontWeight: 600 };
const select = {
  background: C.cardAlt, border: '1px solid ' + C.border, borderRadius: 7,
  padding: '8px 10px', color: C.textBody, fontSize: 11.5, outline: 'none',
  appearance: 'none', cursor: 'pointer',
};

function Stat({ value, label }) {
  return (
    <div style={{ flex: 1, background: C.cardAlt, border: '1px solid ' + C.border, borderRadius: 9, padding: '10px 12px' }}>
      <div style={{ color: C.text, fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ color: C.textDim, fontSize: 10 }}>{label}</div>
    </div>
  );
}

export default function Sidebar({ tab, setTab, credits, monthly, showing, groups, applyGroups, addGroup, recentOpen, newChat }) {
  const onTabKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    setTab(TABS[(i + dir + TABS.length) % TABS.length].id);
  };

  return (
    <div style={{
      width: 268, flexShrink: 0, background: C.bg, borderRight: '1px solid ' + C.line,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08170E', fontWeight: 700, fontSize: 14 }}>P</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: C.text, fontSize: 14.5, fontWeight: 700, letterSpacing: '-.01em' }}>ProYard</div>
          <div style={{ color: C.textDim, fontSize: 10.5 }}>Sales Territory Mapper</div>
        </div>
      </div>

      <div role="tablist" aria-label="Product" style={{ margin: '0 14px 16px', background: C.card, border: '1px solid ' + C.border, borderRadius: 10, padding: 3, display: 'flex', gap: 2 }}>
        {TABS.map((t, i) => {
          const on = tab === t.id;
          return (
            <div
              key={t.id}
              role="tab"
              tabIndex={on ? 0 : -1}
              aria-selected={on}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => { onTabKey(e, i); if (e.key === 'Enter' || e.key === ' ') setTab(t.id); }}
              style={{
                flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8, fontSize: 11.5,
                cursor: 'pointer', userSelect: 'none', outline: 'none',
                background: on ? '#FFFFFF' : 'transparent',
                color: on ? C.bg : C.textDim,
                fontWeight: on ? 600 : 400,
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {tab === 'chat' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 12px' }}>
              <div onClick={newChat} style={{ ...navItemActive, display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ color: C.green, fontSize: 15, lineHeight: 1 }}>+</span> New chat
              </div>
              <div style={navItem}>All chats</div>
            </div>
            <div style={{ padding: '18px 16px 8px', color: C.textMute, fontSize: 10.5, fontFamily: mono, letterSpacing: '.12em' }}>RECENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 12px' }}>
              {RECENT_CHATS.map((title) => (
                <div key={title} onClick={() => recentOpen(title)} style={{ padding: '7px 10px', borderRadius: 7, color: C.textDim, fontSize: 12.5, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {title}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'map' && (
          <>
            <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px' }}>
              <Stat value={TOTAL_ACCOUNTS} label="Total Accounts" />
              <Stat value={showing.toLocaleString()} label="Showing" />
            </div>
            <div style={{ padding: '0 14px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.12em' }}>FILTERS</div>
              <div onClick={() => applyGroups([])} style={{ color: C.textDim, fontSize: 11, cursor: 'pointer' }}>Clear all</div>
            </div>
            {groups.map((g, i) => (
              <div key={g.id} style={{ margin: '8px 14px', border: '1px solid ' + C.border, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: C.textBody, fontSize: 12 }}>Group {i + 1}</span>
                  <span onClick={() => applyGroups(groups.filter((x) => x.id !== g.id))} style={{ color: C.textMute, fontSize: 13, cursor: 'pointer' }}>x</span>
                </div>
                <select
                  value={g.field}
                  onChange={(e) => {
                    const f = e.target.value;
                    applyGroups(groups.map((x) => (x.id === g.id ? { ...x, field: f, value: FILTER_OPTIONS[f][0] } : x)));
                  }}
                  style={select}
                >
                  {Object.keys(FILTER_OPTIONS).map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                <div style={{ background: C.cardAlt, border: '1px solid ' + C.border, borderRadius: 7, padding: '8px 10px', color: C.textDim, fontSize: 11.5 }}>is any of</div>
                <select
                  value={g.value}
                  onChange={(e) => {
                    const v = e.target.value;
                    applyGroups(groups.map((x) => (x.id === g.id ? { ...x, value: v } : x)));
                  }}
                  style={select}
                >
                  {FILTER_OPTIONS[g.field].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div onClick={addGroup} style={{ margin: '8px 14px 0', border: '1px dashed ' + C.borderStrong, borderRadius: 10, padding: 10, textAlign: 'center', color: C.textDim, fontSize: 12, cursor: 'pointer' }}>
              + Add filter group
            </div>
          </>
        )}

        {tab === 'prospect' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 12px' }}>
              <div style={navItemActive}>New search</div>
              <div style={navItem}>Saved searches</div>
              <div style={navItem}>Imported lists</div>
            </div>
            <div style={{ padding: '18px 16px 8px', color: C.textMute, fontSize: 10.5, fontFamily: mono, letterSpacing: '.12em' }}>SOURCES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 14px' }}>
              {['Clay', 'Google Places'].map((src) => (
                <div key={src} style={{ display: 'flex', justifyContent: 'space-between', background: C.cardAlt, border: '1px solid ' + C.border, borderRadius: 8, padding: '8px 10px', color: '#A9ACB2', fontSize: 11.5 }}>
                  <span>{src}</span><span style={{ color: C.green }}>connected</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'enrich' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 12px' }}>
              <div style={navItemActive}>Company lookup</div>
              <div style={navItem}>Bulk enrich</div>
              <div style={navItem}>Enrichment history</div>
            </div>
            <div style={{ padding: '18px 16px 8px', color: C.textMute, fontSize: 10.5, fontFamily: mono, letterSpacing: '.12em' }}>CREDIT COSTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '0 16px' }}>
              {[['Company profile', 1], ['Contact + email', 2], ['Direct dial', 4]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: C.textDim, fontSize: 11.5 }}>
                  <span>{k}</span><span style={{ color: C.textBody }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <CreditMeter credits={credits} monthly={monthly} />

      <div style={{ padding: '11px 16px', borderTop: '1px solid ' + C.line, display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1F6F45', color: '#DFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>RC</div>
        <div style={{ color: '#C9C8C4', fontSize: 12, flex: 1 }}>Robert Clark</div>
      </div>
    </div>
  );
}
