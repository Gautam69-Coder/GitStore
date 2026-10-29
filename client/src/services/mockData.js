export const mockUser = {
  id: 1048291,
  login: 'gautamdoliya',
  name: 'Gautam Doliya',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Full Stack Developer & Open Source Contributor. Building modern web experiences.',
  html_url: 'https://github.com/gautamdoliya',
  public_repos: 4,
  total_private_repos: 8,
  followers: 48,
  following: 32,
  created_at: '2022-01-15T00:00:00Z'
};

export const mockStats = {
  totalRepos: 12,
  privateRepos: 8,
  publicRepos: 4,
  totalStars: 47,
  totalForks: 12
};

export const mockRepositories = [
  {
    id: 101,
    name: 'student-hub',
    full_name: 'gautamdoliya/student-hub',
    owner: { login: 'gautamdoliya', avatar_url: mockUser.avatar_url },
    private: true,
    html_url: 'https://github.com/gautamdoliya/student-hub',
    description: 'Student management platform with notes, practicals and more.',
    fork: false,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2 hours ago',
    pushed_at: '2024-03-20T14:30:00Z',
    stargazers_count: 12,
    forks_count: 3,
    default_branch: 'main',
    language: 'JavaScript',
    size: 2450
  },
  {
    id: 102,
    name: 'furniture-store',
    full_name: 'gautamdoliya/furniture-store',
    owner: { login: 'gautamdoliya', avatar_url: mockUser.avatar_url },
    private: false,
    html_url: 'https://github.com/gautamdoliya/furniture-store',
    description: 'E-commerce website for furniture store.',
    fork: false,
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '1 day ago',
    pushed_at: '2024-03-19T11:00:00Z',
    stargazers_count: 8,
    forks_count: 2,
    default_branch: 'main',
    language: 'TypeScript',
    size: 4810
  },
  {
    id: 103,
    name: 'ai-assistant',
    full_name: 'gautamdoliya/ai-assistant',
    owner: { login: 'gautamdoliya', avatar_url: mockUser.avatar_url },
    private: true,
    html_url: 'https://github.com/gautamdoliya/ai-assistant',
    description: 'AI assistant with RAG and memory system.',
    fork: false,
    created_at: '2024-02-14T16:00:00Z',
    updated_at: '2 days ago',
    pushed_at: '2024-03-18T08:45:00Z',
    stargazers_count: 5,
    forks_count: 1,
    default_branch: 'main',
    language: 'Python',
    size: 1980
  },
  {
    id: 104,
    name: 'portfolio-website',
    full_name: 'gautamdoliya/portfolio-website',
    owner: { login: 'gautamdoliya', avatar_url: mockUser.avatar_url },
    private: false,
    html_url: 'https://github.com/gautamdoliya/portfolio-website',
    description: 'My personal portfolio website.',
    fork: false,
    created_at: '2023-11-20T12:00:00Z',
    updated_at: '3 days ago',
    pushed_at: '2024-03-17T17:20:00Z',
    stargazers_count: 15,
    forks_count: 4,
    default_branch: 'main',
    language: 'React',
    size: 3200
  },
  {
    id: 105,
    name: 'notes-app',
    full_name: 'gautamdoliya/notes-app',
    owner: { login: 'gautamdoliya', avatar_url: mockUser.avatar_url },
    private: true,
    html_url: 'https://github.com/gautamdoliya/notes-app',
    description: 'Simple notes app with markdown support.',
    fork: false,
    created_at: '2024-01-05T14:00:00Z',
    updated_at: '5 days ago',
    pushed_at: '2024-03-15T09:30:00Z',
    stargazers_count: 7,
    forks_count: 2,
    default_branch: 'main',
    language: 'JavaScript',
    size: 1120
  }
];

export const mockActivities = [
  {
    id: 'act-1',
    type: 'push',
    iconColor: 'green',
    title: 'You pushed to',
    target: 'student-hub',
    time: '2 hours ago',
    details: 'commit: "fix: update student table responsive layout"'
  },
  {
    id: 'act-2',
    type: 'create',
    iconColor: 'orange',
    title: 'Repository created',
    target: 'furniture-store',
    time: '1 day ago',
    details: 'Initial commit & README'
  },
  {
    id: 'act-3',
    type: 'push',
    iconColor: 'blue',
    title: 'You pushed to',
    target: 'ai-assistant',
    time: '2 days ago',
    details: 'feat: add vector embeddings integration'
  },
  {
    id: 'act-4',
    type: 'upload',
    iconColor: 'purple',
    title: 'File uploaded',
    target: 'notes.md in notes-app',
    time: '3 days ago',
    details: 'Upload markdown documentation'
  },
  {
    id: 'act-5',
    type: 'star',
    iconColor: 'yellow',
    title: 'You starred',
    target: 'portfolio-website',
    time: '5 days ago',
    details: 'Added to your favorites'
  }
];

export const mockRepoFileTree = {
  'student-hub': [
    { name: 'src', path: 'src', type: 'dir', size: 0 },
    { name: 'public', path: 'public', type: 'dir', size: 0 },
    { name: '.gitignore', path: '.gitignore', type: 'file', size: 312, sha: 'f93d1', content: 'node_modules\n.env\ndist\n' },
    { name: 'package.json', path: 'package.json', type: 'file', size: 840, sha: 'a87b2', content: '{\n  "name": "student-hub",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  }\n}' },
    { name: 'README.md', path: 'README.md', type: 'file', size: 1250, sha: 'e45c9', content: '# Student Hub\n\nStudent management platform with notes, practicals, attendance tracker, and grade calculators.\n\n## Features\n- 📚 Centralized course notes\n- 📝 Lab practical guides\n- 📊 Attendance calculation\n- ⚡ Built with React & Node.js\n\n## Getting Started\n```bash\nnpm install\nnpm run dev\n```\n' }
  ],
  'student-hub/src': [
    { name: 'components', path: 'src/components', type: 'dir', size: 0 },
    { name: 'App.jsx', path: 'src/App.jsx', type: 'file', size: 620, sha: 'd19c3', content: 'import React from "react";\n\nexport default function App() {\n  return (\n    <div className="min-h-screen p-8 bg-slate-50">\n      <h1 className="text-3xl font-bold text-slate-900">Student Hub Dashboard</h1>\n      <p className="mt-2 text-slate-600">Welcome to your academic portal.</p>\n    </div>\n  );\n}' },
    { name: 'index.css', path: 'src/index.css', type: 'file', size: 450, sha: 'b82a7', content: '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' },
    { name: 'main.jsx', path: 'src/main.jsx', type: 'file', size: 280, sha: 'c74f5', content: 'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./index.css";\n\nReactDOM.createRoot(document.getElementById("root")).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);' }
  ]
};
