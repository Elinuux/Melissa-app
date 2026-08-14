export const englishTracks = [
  { id:'quick', icon:'⚡', title:'Révision rapide', subtitle:'5 min · mélange adapté', categories:[] as string[], count:5 },
  { id:'grammar', icon:'Aa', title:'Grammar focus', subtitle:'Temps, prépositions, structures', categories:['Grammar'], count:8 },
  { id:'business', icon:'💼', title:'Business English', subtitle:'Réunions, opinions, questions', categories:['Business English','Meetings','Asking questions','Giving an opinion'], count:8 },
  { id:'finance', icon:'€', title:'Finance vocabulary', subtitle:'Budget, résultats, reporting', categories:['Finance vocabulary','Accounting vocabulary','Presenting figures'], count:8 },
  { id:'emails', icon:'✉', title:'Emails', subtitle:'Écrire simplement et professionnellement', categories:['Emails'], count:7 },
  { id:'interview', icon:'◉', title:'Interview English', subtitle:'Se présenter et parler de son expérience', categories:['Job interviews','Introduce yourself'], count:7 },
];

export const miniLessons = [
  {
    id:'introduce', title:'Introduce yourself', level:'A2–B1',
    phrases:['I am currently completing a Master’s degree in financial expertise.','I am looking for an apprenticeship in finance.','I am particularly interested in financial analysis and management control.'],
    tip:'Commence par le présent, puis ton objectif, puis un domaine qui t’intéresse. Trois phrases claires suffisent.'
  },
  {
    id:'figures', title:'Presenting figures', level:'B1',
    phrases:['Revenue increased by 8%.','Costs were lower than expected.','The main variance comes from operating expenses.'],
    tip:'Utilise “by” pour l’ampleur du changement et “from … to …” pour les valeurs de départ et d’arrivée.'
  },
  {
    id:'emails', title:'Useful email phrases', level:'A2–B1',
    phrases:['Please find the document attached.','Could you confirm receipt?','Thank you for your time. I remain available if you need any further information.'],
    tip:'Un bon email professionnel peut rester court : objet clair, demande précise, formule de fin simple.'
  },
];

export const speakingModes = [
  { id:'quick', icon:'🎙️', title:'Réponse rapide', duration:30, prompt:'What do you do and what are you currently looking for?' },
  { id:'minute', icon:'⏱️', title:'1 minute challenge', duration:60, prompt:'Introduce yourself as if you were in a job interview.' },
  { id:'interview', icon:'💼', title:'Entretien', duration:75, prompt:'Why are you interested in finance and what are your strengths?' },
  { id:'finance', icon:'📊', title:'Finance', duration:60, prompt:'Explain what a budget variance is and give a simple example.' },
  { id:'repeat', icon:'🔊', title:'Écoute et répète', duration:30, prompt:'I am currently completing a Master’s degree in financial expertise.' },
];
