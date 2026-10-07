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

// ──────────────────────────────────────────────────────────────
// Retours du client (retour-reçu-du-client.txt). Tout champ à `null`
// est une information attendue du client : le site affiche « À compléter ».
// ──────────────────────────────────────────────────────────────

/** Statut de l'organigramme : `cible` affiche « Organisation cible proposée ». */
export const orgStatus: 'en-vigueur' | 'cible' | null = null

/** Organigramme validé à télécharger (PDF fourni par le client) et sa date de mise à jour. */
export const orgPdf: { url: string | null; updatedAt: string | null } = {
  url: null,
  updatedAt: null,
}

export interface UnitDetails {
  /** Mission principale : texte du client, repris mot pour mot (un paragraphe par entrée) */
  mission: string[] | null
  responsibilities: string[] | null
  services: string[] | null
  /** Contact fonctionnel (adresse ou téléphone générique de l'unité) */
  contact: { email: string | null; phone: string | null } | null
}

const noContact = null

export const unitDetails: Record<string, UnitDetails> = {
  dsi: { mission: null, responsibilities: null, services: null, contact: noContact },
  architecture: {
    mission: [
      'La Division de l’Architecture, des Études et de l’Intégration contribue à la conception, à la réalisation et à l’évolution des applications métiers.',
      'Il/elle participe aux développements projets dans le respect des délais, des standards de qualité et des exigences de performance, en appliquant les bonnes pratiques de développement.',
    ],
    responsibilities: null,
    services: null,
    contact: noContact,
  },
  innovation: {
    mission: [
      'La Division Innovation Numérique et Projets Stratégiques agit comme catalyseur de la transformation numérique, en structurant l’innovation, en pilotant les projets stratégiques et en diffusant une culture centrée sur l’expérience utilisateur.',
      'Il participe à l’expérimentation, à la mise en œuvre et au suivi des projets innovants en appui aux directions métiers, en veillant à la qualité, à l’efficacité et à l’alignement des solutions numériques avec les objectifs de modernisation de l’administration publique.',
      'Il constitue le cœur du dispositif de pilotage des projets numériques, en assurant la gouvernance, la planification, le suivi opérationnel et l’alignement des initiatives avec la stratégie de modernisation.',
    ],
    responsibilities: null,
    services: null,
    contact: noContact,
  },
  infrastructures: {
    mission: [
      'La Division des Infrastructures, Réseaux et Sécurité contribue à la gestion, à la supervision et à l’évolution des infrastructures numériques du Ministère.',
      'Il participe à l’exploitation quotidienne, au suivi de la performance et à la sécurisation des réseaux, des serveurs, des plateformes et des solutions numériques.',
      'Il joue également un rôle essentiel dans la mise en œuvre des politiques de cybersécurité, la détection des incidents et la maintenance préventive, afin de garantir la continuité et la fiabilité des services numériques.',
    ],
    responsibilities: null,
    services: null,
    contact: noContact,
  },
  services: {
    mission: [
      'La Division Support, Assistance et Expérience Utilisateur participe à la supervision de la disponibilité des plateformes et à la gestion du support fonctionnel et technique des solutions numériques du ministère.',
      'Il veille à fournir une assistance rapide et efficace aux utilisateurs, favorise une assistance de proximité, assure la bonne appropriation des outils digitaux et collecte les retours terrain pour améliorer les solutions déployées.',
      'Il contribue à la documentation des procédures, au suivi des indicateurs de performance et à l’accompagnement des utilisateurs dans leurs usages quotidiens.',
    ],
    responsibilities: null,
    services: null,
    contact: noContact,
  },
  decisionnel: {
    mission: [
      'La Division Informatique Décisionnelle place la donnée au cœur du pilotage stratégique du Ministère, en structurant un dispositif décisionnel permettant d’orienter, mesurer et ajuster les stratégies.',
      'Il conçoit et met en œuvre des architectures et solutions décisionnelles garantissant la fiabilité, la cohérence et la gouvernance des données, afin de transformer l’information en levier d’aide à la décision et de performance institutionnelle.',
      'Il développe des tableaux de bord stratégiques, des indicateurs clés de performance (KPI) et des analyses prospectives permettant d’éclairer les arbitrages, d’optimiser les ressources et de suivre l’impact des actions engagées.',
    ],
    responsibilities: null,
    services: null,
    contact: noContact,
  },
  admin: { mission: null, responsibilities: null, services: null, contact: noContact },
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
    short: 'Innovation Numérique et Projets Stratégiques',
    name: 'Division Innovation Numérique et Projets Stratégiques',
    role: 'Impulse l’innovation, assure la veille technologique et pilote les projets stratégiques de transformation numérique.',
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
    short: 'Support, Assistance et Expérience Utilisateur',
    name: 'Division Support, Assistance et Expérience Utilisateur',
    role: 'Assure l’assistance quotidienne des agents et des usagers et accompagne l’appropriation des outils numériques.',
    layer: 3,
    swatch: '#009454',
    bureaux: [{ name: 'Bureau 01' }, { name: 'Bureau 02' }, { name: 'Bureau 03' }],
  },
  {
    id: 'decisionnel',
    short: 'Informatique décisionnelle',
    name: "Division de l'Informatique décisionnelle",
    role: 'Exploite les données RH pour produire les indicateurs qui éclairent la décision.',
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
    summary: 'Automatiser, numériser et relier les systèmes pour améliorer la productivité et la qualité du service rendu.',
    color: '#009454',
    items: [
      'Automatiser les tâches et numériser les procédures administratives',
      "Bâtir un système d'information intégré, fiable et interopérable",
      "Accélérer la transformation numérique de l'Administration",
    ],
  },
  {
    title: 'Innover',
    icon: 'bulb',
    itemIcons: ['bulb', 'eye', 'eye'],
    art: 'bulb',
    summary: 'Impulser l’innovation numérique dans l’Administration publique et intégrer les nouvelles solutions.',
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
    summary: 'Garantir la qualité, la fiabilité, la sécurité et la conformité des données RH de l’État.',
    color: '#f43438',
    items: [
      'Assurer la gouvernance des données RH de l’État',
      'Garantir la qualité, la fiabilité et la conformité des données du SIRH',
      'Sécuriser les échanges d’information entre les systèmes',
    ],
  },
  {
    title: 'Protéger et maintenir',
    icon: 'shield-check',
    itemIcons: ['shield-check', 'server', 'tool'],
    art: 'lock',
    summary: 'Assurer la disponibilité, la sécurité et la résilience des systèmes, des réseaux et des équipements.',
    color: '#009454',
    items: [
      'Garantir la disponibilité, la sécurité et la résilience des données',
      'Administrer les systèmes, les réseaux informatiques et télécoms, et les bases de données',
      'Assurer la maintenance des solutions informatiques et des équipements',
    ],
  },
  {
    title: 'Accompagner le changement',
    icon: 'school',
    itemIcons: ['school', 'school', 'trending-up'],
    art: 'pawns',
    summary: 'Former, sensibiliser et soutenir les agents et les usagers dans l’usage des outils numériques.',
    color: '#ffcc34',
    items: [
      'Former et sensibiliser les agents et les usagers',
      "Soutenir l'appropriation des outils numériques",
      'Améliorer en continu la qualité du service rendu',
    ],
  },
]

