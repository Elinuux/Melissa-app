import type { EnglishQuestion } from '../types';

type Seed = Omit<EnglishQuestion, 'id'>;

const seeds: Seed[] = [
  {prompt:'I have worked here ___ three years.',choices:['since','for','during','from'],answer:1,explanation:'On utilise “for” avec une durée.',category:'Grammar',difficulty:'B1'},
  {prompt:'Could you ___ me the latest report?',choices:['send','sent','sending','sends'],answer:0,explanation:'Après “could you”, on utilise la base verbale.',category:'Emails',difficulty:'B1'},
  {prompt:'Revenue increased ___ 8% last quarter.',choices:['by','to','at','for'],answer:0,explanation:'“Increase by 8%” indique l’ampleur de la hausse.',category:'Finance vocabulary',difficulty:'B1'},
  {prompt:'We need to ___ the budget before Friday.',choices:['review','reviewed','reviewing','reviews'],answer:0,explanation:'Après “need to”, on utilise la base verbale.',category:'Business English',difficulty:'A2'},
  {prompt:'The meeting has been ___ until Monday.',choices:['postponed','postpone','postponing','postpones'],answer:0,explanation:'Le passif au present perfect utilise “been + participe passé”.',category:'Meetings',difficulty:'B1'},
  {prompt:'A budget variance is the difference between ___ and actual results.',choices:['forecast','telephone','invoice number','calendar'],answer:0,explanation:'Une variance compare généralement une prévision ou un budget au réalisé.',category:'Finance vocabulary',difficulty:'B1'},
  {prompt:'If I ___ more time, I would prepare a deeper analysis.',choices:['had','have','will have','having'],answer:0,explanation:'Second conditional : if + past simple, would + base verbale.',category:'Grammar',difficulty:'B2'},
  {prompt:'Please find the document ___.',choices:['attached','attaching','attach','attachment'],answer:0,explanation:'“Please find the document attached” est une formule d’email standard.',category:'Emails',difficulty:'B1'},
  {prompt:'Our costs were lower ___ expected.',choices:['than','that','then','as'],answer:0,explanation:'Le comparatif se construit ici avec “lower than”.',category:'Grammar',difficulty:'B1'},
  {prompt:'I am currently ___ a Master’s degree in finance.',choices:['completing','complete','completed','completes'],answer:0,explanation:'“Am currently completing” utilise naturellement le present continuous.',category:'Introduce yourself',difficulty:'B1'},
  {prompt:'The company made a ___ of €2 million.',choices:['profit','profitable','profitably','profiting'],answer:0,explanation:'Après “made a”, il faut le nom “profit”.',category:'Accounting vocabulary',difficulty:'B1'},
  {prompt:'We are responsible ___ monthly reporting.',choices:['for','of','to','with'],answer:0,explanation:'L’expression correcte est “responsible for”.',category:'Business English',difficulty:'B1'},
  {prompt:'Could we ___ the meeting to 3 p.m.?',choices:['move','moving','moved','moves'],answer:0,explanation:'Après “could we”, on utilise la base verbale.',category:'Meetings',difficulty:'B1'},
  {prompt:'Cash flow shows how money moves ___ and out of a business.',choices:['in','on','at','by'],answer:0,explanation:'L’expression est “in and out”.',category:'Finance vocabulary',difficulty:'B1'},
  {prompt:'I ___ the report yesterday.',choices:['finished','have finished','finish','am finishing'],answer:0,explanation:'Avec “yesterday”, on utilise le past simple.',category:'Grammar',difficulty:'B1'},
  {prompt:'I ___ already sent the figures to my manager.',choices:['have','has','did','am'],answer:0,explanation:'“Have already sent” est un present perfect.',category:'Grammar',difficulty:'B1'},
  {prompt:'Could you clarify what you mean ___ “operating margin”?',choices:['by','with','for','at'],answer:0,explanation:'L’expression correcte est “what you mean by”.',category:'Asking questions',difficulty:'B1'},
  {prompt:'In my opinion, this option is more ___ because it reduces costs.',choices:['efficient','efficiency','efficiently','efficiencies'],answer:0,explanation:'Après “is more”, il faut ici l’adjectif “efficient”.',category:'Giving an opinion',difficulty:'B1'},
  {prompt:'The figures are not final; they are still ___.',choices:['provisional','provision','provisionally result','provide'],answer:0,explanation:'“Provisional” signifie provisoire/non définitif.',category:'Presenting figures',difficulty:'B1'},
  {prompt:'Sales fell ___ €5 million to €4.5 million.',choices:['from','by','at','for'],answer:0,explanation:'Pour indiquer le point de départ, on utilise “fell from”.',category:'Presenting figures',difficulty:'B1'},
  {prompt:'I am looking ___ an apprenticeship in corporate finance.',choices:['for','at','to','of'],answer:0,explanation:'L’expression correcte est “look for”.',category:'Job interviews',difficulty:'A2'},
  {prompt:'One of my strengths ___ being very organised.',choices:['is','are','be','were'],answer:0,explanation:'Le sujet principal est “one”, donc le verbe est au singulier.',category:'Job interviews',difficulty:'B1'},
  {prompt:'Would you mind ___ the spreadsheet again?',choices:['sending','send','sent','sends'],answer:0,explanation:'Après “would you mind”, on utilise le gérondif en -ing.',category:'Emails',difficulty:'B2'},
  {prompt:'An invoice is a document requesting ___.',choices:['payment','meeting','recruitment','forecast'],answer:0,explanation:'Une facture demande le paiement de biens ou services.',category:'Accounting vocabulary',difficulty:'A2'},
  {prompt:'The deadline is Friday, so we need to finish it ___ then.',choices:['by','since','during','from'],answer:0,explanation:'“By Friday” signifie au plus tard vendredi.',category:'Business English',difficulty:'B1'},
];

const contexts = [
  '',
  'At work: ',
  'During an interview: ',
  'In a finance team: ',
];

export const englishQuestions: EnglishQuestion[] = seeds.flatMap((seed, seedIndex) =>
  contexts.map((prefix, variantIndex) => ({
    ...seed,
    id: `q${String(seedIndex * contexts.length + variantIndex + 1).padStart(3, '0')}`,
    prompt: `${prefix}${seed.prompt}`,
  })),
);
