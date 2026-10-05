// Source : Article 111-112 (précision après guide) + Guide d'accueil DSI.
// Les intitulés de bureaux marqués `provisional` sont à confirmer par la DSI :
// seul leur nombre est donné dans la source (3 pour l'Architecture, 2 pour l'Innovation).

export interface Bureau {
  name: string
  provisional?: boolean
}

export interface Division {
  id: string
  short: string
  name: string
  role: string
  /** Couche dans la vue éclatée (0 = socle) */
  layer: number
  /** Couleur de la couche */
  swatch: string
  /** Texte sombre requis sur cette couleur */
  darkText?: boolean
  bureaux: Bureau[]
}

// Ordre du texte organique (article 112)
export const divisions: Division[] = [
  {
    id: 'architecture',
    short: 'Architecture, Études et Intégration',
    name: "Division de l'Architecture, des Études et de l'Intégration",
    role: "Conçoit, développe et intègre les solutions et applications numériques du Ministère dans un système d'information cohérent.",
    layer: 2,
    swatch: '#f43438',
    bureaux: [
      { name: 'Bureau des Études', provisional: true },
      { name: 'Bureau du Développement', provisional: true },
      { name: "Bureau de l'Intégration", provisional: true },
    ],
  },
  {
    id: 'innovation',
    short: 'Innovation numérique',
    name: "Division de l'Innovation numérique",
    role: 'Impulse l’innovation, assure la veille technologique et pilote les projets stratégiques de transformation digitale.',
    layer: 4,
    swatch: '#ffcc34',
    darkText: true,
    bureaux: [
      { name: 'Bureau de la Veille et de l’Innovation', provisional: true },
      { name: 'Bureau du Pilotage des Projets', provisional: true },
    ],
  },
  {
    id: 'infrastructures',
    short: 'Infrastructures, Réseaux et Sécurité',
    name: 'Division des Infrastructures, Réseaux et Sécurité',
    role: 'Administre réseaux, serveurs et infrastructures, et garantit la disponibilité, la sécurité et la résilience des données.',
    layer: 0,
    swatch: '#009454',
    bureaux: [{ name: 'Bureau 01' }, { name: 'Bureau 02' }, { name: 'Bureau 03' }],
  },
  {
    id: 'services',
    short: 'Services numériques et Supports aux Utilisateurs',
    name: 'Division des Services numériques et Supports aux Utilisateurs',
    role: 'Assure l’assistance quotidienne des agents et des usagers et accompagne l’appropriation des outils numériques.',
    layer: 3,
    swatch: '#009454',
    bureaux: [{ name: 'Bureau 01' }, { name: 'Bureau 02' }, { name: 'Bureau 03' }],
  },
  {
    id: 'decisionnel',
    short: 'Informatique décisionnelle',
    name: "Division de l'Informatique décisionnelle",
    role: 'Exploite la base de données consolidée des agents de l’État et les données RH pour éclairer la décision.',
    layer: 1,
    swatch: '#ffcc34',
    darkText: true,
    bureaux: [{ name: 'Bureau 01' }],
  },
]

export const adminBureau = {
  id: 'admin',
  short: 'Bureau administratif et financier',
  role: 'Gère les aspects administratifs, budgétaires et financiers de la Direction.',
}

export type ArtKind =
  'steps' | 'network' | 'orbit' | 'monitor' | 'bulb' | 'database' | 'lock' | 'pawns' | 'sheets'

export interface MissionGroup {
  title: string
  summary: string
  color: string
  art: ArtKind
  /** Icône Tabler du domaine, puis une icône par mission (même ordre que `items`) */
  icon: string
  itemIcons: string[]
  items: string[]
}

export const missionGroups: MissionGroup[] = [
  {
    title: 'Simplifier le service public',
    icon: 'bolt',
    itemIcons: ['bolt', 'arrows-exchange', 'trending-up'],
    art: 'monitor',
    summary: 'Moins de papier, plus de rapidité pour les agents comme pour les usagers.',
    color: '#009454',
    items: [
      'Automatiser les tâches et digitaliser les procédures administratives',
      "Bâtir un système d'information intégré, fiable et interopérable",
      "Accélérer la transformation numérique de l'Administration",
    ],
  },
  {
    title: 'Innover',
    icon: 'bulb',
    itemIcons: ['bulb', 'eye', 'eye'],
    art: 'bulb',
    summary: 'Regarder devant et choisir ce qui vaut la peine d’être adopté.',
    color: '#ffcc34',
    items: [
      "Élaborer et mettre en œuvre la stratégie d'innovation numérique",
      'Assurer une veille technologique continue',
      'Intégrer les nouvelles solutions numériques',
    ],
  },
  {
    title: 'Gouverner les données RH',
    icon: 'database',
    itemIcons: ['database', 'clipboard-check', 'shield-check'],
    art: 'database',
    summary: 'Une base fiable des agents de l’État et un SIRH maîtrisé.',
    color: '#f43438',
    items: [
      "Piloter la base de données consolidée des agents de l'État",
      'Garantir la qualité, la fiabilité et la conformité des données du SIRH',
      'Sécuriser les échanges entre systèmes',
    ],
  },
  {
    title: 'Protéger et maintenir',
    icon: 'shield-check',
    itemIcons: ['shield-check', 'server', 'tool'],
    art: 'lock',
    summary: 'Des systèmes disponibles, sûrs et entretenus.',
    color: '#009454',
    items: [
      'Garantir disponibilité, sécurité et résilience des données',
      'Administrer systèmes, réseaux, télécoms et bases de données',
      'Maintenir solutions informatiques et équipements',
    ],
  },
  {
    title: 'Accompagner le changement',
    icon: 'school',
    itemIcons: ['school', 'school', 'trending-up'],
    art: 'pawns',
    summary: 'Un outil n’a de valeur que s’il est utilisé.',
    color: '#ffcc34',
    items: [
      'Former et sensibiliser agents et usagers',
      "Soutenir l'appropriation des outils numériques",
      'Améliorer en continu la qualité du service rendu',
    ],
  },
]