export const results = [
  {
    title: 'La productivité administrative',
    art: 'steps' as ArtKind,
    text: 'Améliorer la productivité des agents par l’automatisation des tâches et la numérisation des procédures administratives.',
  },
  {
    title: 'La qualité du service public',
    art: 'network' as ArtKind,
    text: 'Faire circuler l’information de façon fluide et sécurisée entre les structures du Ministère et les plateformes de l’État, grâce à un système d’information intégré et interopérable.',
  },
  {
    title: 'L’efficience de la transformation numérique',
    art: 'orbit' as ArtKind,
    text: 'Accélérer la transformation numérique de l’Administration publique et améliorer en continu la qualité du service rendu.',
  },
]

export const needs: {
  art: ArtKind
  label: string
  target: string
  unitId: string
  example: string
  fallback?: boolean
}[] = [
  {
    art: 'monitor' as ArtKind,
    label: 'J’ai un problème avec mon poste de travail ou un logiciel',
    target: 'Support, Assistance et Expérience Utilisateur',
    unitId: 'services',
    example: 'Problème de poste de travail, question d’utilisation d’un logiciel',
  },
  {
    art: 'lock' as ArtKind,
    label: 'J’ai un problème de réseau, de serveur ou de sécurité',
    target: 'Infrastructures, Réseaux et Sécurité',
    unitId: 'infrastructures',
    example: 'Panne réseau, incident de sécurité, demande d’accès',
  },
  {
    art: 'steps' as ArtKind,
    label: 'Je souhaite une nouvelle application ou une évolution',
    target: 'Architecture, Études et Intégration',
    unitId: 'architecture',
    example: 'Nouvelle application métier, évolution logicielle',
  },
  {
    art: 'bulb' as ArtKind,
    label: 'J’ai une idée innovante à proposer ou une question sur un projet stratégique',
    target: 'Innovation Numérique et Projets Stratégiques',
    unitId: 'innovation',
    example: 'Proposition d’une idée innovante, question sur un projet numérique en cours',
  },
  {
    art: 'database' as ArtKind,
    label: 'J’ai besoin d’un tableau de bord ou d’indicateurs',
    target: 'Informatique décisionnelle',
    unitId: 'decisionnel',
    example: 'Tableaux de bord, indicateurs de pilotage',
  },
  {
    art: 'sheets' as ArtKind,
    label: 'J’ai une question administrative ou budgétaire sur la DSI',
    target: 'Bureau administratif et financier',
    unitId: 'admin',
    example: 'Budget, aspects administratifs de la Direction',
  },
  {
    art: 'monitor' as ArtKind,
    label: 'Je ne sais pas à qui m’adresser',
    target: 'Support, Assistance et Expérience Utilisateur',
    unitId: 'services',
    example: 'Le support reçoit votre demande et l’oriente vers l’unité compétente.',
    /** Premier point d'entrée en cas de doute (guide d'accueil) */
    fallback: true,
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

// ──────────────────────────────────────────────────────────────
// Réalisations (portfolio) : projets cités par le client. Le contenu de
// chaque fiche est à fournir après accord de la hiérarchie sur ce qui
// peut être rendu public.
// ──────────────────────────────────────────────────────────────
export interface Project {
  name: string
  problem: string | null
  solution: string | null
  audience: string | null
  status: string | null
  impact: string | null
}

const emptyProject = { problem: null, solution: null, audience: null, status: null, impact: null }

export const projects: Project[] = [
  { name: 'GIRAFE', ...emptyProject },
  { name: 'E-carrière', ...emptyProject },
  { name: 'CAP', ...emptyProject },
  { name: 'CRCE', ...emptyProject },
  { name: 'Pointel', ...emptyProject },
  { name: 'Projets d’interopérabilité', ...emptyProject },
]
