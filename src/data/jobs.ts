export const jobCategories=['finance','comptabilité','contrôle de gestion','contrôle financier','finance d’entreprise','audit','trésorerie','analyste financier','reporting financier','consolidation','assistant DAF','gestion financière','comptabilité générale','comptabilité fournisseurs','comptabilité clients'];
export const platforms=[
  {name:'LinkedIn Jobs',url:(q:string)=>`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent('Île-de-France, France')}`},
  {name:'Indeed',url:(q:string)=>`https://fr.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent('Île-de-France')}`},
  {name:'France Travail',url:()=>`https://candidat.francetravail.fr/offres/recherche`},
  {name:'APEC',url:()=>`https://www.apec.fr/candidat/recherche-emploi.html/emploi`},
  {name:'JobTeaser',url:()=>`https://www.jobteaser.com/fr/job-offers`},
  {name:'Welcome to the Jungle',url:()=>`https://www.welcometothejungle.com/fr/jobs`},
  {name:'HelloWork',url:()=>`https://www.hellowork.com/fr-fr/emploi.html`}
];
export const suggestedSearches=['alternance analyste financier Île-de-France','alternance contrôle de gestion Île-de-France','alternance finance M2 Paris','alternance audit Paris','alternance trésorerie Île-de-France','alternance assistant DAF Paris','alternance comptabilité finance Paris'];
