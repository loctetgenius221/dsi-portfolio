// Sources : Articles 111-112 (précision après guide), Guide d'accueil DSI,
// retour-reçu-du-client.txt et Organisation_DSI_Proposition_Site_Web.docx.
// Les intitulés de bureaux (docx, § 4) sont indicatifs et restent à valider.

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
// Organigramme validé par le client (14/10/2026) : plus de mention « Organisation cible proposée ».
export const orgStatus: 'en-vigueur' | 'cible' | null = 'en-vigueur'

/** Organigramme validé à télécharger (PDF fourni par le client) et sa date de mise à jour. */
export const orgPdf: { url: string | null; updatedAt: string | null } = {
  url: null,
  updatedAt: null,
}

export interface UnitDetails {
  /** Mission principale : texte du client, repris mot pour mot (un paragraphe par entrée) */
  mission: string[] | null
  /** Principales attributions : missions (DSI) ou périmètre fonctionnel indicatif (docx, § 2 et § 3) */
  responsibilities: string[] | null
  services: string[] | null
  /** Contact fonctionnel (adresse ou téléphone générique de l'unité) */
  contact: { email: string | null; phone: string | null } | null
}

const noContact = null

export const unitDetails: Record<string, UnitDetails> = {
  dsi: {
    mission: [
      'La DSI a pour mission de concevoir, piloter et sécuriser l’architecture numérique du Ministère afin de renforcer la productivité administrative, la qualité du service public et l’efficience de la transformation numérique.',
    ],
    responsibilities: [
      'Automatiser les tâches et numériser les procédures administratives.',
      'Développer un système d’information intégré, fiable, interopérable et sécurisé.',
      'Contribuer aux stratégies d’innovation numérique et assurer la veille technologique.',
      'Accompagner le changement, la formation et l’appropriation des outils numériques.',
      'Assurer la gouvernance numérique du SIRH.',
      'Garantir la qualité, la sécurité, la disponibilité et la résilience des données et systèmes.',
      'Administrer et maintenir les systèmes, réseaux, télécommunications et équipements.',
      'Contribuer à l’amélioration continue de la qualité des services publics.',
    ],
    services: null,
    contact: noContact,
  },
  architecture: {
    mission: [
      'La Division de l’Architecture, des Études et de l’Intégration contribue à la conception, à la réalisation et à l’évolution des applications métiers.',
      'Il/elle participe aux développements projets dans le respect des délais, des standards de qualité et des exigences de performance, en appliquant les bonnes pratiques de développement.',
    ],
    responsibilities: [
      'Architecture SI',
      'Études',
      'Développement',
      'Intégration',
      'Interopérabilité',
    ],
    services: null,
    contact: noContact,
  },
  innovation: {
    mission: [
      'La Division Innovation Numérique et Projets Stratégiques agit comme catalyseur de la transformation numérique, en structurant l’innovation, en pilotant les projets stratégiques et en diffusant une culture centrée sur l’expérience utilisateur.',
      'Il participe à l’expérimentation, à la mise en œuvre et au suivi des projets innovants en appui aux directions métiers, en veillant à la qualité, à l’efficacité et à l’alignement des solutions numériques avec les objectifs de modernisation de l’administration publique.',
      'Il constitue le cœur du dispositif de pilotage des projets numériques, en assurant la gouvernance, la planification, le suivi opérationnel et l’alignement des initiatives avec la stratégie de modernisation.',
    ],
    responsibilities: [
      'Innovation',
      'Transformation numérique',
      'Portefeuille de projets',
      'Conduite du changement',
    ],
    services: null,
    contact: noContact,
  },
  infrastructures: {
    mission: [
      'La Division des Infrastructures, Réseaux et Sécurité contribue à la gestion, à la supervision et à l’évolution des infrastructures numériques du Ministère.',
      'Il participe à l’exploitation quotidienne, au suivi de la performance et à la sécurisation des réseaux, des serveurs, des plateformes et des solutions numériques.',
      'Il joue également un rôle essentiel dans la mise en œuvre des politiques de cybersécurité, la détection des incidents et la maintenance préventive, afin de garantir la continuité et la fiabilité des services numériques.',
    ],
    responsibilities: [
      'Hébergement',
      'Réseaux & Systèmes',
      'Télécommunications',
      'Cybersécurité',
      'Continuité',
    ],
    services: null,
    contact: noContact,
  },
  services: {
    mission: [
      'La Division Support, Assistance et Expérience Utilisateur participe à la supervision de la disponibilité des plateformes et à la gestion du support fonctionnel et technique des solutions numériques du ministère.',
      'Il veille à fournir une assistance rapide et efficace aux utilisateurs, favorise une assistance de proximité, assure la bonne appropriation des outils digitaux et collecte les retours terrain pour améliorer les solutions déployées.',
      'Il contribue à la documentation des procédures, au suivi des indicateurs de performance et à l’accompagnement des utilisateurs dans leurs usages quotidiens.',
    ],
    responsibilities: [
      'Support',
      'Incidents',
      'Maintenance',
      'Formation',
      'Satisfaction des utilisateurs',
    ],
    services: null,
    contact: noContact,
  },
  decisionnel: {
    mission: [
      'La Division Informatique Décisionnelle place la donnée au cœur du pilotage stratégique du Ministère, en structurant un dispositif décisionnel permettant d’orienter, mesurer et ajuster les stratégies.',
      'Il conçoit et met en œuvre des architectures et solutions décisionnelles garantissant la fiabilité, la cohérence et la gouvernance des données, afin de transformer l’information en levier d’aide à la décision et de performance institutionnelle.',
      'Il développe des tableaux de bord stratégiques, des indicateurs clés de performance (KPI) et des analyses prospectives permettant d’éclairer les arbitrages, d’optimiser les ressources et de suivre l’impact des actions engagées.',
    ],
    responsibilities: [
      'Gouvernance et qualité des données',
      'Analyses',
      'Indicateurs',
      'Tableaux de bord',
    ],
    services: null,
    contact: noContact,
  },
  admin: {
    mission: null,
    responsibilities: ['Gestion administrative', 'Budget', 'Logistique et moyens'],
    services: null,
    contact: noContact,
  },
}

