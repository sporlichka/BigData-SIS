import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  date: string;
  productName: string;
  features: string;
  language: string;
  generatedContent: string;
  confidenceScore?: number;
  tokensUsed?: number;
}

export interface FeedbackLog {
  id: string;
  projectId: string;
  timestamp: string;
  input: {
    productName: string;
    features: string;
    language: string;
  };
  output: string;
  status: 'Reported';
}

interface AppContextType {
  projects: Project[];
  activeProjectId: string | null;
  addProject: () => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setActiveProject: (id: string) => void;
  sessionTokens: number;
  addTokens: (tokens: number) => void;
  hallucinationLogs: FeedbackLog[];
  logFeedback: (projectId: string, input: any, output: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [sessionTokens, setSessionTokens] = useState<number>(0);
  const [hallucinationLogs, setHallucinationLogs] = useState<FeedbackLog[]>([]);

  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Project',
      date: new Date().toISOString(),
      productName: '',
      features: '',
      language: 'English',
      generatedContent: '',
    };
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const setActiveProject = (id: string) => {
    setActiveProjectId(id);
  };

  const addTokens = (tokens: number) => {
    setSessionTokens(prev => prev + tokens);
  };

  const logFeedback = (projectId: string, input: any, output: string) => {
    const newLog: FeedbackLog = {
      id: Math.random().toString(36).substr(2, 9),
      projectId,
      timestamp: new Date().toISOString(),
      input,
      output,
      status: 'Reported',
    };
    setHallucinationLogs([newLog, ...hallucinationLogs]);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        activeProjectId,
        addProject,
        updateProject,
        setActiveProject,
        sessionTokens,
        addTokens,
        hallucinationLogs,
        logFeedback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
