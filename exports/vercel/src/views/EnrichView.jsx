import React from 'react';
import { C, btnGhost, btnPrimary, mono } from '../theme.js';
import { COMPANY_PROFILE } from '../data.js';

const COLS = '1.25fr 1.2fr 1.6fr 1fr 96px';
const MINW = 640;

export default function EnrichView({
  company, origin, query, setQuery, contacts, credits, monthly,
  companiesEnriched, contactsRevealed, onReveal, onRevealAll, onFind, onPushCrm, onExport, onDraft, onBuy,
}) {
  const locked = contacts.filter((c) => !c.revealed).length;
  const pct = Math.max(0, Math.min(100, (credits / monthly) * 100));
  const cell = (revealed) => ({
    color: revealed ? C.textBody : C.textFaint,
    fontSize: 12.5,
    fontVariantNumeric: 'tabular-nums',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: 10,
  });

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.surface, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 46, flexShrink: 0, borderBottom: '1px solid ' + C.line, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <div style={{ color: '#EDEDEA', fontSize: 13, fontWeight: 600 }}>{company}</div>
          <div style={{ border: '1px solid ' + C.borderStrong, color: C.textDim, borderRadius: 6, padding: '2px 7px', fontSize: 10.5, whiteSpace: 'nowrap' }}>{origin}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ color: C.textDim, fontSize: 11.5, fontVariantNumeric: 'tabular-nums' }}>{credits.toLocaleString()} credits left</div>
          <div
            onClick={onRevealAll}
            style={locked
              ? { ...btnPrimary, padding: '6px 11px' }
              : { background: C.cardAlt, color: C.textFaint, border: '1px solid ' + C.border, borderRadius: 8, padding: '6px 11px', fontSize: 12, cursor: 'default' }}
          >
            {locked ? 'Reveal all - ' + locked * 2 : 'All revealed'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 620px', minWidth: 'min(620px, 100%)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a company, or enrich the account selected on the map..."
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#EDEDEA', fontSize: 13.5 }}
            />
            <div onClick={onFind} style={{ border: '1px solid ' + C.borderStrong, color: '#C9C8C4', borderRadius: 7, padding: '5px 11px', fontSize: 11.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>Find contacts</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: C.textDim, fontSize: 11, fontFamily: mono, letterSpacing: '.1em' }}>CONTACTS FOUND - {contacts.length}</div>
            <div style={{ color: C.textDim, fontSize: 11.5 }}>2 credits per reveal</div>
          </div>

          <div style={{ border: '1px solid ' + C.border, background: C.card, borderRadius: 11, overflowX: 'auto' }}>
            <div style={{ minWidth: MINW, display: 'grid', gridTemplateColumns: COLS, background: C.cardAlt, borderBottom: '1px solid ' + C.border, padding: '10px 14px', color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.08em' }}>
              <div>NAME</div><div>TITLE</div><div>EMAIL</div><div>DIRECT DIAL</div><div />
            </div>
            {contacts.map((c, i) => (
              <div key={c.name} style={{ minWidth: MINW, display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '11px 14px', borderTop: '1px solid ' + C.line }}>
                <div style={{ color: '#EDEDEA', fontSize: 12.5 }}>{c.name}</div>
                <div style={{ color: C.textDim, fontSize: 12.5 }}>{c.title}</div>
                <div style={cell(c.revealed)}>{c.revealed ? c.email : '\u2022\u2022\u2022\u2022\u2022\u2022@silverlakebp.com'}</div>
                <div style={cell(c.revealed)}>{c.revealed ? c.phone : '(\u2022\u2022\u2022) \u2022\u2022\u2022-\u2022\u2022\u2022\u2022'}</div>
                {c.revealed ? (
                  <div style={{ justifySelf: 'end', color: '#5F6268', fontSize: 11.5 }}>Revealed</div>
                ) : (
                  <div
                    onClick={() => onReveal(i)}
                    style={{ justifySelf: 'end', background: C.greenBg, border: '1px solid ' + C.greenBorder, color: C.greenSoft, borderRadius: 7, padding: '5px 10px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Reveal - 2
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div onClick={onPushCrm} style={btnGhost}>Push to CRM</div>
            <div onClick={onExport} style={btnGhost}>Export CSV</div>
            <div onClick={onDraft} style={btnGhost}>Draft outreach in Chat</div>
          </div>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 280, maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.1em' }}>COMPANY PROFILE</div>
            {COMPANY_PROFILE.map((f) => (
              <div key={f.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: C.textDim, fontSize: 12 }}>{f.k}</span>
                <span style={{ color: C.textBody, fontSize: 12, textAlign: 'right' }}>{f.v}</span>
              </div>
            ))}
            <div style={{ color: '#5F6268', fontSize: 10.5, borderTop: '1px solid ' + C.border, paddingTop: 10 }}>Enriched Jul 31 - 1 credit</div>
          </div>

          <div style={{ background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.1em' }}>THIS MONTH</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ color: C.text, fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{credits.toLocaleString()}</div>
              <div style={{ color: C.textMute, fontSize: 12 }}>of {monthly.toLocaleString()} credits</div>
            </div>
            <div style={{ height: 5, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: pct + '%', height: '100%', background: pct < 10 ? C.warn : C.green, borderRadius: 999, transition: 'width .35s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textDim, fontSize: 11.5 }}>
              <span>Companies enriched</span><span style={{ color: C.textBody }}>{companiesEnriched}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textDim, fontSize: 11.5 }}>
              <span>Contacts revealed</span><span style={{ color: C.textBody }}>{contactsRevealed}</span>
            </div>
            <div onClick={onBuy} style={{ border: '1px solid ' + C.borderStrong, color: '#C9C8C4', borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: 12, marginTop: 4, cursor: 'pointer' }}>
              Buy more credits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
