import OpenAI from 'openai';

const getOpenAIKey = () => {
  // For debugging
  console.log('Environment:', {
    processEnv: process.env.REACT_APP_OPENAI_API_KEY?.slice(0, 10),
    windowEnv: window._env_?.REACT_APP_OPENAI_API_KEY?.slice(0, 10),
    localStorage: localStorage.getItem('OPENAI_API_KEY')?.slice(0, 10)
  });

  // Try different ways to access the API key
  const key = 
    process.env.REACT_APP_OPENAI_API_KEY || 
    window._env_?.REACT_APP_OPENAI_API_KEY || 
    localStorage.getItem('OPENAI_API_KEY');

  if (!key) {
    throw new Error('OpenAI API key is not configured');
  }

  return key;
};

const createOpenAIClient = () => {
  const apiKey = getOpenAIKey();
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const sendChatMessage = async (messages, config) => {
  try {
    const openai = createOpenAIClient();

    const systemMessage = {
      role: 'system',
      content: `${config.roleDescription}\n\nInstructions:\n${config.instructions}\n\nExample Q&A:\n${config.exampleQuestions}`
    };

    const allMessages = [
      systemMessage,
      ...messages.filter(m => m.role !== 'system')
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: allMessages,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}; 