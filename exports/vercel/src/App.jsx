import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { C } from './theme.js';
import { CONTACTS, COUNTS, PROSPECTS, TOTAL_ACCOUNTS, pickReply } from './data.js';
import Sidebar from './components/Sidebar.jsx';
import MapView from './views/MapView.jsx';
import ChatView from './views/ChatView.jsx';
import ProspectView from './views/ProspectView.jsx';
import EnrichView from './views/EnrichView.jsx';
import Toast from './components/Toast.jsx';

const MONTHLY_CREDITS = 5000;
const TABS = ['chat', 'map', 'prospect', 'enrich'];

function countFor(groups) {
  if (!groups.length) return TOTAL_ACCOUNTS;
  return groups.reduce((min, g) => Math.min(min, COUNTS[g.field + ':' + g.value] ?? 500), TOTAL_ACCOUNTS);
}

export default function App() {
  // Tab lives in the URL hash so every destination is deep-linkable.
  const [tab, setTabState] = useState(() => {
    const h = window.location.hash.replace('#/', '');
    return TABS.includes(h) ? h : 'chat';
  });
  const setTab = useCallback((next) => {
    setTabState(next);
    window.history.replaceState(null, '', '#/' + next);
  }, []);
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#/', '');
      if (TABS.includes(h)) setTabState(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef();
  const flash = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // credits ------------------------------------------------------------
  const [credits, setCredits] = useState(4180);
  const [companiesEnriched] = useState(214);
  const [contactsRevealed, setContactsRevealed] = useState(303);
  const spend = useCallback((n) => setCredits((c) => Math.max(0, c - n)), []);

  // map ----------------------------------------------------------------
  const [groups, setGroups] = useState([{ id: 1, field: 'Status', value: 'Canceled' }]);
  const nextGroupId = useRef(2);
  const [showing, setShowing] = useState(710);
  const [pinned, setPinned] = useState(null);
  const [mapSearch, setMapSearch] = useState('');

  const applyGroups = useCallback((next) => {
    setGroups(next);
    setShowing(countFor(next));
    setPinned(null);
  }, []);

  // chat ---------------------------------------------------------------
  const [model, setModel] = useState('Claude Sonnet 4.5');
  const [messages, setMessages] = useState([]);
  const [chatTitle, setChatTitle] = useState('New chat');
  const [thinking, setThinking] = useState(false);
  const replyTimer = useRef();
  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const send = useCallback((raw) => {
    const text = (raw || '').trim();
    if (!text || thinking) return;
    const reply = pickReply(text);
    setMessages((m) => [...m, { role: 'user', text }]);
    setChatTitle((t) => (messages.length ? t : text.slice(0, 46)));
    setThinking(true);
    clearTimeout(replyTimer.current);
    // Replace this timeout with a streaming fetch('/api/chat') when the backend lands.
    replyTimer.current = setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: 'bot', ...reply }]);
    }, 900);
  }, [messages.length, thinking]);

  const applyToMap = useCallback((reply) => {
    setShowing(reply.count);
    setPinned(reply.pin);
    setTab('map');
    flash('Map updated - ' + reply.count + ' accounts pinned');
  }, [flash, setTab]);

  // prospect -----------------------------------------------------------
  const [prospects, setProspects] = useState(() => PROSPECTS.map((p) => ({ ...p })));
  const [prospectQuery, setProspectQuery] = useState(
    'Commercial properties with 2+ acres of turf within 20 mi of Lehi, not already in CRM'
  );
  const selectedCount = useMemo(() => prospects.filter((p) => p.sel).length, [prospects]);

  // enrich -------------------------------------------------------------
  const [contacts, setContacts] = useState(() => CONTACTS.map((c) => ({ ...c })));
  const [company, setCompany] = useState('Silver Lake Business Park');
  const [companyOrigin, setCompanyOrigin] = useState('from map - Lehi, UT');
  const [enrichQuery, setEnrichQuery] = useState('');

  const revealContact = useCallback((i) => {
    setContacts((list) => {
      if (list[i].revealed) return list;
      spend(2);
      setContactsRevealed((n) => n + 1);
      flash('2 credits used - contact revealed');
      return list.map((c, n) => (n === i ? { ...c, revealed: true } : c));
    });
  }, [flash, spend]);

  const revealAll = useCallback(() => {
    setContacts((list) => {
      const locked = list.filter((c) => !c.revealed).length;
      if (!locked) return list;
      spend(locked * 2);
      setContactsRevealed((n) => n + locked);
      flash(locked * 2 + ' credits used - ' + locked + ' contacts revealed');
      return list.map((c) => ({ ...c, revealed: true }));
    });
  }, [flash, spend]);

  const openEnrich = useCallback((name, origin) => {
    setCompany(name);
    setCompanyOrigin(origin);
    setTab('enrich');
  }, [setTab]);

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', background: C.bg, color: '#EDEDEA', overflow: 'hidden' }}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        credits={credits}
        monthly={MONTHLY_CREDITS}
        showing={showing}
        groups={groups}
        applyGroups={applyGroups}
        addGroup={() => applyGroups([...groups, { id: nextGroupId.current++, field: 'Services', value: 'Mowing' }])}
        recentOpen={(title) => { setMessages([]); setChatTitle(title); setTab('chat'); send(title); }}
        newChat={() => { setMessages([]); setChatTitle('New chat'); }}
      />

      <div style={{ flex: 1, position: 'relative', minWidth: 0, background: C.surface }}>
        {/* Map stays mounted so switching tabs never re-initializes it. */}
        <MapView
          active={tab === 'map'}
          showing={showing}
          pinned={pinned}
          clearPinned={() => { setPinned(null); setShowing(countFor(groups)); }}
          mapSearch={mapSearch}
          setMapSearch={setMapSearch}
          onSync={() => flash('Syncing from Clay - 2,773 accounts up to date')}
          onSurrounding={() => { openEnrich('Silver Lake Business Park', 'from map - Lehi, UT'); flash('3 businesses found nearby'); }}
          onAsk={() => setTab('chat')}
        />

        {tab === 'chat' && (
          <ChatView
            title={chatTitle}
            model={model}
            setModel={setModel}
            messages={messages}
            thinking={thinking}
            showing={showing}
            onSend={send}
            onShowOnMap={applyToMap}
            onBuildRoute={(m) => { setPinned('Route - ' + (m.count || 6) + ' stops'); setTab('map'); flash('Route built - 1h 48m'); }}
            onExport={(m) => flash('CSV exported - ' + (m.rows ? m.rows.length : 0) + ' rows')}
          />
        )}

        {tab === 'prospect' && (
          <ProspectView
            query={prospectQuery}
            setQuery={setProspectQuery}
            prospects={prospects}
            selectedCount={selectedCount}
            toggle={(i) => setProspects((list) => list.map((p, n) => (n === i ? { ...p, sel: !p.sel } : p)))}
            onEnrich={(p) => openEnrich(p.name, 'from prospect - ' + p.city + ', UT')}
            onAddToMap={() => {
              if (!selectedCount) return;
              setShowing((s) => s + selectedCount);
              setPinned(selectedCount + ' prospects added to map');
              setTab('map');
              flash(selectedCount + ' prospects added to the map');
            }}
          />
        )}

        {tab === 'enrich' && (
          <EnrichView
            company={company}
            origin={companyOrigin}
            query={enrichQuery}
            setQuery={setEnrichQuery}
            contacts={contacts}
            credits={credits}
            monthly={MONTHLY_CREDITS}
            companiesEnriched={companiesEnriched}
            contactsRevealed={contactsRevealed}
            onReveal={revealContact}
            onRevealAll={revealAll}
            onFind={() => flash('6 contacts found - 1 credit used')}
            onPushCrm={() => flash('Pushed to CRM')}
            onExport={() => flash('CSV exported')}
            onDraft={() => { setTab('chat'); send('Draft outreach to Dana Whitmore at Silver Lake Business Park'); }}
            onBuy={() => flash('Opening billing - add 5,000 credits')}
          />
        )}

        <Toast message={toast} />
      </div>
    </div>
  );
}
