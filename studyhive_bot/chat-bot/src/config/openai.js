// Temporary test - remove in production!
export const API_KEY = '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';
export const API_URL = 'http://localhost:5000/api/chat';

// Add test function to verify API
export const testAPI = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173/',
        'X-Title': 'StudyHive'
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: "Hello!"
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Test API Response:', data);
    return data;
  } catch (error) {
    console.error('Test API Error:', error);
    return null;
  }
};

// Add some validation
if (!API_KEY) {
  console.error('OpenRouter API key is not set. Please check your .env file.');
}

// Log the API configuration (remove in production)
console.log('API Configuration:', {
  url: API_URL,
  keyExists: !!API_KEY,
  keyFirstChars: API_KEY ? `${API_KEY.substring(0, 8)}...` : 'not set'
}); 