// Ordre du texte organique (article 112)
export const divisions: Division[] = [
  {
    id: 'architecture',
    short: 'Architecture, Études et Intégration',
    name: 'Division de l’Architecture, des Études et de l’Intégration',
    role: "Conçoit, développe et intègre les solutions et applications numériques du Ministère dans un système d'information cohérent.",
    layer: 2,
    swatch: '#f43438',
    bureaux: [
      { name: 'Architecture et Études', provisional: true },
      { name: 'Développement et Intégration', provisional: true },
      { name: 'Interopérabilité', provisional: true },
    ],
  },
  {
    id: 'innovation',
    short: 'Innovation Numérique et PMO',
    name: 'Division Innovation Numérique et PMO',
    role: 'Impulse l’innovation, assure la veille technologique et pilote les projets stratégiques de transformation numérique.',
    layer: 4,
    swatch: '#ffcc34',
    darkText: true,
    bureaux: [
      { name: 'Innovation et Transformation numérique', provisional: true },
      { name: 'Gestion et Suivi des projets', provisional: true },
      { name: 'Conduite du changement', provisional: true },
    ],
  },
  {
    id: 'infrastructures',
    short: 'Infrastructures, Réseaux et Sécurité',
    name: 'Division des Infrastructures, Réseaux et Sécurité',
    role: 'Administre réseaux, serveurs et infrastructures, et garantit la disponibilité, la sécurité et la résilience des données.',
    layer: 0,
    swatch: '#009454',
    bureaux: [
      { name: 'Systèmes et Hébergement', provisional: true },
      { name: 'Réseaux et Télécommunications', provisional: true },
      { name: 'Cybersécurité', provisional: true },
    ],
  },
  {
    id: 'services',
    short: 'Services numériques et Supports aux Utilisateurs',
    name: 'Division des Services numériques et Supports aux Utilisateurs',
    role: 'Assure l’assistance quotidienne des agents et des usagers et accompagne l’appropriation des outils numériques.',
    layer: 3,
    swatch: '#009454',
    bureaux: [
      { name: 'Assistance et Support', provisional: true },
      { name: 'Maintenance informatique', provisional: true },
      { name: 'Formation et Accompagnement', provisional: true },
    ],
  },
  {
    id: 'decisionnel',
    short: 'Informatique Décisionnelle',
    name: 'Division Informatique Décisionnelle',
    role: 'Exploite les données RH pour produire les indicateurs qui éclairent la décision.',
    layer: 1,
    swatch: '#ffcc34',
    darkText: true,
    bureaux: [
      { name: 'Gouvernance et Qualité des données', provisional: true },
      { name: 'Analyse décisionnelle', provisional: true },
      { name: 'Statistiques et Tableaux de bord', provisional: true },
    ],
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
    summary:
      'Automatiser, numériser et relier les systèmes pour améliorer la productivité et la qualité du service rendu.',
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
    summary:
      'Impulser l’innovation numérique dans l’Administration publique et intégrer les nouvelles solutions.',
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
    summary:
      'Garantir la qualité, la fiabilité, la sécurité et la conformité des données RH de l’État.',
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
    summary:
      'Assurer la disponibilité, la sécurité et la résilience des systèmes, des réseaux et des équipements.',
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
    summary:
      'Former, sensibiliser et soutenir les agents et les usagers dans l’usage des outils numériques.',
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
    target: 'Services numériques et Supports aux Utilisateurs',
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
    target: 'Innovation Numérique et PMO',
    unitId: 'innovation',
    example: 'Proposition d’une idée innovante, question sur un projet numérique en cours',
  },
  {
    art: 'database' as ArtKind,
    label: 'J’ai besoin d’un tableau de bord ou d’indicateurs',
    target: 'Informatique Décisionnelle',
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
    target: 'Services numériques et Supports aux Utilisateurs',
    unitId: 'services',
    example: 'Le support reçoit votre demande et l’oriente vers l’unité compétente.',
    /** Premier point d'entrée en cas de doute (guide d'accueil) */
    fallback: true,
  },
]

