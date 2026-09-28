export interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  keyContributions: string[];
  github?: string;
  isLead?: boolean;
}

export const teamWintech: TeamMember[] = [
  {
    id: 'ayush-raj',
    name: 'Ayush Raj',
    role: 'Team Lead & Backend / API Architect',
    focus: 'Node.js & Express.js REST API Development',
    keyContributions: [
      'System architecture, server setup & API routing',
      'Secure user authentication & token management',
      'Cloud deployment pipelines & serverless infrastructure'
    ],
    github: 'https://github.com/wingedayush',
    isLead: true
  },
  {
    id: 'krishna-gupta',
    name: 'Krishna Gupta',
    role: 'Frontend & UI/UX Lead',
    focus: 'React.js & Tailwind CSS Engineering',
    keyContributions: [
      'Responsive, mobile-first user experience design',
      'Interactive heritage discovery dashboards',
      'Client-side state management & backend integration'
    ]
  },
  {
    id: 'anshul',
    name: 'Anshul',
    role: 'AI / LLM & Vernacular Voice Specialist',
    focus: 'LLM Integration, Speech-to-Text & Translation',
    keyContributions: [
      'Conversational cultural AI assistant integration',
      'Vernacular regional language translation pipelines',
      'Audio & speech query processing workflows'
    ]
  },
  {
    id: 'imran-ansari',
    name: 'Imran Ansari',
    role: 'Computer Vision & Media Pipeline Lead',
    focus: 'Image AI & Immersive Media Management',
    keyContributions: [
      'Monument & artifact visual recognition workflows',
      'Asset ingestion & Cloudinary streaming pipelines',
      '360° virtual tour and viewer components'
    ]
  },
  {
    id: 'dristy-srivastava',
    name: 'Dristy Srivastava',
    role: 'Database & Verification Engine Engineer',
    focus: 'Database Schemas & Data Integrity',
    keyContributions: [
      'Schemas for heritage stories, crafts, and monuments',
      'Hybrid data validation pipeline (community vs. verified)',
      'Data security, relational integrity & audit controls'
    ]
  },
  {
    id: 'divyani-gupta',
    name: 'Divyani Gupta',
    role: 'Geo-Spatial, Gamification & Pitch Lead',
    focus: 'Maps Integration, UX Features & Presentation',
    keyContributions: [
      'Geo-spatial mapping for heritage circuits & coordinates',
      'Interactive cultural timelines and gamified quests',
      'Project demonstration, pitch narrative & deck leadership'
    ]
  }
];
