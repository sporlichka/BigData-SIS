import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

export const Sidebar = () => {
  const { projects, activeProjectId, setActiveProject, addProject, sessionTokens, hallucinationLogs } = useAppContext();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <aside className="w-64 h-screen bg-brand-dark text-white flex flex-col shadow-lg border-r border-brand-border">
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold tracking-tight text-brand-light">Aitymaty</h1>
        <p className="text-xs text-brand-secondary mt-1 uppercase tracking-wider">Enterprise AI</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-brand-secondary mb-4 uppercase tracking-wider">Project History</h2>
        
        <nav className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No projects yet. Start one!</p>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className={`p-3 rounded-lg transition-colors cursor-pointer border ${activeProjectId === project.id ? 'bg-white/10 border-gray-500' : 'hover:bg-white/5 border-transparent hover:border-gray-600'}`}
              >
                <p className={`text-sm font-medium truncate ${activeProjectId === project.id ? 'text-white' : 'text-gray-400'}`}>
                  {project.productName || project.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(project.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </nav>
      </div>

      {/* Admin Dashboard (Collapsible) */}
      <div className="border-t border-gray-700/50">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsAdminOpen(!isAdminOpen)}
        >
          <span className="text-sm font-semibold text-brand-light tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Admin Dashboard
          </span>
          <svg className={`w-4 h-4 text-brand-secondary transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
        
        {isAdminOpen && (
          <div className="px-4 pb-4 space-y-3 bg-black/20">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Tokens this session:</span>
              <span className="font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded text-blue-300 font-bold">
                {sessionTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Reported Hallucinations:</span>
              <span className="font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded font-bold">
                {hallucinationLogs.length}
              </span>
            </div>
            {hallucinationLogs.length > 0 && (
              <button 
                className="w-full mt-2 text-xs py-1.5 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition"
                onClick={() => console.log('Downloading logs...', JSON.stringify(hallucinationLogs, null, 2))}
              >
                Log to Console
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700/50">
        <button 
          onClick={addProject}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-primary hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <span>+ New Project</span>
        </button>
      </div>
    </aside>
  );
};