// ──────────────────────────────────────────────────────────────
// Responsables : noms transmis par le client (14/10/2026). `name: null` = à compléter.
// Sécurité : on ne publie ni courriel ni ligne directe nominatifs ; les
// coordonnées passent par le contact fonctionnel de chaque unité (unitDetails).
// Photo : uniquement une photo officielle, avec l'accord préalable de la personne
// (à placer dans /public/images/responsables/ puis à renseigner dans `photo`).
// ──────────────────────────────────────────────────────────────
export interface Person {
  /** Prénom et nom ; `null` tant que l'information n'est pas fournie */
  name: string | null
  /** Intitulé court, affiché sur l'organigramme */
  title: string
  photo?: string
}

export const heads: Record<string, Person> = {
  dsi: { name: 'Serigne Mansour FAYE', title: 'Directeur' },
  architecture: { name: 'Issa CISSE', title: 'Chef de division' },
  innovation: { name: 'Pape Wally DIOUF', title: 'Chef de division' },
  infrastructures: { name: 'Diégane DIAGNE', title: 'Chef de division' },
  services: { name: 'Mamadou Nana SARR', title: 'Chef de division' },
  decisionnel: { name: null, title: 'Chef de division' },
  admin: { name: 'Sona SABALY', title: 'Responsable du bureau' },
}

// ──────────────────────────────────────────────────────────────
// Réalisations (portfolio) : projets cités par le client. Le contenu de
// chaque fiche est à fournir après accord de la hiérarchie sur ce qui
// peut être rendu public. Statuts et chiffres : uniquement après vérification
// par les équipes projet (docx, § 6).
// ──────────────────────────────────────────────────────────────
export interface Project {
  name: string
  /** Description courte du projet (docx, § 6) */
  summary: string | null
  problem: string | null
  solution: string | null
  audience: string | null
  status: string | null
  impact: string | null
  /** Plateforme officielle accessible au public, s'il y en a une */
  link?: { label: string; url: string }
  /** Logo de l'application ; à défaut, le logo officiel du Ministère est affiché */
  logo?: string
}

/** Logo officiel du Ministère, affiché pour les projets sans logo propre */
export const MINISTRY_LOGO = '/images/logos/ministere.png'

const emptyProject = { problem: null, solution: null, audience: null, status: null, impact: null }

export const projects: Project[] = [
  {
    // Sources publiques (à faire valider par l'équipe projet) :
    // osiris.sn/Ce-qui-va-changer-avec-GIRAFE-2.html et osiris.sn (lancement, 2017).
    name: 'GIRAFE',
    summary: 'Gestion intégrée des ressources humaines de l’État.',
    ...emptyProject,
    problem: 'Des procédures de gestion du personnel de l’État longues et largement traitées sur papier.',
    solution:
      'Une plateforme de gestion intégrée qui dématérialise les procédures de gestion du personnel. Sa deuxième version permet aux agents de suivre l’évolution de leur carrière et de signaler une erreur sur leur situation administrative.',
    audience: 'Agents de l’État et services chargés de la gestion du personnel.',
  },
  {
    // Sources publiques (à faire valider par l'équipe projet) :
    // fonctionpublique.gouv.sn (rubrique E-services) et fr.allafrica.com/stories/202412110577.html.
    name: 'E-carrière',
    summary: 'Services numériques et suivi de carrière pour les agents.',
    ...emptyProject,
    problem:
      'Pour connaître l’état de leur dossier, de nombreux agents devaient se déplacer jusqu’aux services du Ministère, parfois depuis les régions.',
    solution:
      'Une plateforme en ligne qui permet aux agents de suivre l’avancement des projets d’actes qui les concernent, depuis un ordinateur ou un téléphone.',
    audience: 'Agents de l’État.',
    link: { label: 'Accéder à E-carrière', url: 'https://e-carriere.sec.gouv.sn/' },
    logo: '/images/logos/e-carriere.png',
  },
  {
    name: 'CAP',
    summary: 'Dématérialisation des procédures des commissions administratives paritaires.',
    ...emptyProject,
    logo: '/images/logos/cap.png',
  },
  {
    name: 'CRCE',
    summary: 'Numérisation des processus de recrutement des contractuels de l’enseignement.',
    ...emptyProject,
  },
  {
    name: 'Pointel FP',
    summary: 'Gestion numérique du pointage et des présences.',
    ...emptyProject,
  },
  {
    name: 'Projets d’interopérabilité',
    summary: 'Échanges sécurisés de données entre systèmes et administrations.',
    ...emptyProject,
  },
]
