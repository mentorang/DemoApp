export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  // Google Gemini / Generative Language API key for development (placeholder).
  // Replace with your key locally. For production use a secret manager or CI secrets.
  geminiApiKey: 'AIzaSyBdHnJhdiVkN3AzN6KyzddkbqmMkSa7ekM',
  // Optional: override the Gemini API URL if needed (leave empty to use SDK/default endpoint).
  geminiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};