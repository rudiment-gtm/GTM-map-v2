import React, { useEffect, useRef, useState } from 'react';
import { C, btnGhost, btnPrimary, mono } from '../theme.js';
import { MODELS, SUGGESTIONS } from '../data.js';

function ResultTable({ rows }) {
  const cols = '1.7fr 1fr .8fr .8fr';
  return (
    <div style={{ border: '1px solid ' + C.border, background: C.card, borderRadius: 11, overflowX: 'auto' }}>
      <div style={{ minWidth: 460, display: 'grid', gridTemplateColumns: cols, background: C.cardAlt, borderBottom: '1px solid ' + C.border, padding: '9px 14px', color: C.textDim, fontSize: 10.5, fontFamily: mono, letterSpacing: '.08em' }}>
        <div>ACCOUNT</div><div>CITY</div><div>STATUS</div><div>VALUE</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ minWidth: 460, display: 'grid', gridTemplateColumns: cols, padding: '10px 14px', color: C.textBody, fontSize: 12.5, borderTop: '1px solid ' + C.line, whiteSpace: 'nowrap' }}>
          <div>{r.a}</div><div>{r.b}</div><div>{r.c}</div><div>{r.d}</div>
        </div>
      ))}
    </div>
  );
}

export default function ChatView({ title, model, setModel, messages, thinking, showing, onSend, onShowOnMap, onBuildRoute, onExport }) {
  const [input, setInput] = useState('');
  const [modelOpen, setModelOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight;
  }, [messages.length, thinking]);

  const submit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.surface, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 46, flexShrink: 0, borderBottom: '1px solid ' + C.line, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ color: '#EDEDEA', fontSize: 13, fontWeight: 600 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div onClick={() => setModelOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: C.cardAlt, border: '1px solid ' + C.borderStrong, borderRadius: 8, padding: '6px 10px', color: C.textBody, fontSize: 12, cursor: 'pointer' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            {model}
            <span style={{ color: C.textMute }}>&#8964;</span>
          </div>
          {modelOpen && (
            <div style={{ position: 'absolute', top: 36, right: 0, width: 210, background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 10, padding: 5, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 20, boxShadow: '0 14px 34px rgba(0,0,0,.55)' }}>
              {MODELS.map((m) => (
                <div key={m} onClick={() => { setModel(m); setModelOpen(false); }} style={{ padding: '8px 10px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', color: m === model ? '#EDEDEA' : '#B9BCC2', background: m === model ? C.raised : 'transparent' }}>
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div ref={endRef} style={{ flex: 1, overflowY: 'auto', padding: '26px 0 8px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 680, maxWidth: '92%', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {messages.length === 0 && !thinking && (
            <div style={{ paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.green }} />
              <div style={{ color: '#EDEDEA', fontSize: 20, fontWeight: 600, letterSpacing: '-.015em' }}>What do you want to know?</div>
              <div style={{ color: C.textDim, fontSize: 13 }}>Ask about accounts, territories, churn or routes.</div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'user' ? (
                <div style={{ maxWidth: '78%', background: C.raised, border: '1px solid ' + C.borderStrong, borderRadius: '12px 12px 4px 12px', padding: '11px 14px', color: '#EDEDEA', fontSize: 13.5, lineHeight: 1.5 }}>
                  {m.text}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: C.green, flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#D8D7D3', fontSize: 13.5, lineHeight: 1.62, textWrap: 'pretty' }}>{m.text}</div>
                    {m.rows && <ResultTable rows={m.rows} />}
                    {m.rows && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <div onClick={() => onShowOnMap(m)} style={btnPrimary}>Show these on map</div>
                        <div onClick={() => onBuildRoute(m)} style={btnGhost}>Build a route</div>
                        <div onClick={() => onExport(m)} style={btnGhost}>Export CSV</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: C.green, flexShrink: 0 }} />
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 0.2, 0.4].map((d) => (
                  <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: C.textMute, animation: 'pulseDot 1.1s ' + d + 's infinite' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '8px 0 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 680, maxWidth: '92%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              rows={1}
              placeholder="Ask about accounts, territories or routes..."
              style={{ background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: '#EDEDEA', fontSize: 13.5, lineHeight: 1.5, minHeight: 20 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 7 }}>
                <span style={{ border: '1px solid ' + C.borderStrong, borderRadius: 7, padding: '3px 9px', color: C.textDim, fontSize: 12, cursor: 'pointer' }}>+</span>
                <span style={{ border: '1px solid ' + C.borderStrong, borderRadius: 7, padding: '3px 9px', color: C.textDim, fontSize: 11.5 }}>
                  &#9678; Map context: {showing.toLocaleString()} shown
                </span>
              </div>
              <div onClick={submit} style={{ width: 28, height: 28, borderRadius: 8, background: C.green, color: C.greenText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer' }}>&#8593;</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SUGGESTIONS.map((s) => (
              <div key={s.label} onClick={() => onSend(s.q)} style={{ border: '1px solid ' + C.border, color: C.textDim, borderRadius: 999, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
