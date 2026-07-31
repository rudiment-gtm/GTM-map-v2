// All demo data lives here. Swap these for real API calls when the backend exists.

export const PROSPECTS = [
  { name: 'Silver Lake Business Park', type: 'Commercial', city: 'Lehi', turf: '6.2 ac', value: '$18,400', sel: true },
  { name: 'Traverse Ridge HOA', type: 'HOA', city: 'Draper', turf: '4.8 ac', value: '$14,900', sel: true },
  { name: 'Thanksgiving Point Offices', type: 'Commercial', city: 'Lehi', turf: '3.9 ac', value: '$11,600', sel: false },
  { name: 'Meadow Crossing Apartments', type: 'Multifamily', city: 'American Fork', turf: '3.1 ac', value: '$9,750', sel: true },
  { name: 'Pointe West Medical', type: 'Commercial', city: 'Saratoga Springs', turf: '2.4 ac', value: '$7,300', sel: false },
  { name: 'Willow Bend HOA', type: 'HOA', city: 'Highland', turf: '2.2 ac', value: '$6,900', sel: false },
  { name: 'Canyon Gate Corporate Center', type: 'Commercial', city: 'Alpine', turf: '2.1 ac', value: '$6,400', sel: false },
  { name: 'Northshore Townhomes', type: 'Multifamily', city: 'Vineyard', turf: '2.0 ac', value: '$5,850', sel: false },
];

export const CONTACTS = [
  { name: 'Dana Whitmore', title: 'Director of Facilities', email: 'd.whitmore@silverlakebp.com', phone: '(801) 555-0142', revealed: true },
  { name: 'Marcus Field', title: 'Property Manager', email: 'm.field@silverlakebp.com', phone: '(801) 555-0187', revealed: false },
  { name: 'Priya Raman', title: 'VP Operations', email: 'p.raman@silverlakebp.com', phone: '(801) 555-0119', revealed: false },
  { name: 'Owen Castillo', title: 'Grounds Supervisor', email: 'o.castillo@silverlakebp.com', phone: '(801) 555-0166', revealed: false },
  { name: 'Beth Nakagawa', title: 'Regional Controller', email: 'b.nakagawa@silverlakebp.com', phone: '(801) 555-0173', revealed: false },
  { name: 'Trent Alvarez', title: 'Site Manager', email: 't.alvarez@silverlakebp.com', phone: '(801) 555-0128', revealed: false },
];

export const COMPANY_PROFILE = [
  { k: 'Industry', v: 'Property mgmt' },
  { k: 'Employees', v: '120-250' },
  { k: 'Revenue', v: '$28M est.' },
  { k: 'Locations', v: '4 in UT' },
  { k: 'Turf area', v: '6.2 acres' },
  { k: 'Website', v: 'silverlakebp.com' },
];

export const FILTER_OPTIONS = {
  Status: ['Active', 'Canceled', 'Paused', 'Lead'],
  Services: ['Mowing', 'Fertilization', 'Irrigation', 'Snow removal'],
  Rep: ['Robert Clark', 'Jess Nolan', 'Ty Brennan'],
};

export const COUNTS = {
  'Status:Active': 1642, 'Status:Canceled': 710, 'Status:Paused': 288, 'Status:Lead': 133,
  'Services:Mowing': 1210, 'Services:Fertilization': 604, 'Services:Irrigation': 431, 'Services:Snow removal': 219,
  'Rep:Robert Clark': 512, 'Rep:Jess Nolan': 476, 'Rep:Ty Brennan': 398,
};

export const TOTAL_ACCOUNTS = 2773;

export const MODELS = ['Claude Sonnet 4.5', 'Claude Opus 4.1', 'GPT-5', 'GPT-5 mini'];

export const SUGGESTIONS = [
  { label: 'Summarize churn risk', q: 'Summarize churn risk across canceled accounts' },
  { label: "Plan Tuesday's route", q: "Plan Tuesday's route around Provo" },
  { label: 'Find lookalikes', q: 'Find lookalikes of my best accounts' },
];

export const RECENT_CHATS = [
  'Canceled mowing in Utah County',
  'Best route for Tuesday - Ogden',
  'Accounts with no service since May',
];

// Canned assistant replies. Replace pickReply() with a real /api/chat call later.
const REPLIES = [
  {
    match: /cancel|churn|risk|lost/i,
    text: '14 canceled mowing accounts sit within a 15-minute drive of your Provo route. Nine canceled in the last 90 days - that group is usually the most winnable.',
    rows: [
      { a: 'Wasatch Ridge HOA', b: 'Orem', c: 'Canceled', d: '$4,800' },
      { a: 'Cedar Hollow Apts', b: 'Provo', c: 'Canceled', d: '$3,150' },
      { a: 'Timp View Dental', b: 'Pleasant Grove', c: 'Canceled', d: '$1,240' },
    ],
    pin: '14 canceled accounts near Provo',
    count: 14,
  },
  {
    match: /route|tuesday|drive|plan/i,
    text: 'Here is a 6-stop loop for Tuesday. Total drive time is 1h 48m, down 34 minutes from routing them in CRM order.',
    rows: [
      { a: 'Traverse Ridge HOA', b: 'Draper', c: 'Active', d: '$14,900' },
      { a: 'Silver Lake Business Park', b: 'Lehi', c: 'Lead', d: '$18,400' },
      { a: 'Meadow Crossing Apts', b: 'American Fork', c: 'Active', d: '$9,750' },
    ],
    pin: 'Tuesday route - 6 stops',
    count: 6,
  },
  {
    match: /lookalike|similar|like/i,
    text: 'Your best-performing segment is 3-7 acre commercial parks in south Salt Lake County. 23 properties match that shape and are not in the CRM yet.',
    rows: [
      { a: 'Canyon Gate Corporate Center', b: 'Alpine', c: 'Prospect', d: '$6,400' },
      { a: 'Pointe West Medical', b: 'Saratoga Springs', c: 'Prospect', d: '$7,300' },
      { a: 'Willow Bend HOA', b: 'Highland', c: 'Prospect', d: '$6,900' },
    ],
    pin: '23 lookalike prospects',
    count: 23,
  },
];

const DEFAULT_REPLY = {
  text: 'Across the 710 accounts currently shown, average contract value is $6,180 and 41% carry more than one service line. The Ogden cluster is your weakest - 22% below the portfolio average.',
  rows: [
    { a: 'Ogden cluster', b: 'Ogden', c: '84 accts', d: '$4,820' },
    { a: 'Salt Lake core', b: 'Salt Lake City', c: '312 accts', d: '$6,940' },
    { a: 'Utah County', b: 'Provo', c: '198 accts', d: '$6,110' },
  ],
  pin: '710 accounts - portfolio view',
  count: 710,
};

export function pickReply(text) {
  return REPLIES.find((r) => r.match.test(text)) || DEFAULT_REPLY;
}
