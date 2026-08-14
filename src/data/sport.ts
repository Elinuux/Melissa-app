import type { ExerciseGuide, SportSession } from '../types';

export const sportSessions: SportSession[] = [
  { id:'easy30', title:'Course facile — 30 min', duration:30, type:'Course facile', blocks:[
    { label:'Échauffement marche active', seconds:300, note:'Respiration calme, épaules relâchées' },
    { label:'Course facile', seconds:1200, note:'Allure confortable, conversation possible' },
    { label:'Retour au calme', seconds:300, note:'Marche puis respiration lente' },
  ]},
  { id:'mix35', title:'Course + renforcement — 35 min', duration:35, type:'Course + exercices', blocks:[
    { label:'Échauffement', seconds:300 },
    { label:'Course facile', seconds:600 },
    { label:'Squats', seconds:40, exerciseId:'squat' },
    { label:'Repos', seconds:20 },
    { label:'Fentes alternées', seconds:40, exerciseId:'lunge' },
    { label:'Repos', seconds:20 },
    { label:'Mountain climbers', seconds:30, exerciseId:'mountain-climber' },
    { label:'Repos', seconds:30 },
    { label:'Course progressive', seconds:600 },
    { label:'Gainage', seconds:45, exerciseId:'plank' },
    { label:'Repos', seconds:30 },
    { label:'Gainage latéral', seconds:45, exerciseId:'side-plank' },
    { label:'Retour au calme', seconds:300 },
  ]},
  { id:'interval30', title:'Fractionné doux — 30 min', duration:30, type:'Fractionné', blocks:[
    { label:'Échauffement', seconds:600 },
    { label:'Rapide', seconds:60, note:'Rapide mais contrôlé, pas un sprint maximal' },
    { label:'Lent', seconds:120 },
    { label:'Rapide', seconds:60 }, { label:'Lent', seconds:120 },
    { label:'Rapide', seconds:60 }, { label:'Lent', seconds:120 },
    { label:'Rapide', seconds:60 }, { label:'Lent', seconds:120 },
    { label:'Retour au calme', seconds:480 },
  ]},
  { id:'express20', title:'Séance express — 20 min', duration:20, type:'Express', blocks:[
    { label:'Échauffement', seconds:180 },
    { label:'Course', seconds:420 },
    { label:'Squats', seconds:45, exerciseId:'squat' },
    { label:'Repos', seconds:15 },
    { label:'Fentes', seconds:45, exerciseId:'lunge' },
    { label:'Repos', seconds:15 },
    { label:'Course', seconds:300 },
    { label:'Gainage', seconds:45, exerciseId:'plank' },
    { label:'Retour au calme', seconds:135 },
  ]},
  { id:'recovery20', title:'Récupération active — 20 min', duration:20, type:'Récupération', blocks:[
    { label:'Marche active', seconds:600 },
    { label:'Mobilité douce', seconds:300 },
    { label:'Marche facile', seconds:300 },
  ]},
];

export const exercises: ExerciseGuide[] = [
  {
    id:'squat', name:'Squat', muscles:['Quadriceps','Fessiers','Ceinture abdominale'], difficulty:'facile',
    video:'https://www.youtube.com/results?search_query=Major+Mouvement+squat+technique', alternatives:['Squat sur chaise','Squat amplitude réduite'],
    precaution:'Si une douleur articulaire apparaît, réduis l’amplitude ou arrête le mouvement.',
    instructions:['Pieds légèrement plus larges que le bassin','Descends les hanches vers l’arrière en gardant le buste solide','Pousse le sol avec tout le pied pour remonter'],
    mistakes:['Genoux qui s’effondrent vers l’intérieur','Talons qui décollent','Dos qui s’arrondit fortement'],
  },
  {
    id:'lunge', name:'Fentes', muscles:['Quadriceps','Fessiers','Ischio-jambiers'], difficulty:'moyen',
    video:'https://www.youtube.com/results?search_query=Major+Mouvement+fentes+technique', alternatives:['Fentes arrière','Split squat tenu'],
    precaution:'Raccourcis l’amplitude si le genou ou la hanche est inconfortable.',
    instructions:['Fais un pas assez long pour rester stable','Descends verticalement plutôt que vers l’avant','Garde le genou dans l’axe du pied'],
    mistakes:['Pas trop court','Buste qui s’effondre','Genou qui part vers l’intérieur'],
  },
  {
    id:'mountain-climber', name:'Mountain climbers', muscles:['Abdominaux','Épaules','Cardio'], difficulty:'moyen',
    video:'https://www.youtube.com/results?search_query=mountain+climber+technique+coach', alternatives:['Montées de genoux debout','Mountain climber lent'],
    precaution:'Ralentis si tu perds le gainage ou si les poignets deviennent douloureux.',
    instructions:['Mains sous les épaules','Corps gainé comme en planche','Ramène un genou après l’autre sans faire rebondir le bassin'],
    mistakes:['Bassin trop haut','Dos creusé','Vitesse trop élevée au détriment de la posture'],
  },
  {
    id:'plank', name:'Gainage planche', muscles:['Sangle abdominale','Épaules','Fessiers'], difficulty:'facile',
    video:'https://www.youtube.com/results?search_query=gainage+planche+technique+kine', alternatives:['Gainage sur les genoux','Gainage incliné sur banc'],
    precaution:'Arrête si la douleur se concentre dans le bas du dos plutôt que dans les muscles.',
    instructions:['Coudes sous les épaules','Serre légèrement les fessiers','Garde tête, bassin et talons alignés'],
    mistakes:['Creuser les lombaires','Monter excessivement le bassin','Bloquer la respiration'],
  },
  {
    id:'side-plank', name:'Gainage latéral', muscles:['Obliques','Épaule','Fessiers'], difficulty:'moyen',
    video:'https://www.youtube.com/results?search_query=gainage+lateral+technique+kine', alternatives:['Gainage latéral genoux au sol'],
    precaution:'Version genoux au sol si l’épaule fatigue avant les abdominaux.',
    instructions:['Coude sous l’épaule','Hanches empilées','Pousse le sol et garde le bassin haut'],
    mistakes:['Bassin qui tombe','Épaule écrasée','Rotation du buste vers le sol'],
  },
];

export function findExercise(id?: string) {
  return id ? exercises.find((exercise) => exercise.id === id) : undefined;
}