export const results = [
  {
    title: 'La productivité administrative',
    art: 'steps' as ArtKind,
    text: 'Automatiser les tâches et digitaliser les procédures, pour que les agents se concentrent sur l’essentiel.',
  },
  {
    title: 'La qualité du service public',
    art: 'network' as ArtKind,
    text: 'Une information qui circule de façon fluide et sécurisée entre les structures du Ministère et les plateformes de l’État.',
  },
  {
    title: 'L’efficience de la transformation numérique',
    art: 'orbit' as ArtKind,
    text: 'Une veille continue et des solutions nouvelles intégrées avec méthode.',
  },
]

export const needs = [
  {
    art: 'monitor' as ArtKind,
    label: 'Mon poste de travail ou un logiciel pose problème',
    target: 'Services numériques et Supports aux Utilisateurs',
    unitId: 'services',
    example: 'Panne de poste, question d’utilisation d’un logiciel',
  },
  {
    art: 'lock' as ArtKind,
    label: 'Le réseau, un serveur ou la sécurité pose problème',
    target: 'Infrastructures, Réseaux et Sécurité',
    unitId: 'infrastructures',
    example: 'Panne réseau, incident de sécurité, accès à un serveur',
  },
  {
    art: 'steps' as ArtKind,
    label: 'Je veux une nouvelle application ou une évolution',
    target: 'Architecture, Études et Intégration',
    unitId: 'architecture',
    example: 'Application métier, évolution logicielle',
  },
  {
    art: 'bulb' as ArtKind,
    label: 'J’ai une idée innovante ou une question sur un projet',
    target: 'Innovation numérique',
    unitId: 'innovation',
    example: 'Proposition, suivi d’un projet numérique en cours',
  },
  {
    art: 'database' as ArtKind,
    label: 'Il me faut des indicateurs ou des données RH',
    target: 'Informatique décisionnelle',
    unitId: 'decisionnel',
    example: 'Tableaux de bord, données consolidées des agents',
  },
  {
    art: 'sheets' as ArtKind,
    label: 'J’ai une question administrative ou budgétaire',
    target: 'Bureau administratif et financier',
    unitId: 'admin',
    example: 'Budget, aspects administratifs de la Direction',
  },
]

// ──────────────────────────────────────────────────────────────
// Responsables et coordonnées : DONNÉES FICTIVES, à remplacer par les
// informations réelles. Pour afficher une vraie photo, renseigner `photo`
// (ex. '/images/responsables/aminata-diop.jpg').
// ──────────────────────────────────────────────────────────────
export interface Person {
  name: string
  /** Intitulé court, affiché sur l'organigramme */
  title: string
  email: string
  phone: string
  photo?: string
}

export const heads: Record<string, Person> = {
  dsi: {
    name: 'Ousmane Diallo',
    title: 'Directeur',
    email: 'ousmane.diallo@dsi.exemple.sn',
    phone: '+221 33 000 00 01',
    photo: '/images/responsables/ousmane-diallo.jpg',
  },
  architecture: {
    name: 'Aminata Diop',
    title: 'Cheffe de division',
    email: 'aminata.diop@dsi.exemple.sn',
    phone: '+221 33 000 00 11',
    photo: '/images/responsables/aminata-diop.jpg',
  },
  innovation: {
    name: 'Moussa Ndiaye',
    title: 'Chef de division',
    email: 'moussa.ndiaye@dsi.exemple.sn',
    phone: '+221 33 000 00 12',
    photo: '/images/responsables/moussa-ndiaye.jpg',
  },
  infrastructures: {
    name: 'Cheikh Fall',
    title: 'Chef de division',
    email: 'cheikh.fall@dsi.exemple.sn',
    phone: '+221 33 000 00 13',
    photo: '/images/responsables/cheikh-fall.jpg',
  },
  services: {
    name: 'Fatou Sow',
    title: 'Cheffe de division',
    email: 'fatou.sow@dsi.exemple.sn',
    phone: '+221 33 000 00 14',
    photo: '/images/responsables/fatou-sow.jpg',
  },
  decisionnel: {
    name: 'Ibrahima Sarr',
    title: 'Chef de division',
    email: 'ibrahima.sarr@dsi.exemple.sn',
    phone: '+221 33 000 00 15',
    photo: '/images/responsables/ibrahima-sarr.jpg',
  },
  admin: {
    name: 'Awa Ba',
    title: 'Cheffe de bureau',
    email: 'awa.ba@dsi.exemple.sn',
    phone: '+221 33 000 00 16',
    photo: '/images/responsables/awa-ba.jpg',
  },
}
