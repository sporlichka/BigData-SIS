export const generateProductDescription = async (
  productName: string,
  features: string,
  language: string
): Promise<{ text: string, tokens: number }> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const prompt = `You are an expert SEO copywriter for Central Asian marketplaces. Write a professional, persuasive description for ${productName} based on the following features: ${features} in ${language}.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";
    
    // Gemini returns token count in usageMetadata.totalTokenCount
    const apiTokens = data.usageMetadata?.totalTokenCount;
    const fallbackTokens = Math.ceil((prompt.length + text.length) / 4);
    
    return { 
      text, 
      tokens: apiTokens || fallbackTokens 
    };
  } catch (error: any) {
    console.error("Error generating content:", error);
    throw new Error(error.message || "An unexpected error occurred while communicating with the Gemini API.");
  }
};
