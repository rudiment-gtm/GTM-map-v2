// Single source of truth for the dark ProYard palette.
export const C = {
  bg: '#0B0B0D',
  surface: '#0F1012',
  card: '#141518',
  cardAlt: '#17181B',
  raised: '#1E1F23',
  line: '#1c1d20',
  border: '#232427',
  borderStrong: '#2A2C30',
  text: '#F6F5F2',
  textBody: '#D6D5D1',
  textDim: '#9DA0A6',
  textMute: '#6E7178',
  textFaint: '#5D6067',
  green: '#2BD576',
  greenText: '#07170D',
  greenSoft: '#7EE8AC',
  greenBg: '#1B2A21',
  greenBorder: '#27563C',
  warn: '#E8B54A',
};

export const mono = "'JetBrains Mono', monospace";

export const label = {
  color: C.textDim,
  fontSize: 10.5,
  fontFamily: mono,
  letterSpacing: '.12em',
};

export const cardStyle = {
  background: C.card,
  border: '1px solid ' + C.borderStrong,
  borderRadius: 12,
};

export const btnGhost = {
  border: '1px solid ' + C.borderStrong,
  color: '#C9C8C4',
  borderRadius: 8,
  padding: '7px 12px',
  fontSize: 12,
  cursor: 'pointer',
};

export const btnPrimary = {
  background: C.green,
  color: C.greenText,
  borderRadius: 8,
  padding: '7px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

export const tableWrap = {
  border: '1px solid ' + C.border,
  background: C.card,
  borderRadius: 11,
  overflowX: 'auto',
};

export const theadCell = {
  background: C.cardAlt,
  borderBottom: '1px solid ' + C.border,
  padding: '10px 14px',
  color: C.textDim,
  fontSize: 10.5,
  fontFamily: mono,
  letterSpacing: '.08em',
};
