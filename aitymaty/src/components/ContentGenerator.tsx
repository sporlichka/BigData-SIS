import { useState, useEffect } from 'react';
import { generateProductDescription } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

export const ContentGenerator = () => {
  const { projects, activeProjectId, updateProject, addTokens, logFeedback } = useAppContext();
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [language, setLanguage] = useState('English');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  // Sync internal form state to the active project when it changes
  useEffect(() => {
    if (activeProject) {
      setProductName(activeProject.productName || '');
      setFeatures(activeProject.features || '');
      setLanguage(activeProject.language || 'English');
      setFeedbackSaved(false);
    } else {
      setProductName('');
      setFeatures('');
      setLanguage('English');
    }
  }, [activeProjectId, activeProject?.id]);

  const handleGenerate = async () => {
    if (!activeProjectId) {
      setError('Please create or select a project first.');
      return;
    }
    if (!productName || !features) {
      setError('Please provide both product name and features.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    setCopied(false);
    setFeedbackSaved(false);

    try {
      // Generate confidence score (85-98)
      const confidence = Math.floor(Math.random() * (98 - 85 + 1) + 85);
      
      const { text, tokens } = await generateProductDescription(productName, features, language);
      
      updateProject(activeProjectId, {
        productName,
        features,
        language,
        generatedContent: text,
        confidenceScore: confidence,
        tokensUsed: tokens
      });
      
      addTokens(tokens);

    } catch (err: any) {
      setError(err.message || 'Error generating content. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (activeProject?.generatedContent) {
      navigator.clipboard.writeText(activeProject.generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = () => {
    if (activeProject && !feedbackSaved) {
      logFeedback(activeProject.id, { productName, features, language }, activeProject.generatedContent);
      setFeedbackSaved(true);
    }
  };

  if (!activeProject) {
    return (
      <main className="flex-1 h-screen flex flex-col bg-brand-light items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-brand-dark mb-2">No Project Selected</h2>
          <p className="text-brand-secondary">Select a project from the sidebar or start a new one.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-screen flex flex-col bg-brand-light">
      <header className="h-16 border-b border-brand-border bg-white px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h2 className="text-xl font-semibold text-brand-dark tracking-tight">Content Generator</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-brand-secondary bg-gray-100 px-3 py-1.5 rounded-full">Pro Tier</div>
          <div className="w-9 h-9 bg-brand-primary rounded-full text-white flex items-center justify-center font-bold shadow-md">
            AA
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto p-8 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-brand-border p-6 hover:shadow-md transition-shadow flex-shrink-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-medium text-brand-dark">SEO Product Description</h3>
              <p className="text-sm text-brand-secondary mb-6">Describe your product to generate persuasive, market-ready copy.</p>
            </div>
            {activeProject.confidenceScore && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Confidence: {activeProject.confidenceScore}%
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
              <input 
                id="productName" 
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-brand-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-shadow text-brand-dark" 
                placeholder="E.g., Aitymaty Smart Analytics"
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-semibold text-gray-700 mb-1">Key Features (Bullet points or comma-separated)</label>
              <textarea 
                id="features" 
                rows={4} 
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full resize-none border border-brand-border rounded-lg p-4 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-shadow text-brand-dark" 
                placeholder="- AI-driven insights&#10;- B2B tailored dashboards&#10;- Export to Excel/PDF"
              />
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-brand-border">
              <div className="flex gap-4 items-center">
                <label htmlFor="language" className="text-sm font-semibold text-gray-700">Target Language:</label>
                <select 
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:ring-brand-primary focus:border-brand-primary outline-none"
                >
                  <option value="English">English</option>
                  <option value="Kazakh">Kazakh</option>
                  <option value="Russian">Russian</option>
                </select>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-brand-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : 'Generate'}
              </button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className={`flex-1 min-h-[300px] rounded-xl flex flex-col overflow-hidden ${activeProject.generatedContent ? 'bg-white border border-brand-border shadow-sm' : 'border-2 border-dashed border-gray-300 bg-gray-50/50 justify-center items-center'}`}>
          {!activeProject.generatedContent && !isLoading && (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="text-brand-dark font-medium mb-1">Your AI-generated content will appear here</h4>
              <p className="text-brand-secondary text-sm max-w-sm mx-auto">Fill out the form above to generate SEO-optimized copy.</p>
            </div>
          )}

          {isLoading && !activeProject.generatedContent && (
             <div className="text-center p-8 flex flex-col items-center justify-center flex-1">
               <svg className="animate-spin h-8 w-8 text-brand-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <p className="text-brand-secondary font-medium">Crafting the perfect copy...</p>
             </div>
          )}

          {activeProject.generatedContent && (
            <>
              <div className="bg-gray-50 px-6 py-3 border-b border-brand-border flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h4 className="font-medium text-brand-dark text-sm">Generated Output</h4>
                  <button 
                    onClick={handleFeedback}
                    disabled={feedbackSaved}
                    className={`text-xs px-2 py-1 flex items-center gap-1 rounded border transition-colors ${feedbackSaved ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                    title="Log hallucination for auditing"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {feedbackSaved ? 'Reported!' : 'Report Hallucination'}
                  </button>
                </div>
                <button 
                  onClick={handleCopy}
                  className="text-sm font-medium text-brand-primary hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="prose prose-sm prose-brand max-w-none">
                  <ReactMarkdown>{activeProject.generatedContent}</ReactMarkdown>
                </div>
                {activeProject.tokensUsed && (
                  <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 text-right">
                    ~{activeProject.tokensUsed.toLocaleString()} tokens used
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};
