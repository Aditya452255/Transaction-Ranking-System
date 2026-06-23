// Utility to get API URL safely
export const getApiUrl = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  
  if (!baseUrl) {
    console.error('REACT_APP_API_URL environment variable is not set!');
    // Fallback for development
    return 'http://localhost:5000';
  }
  
  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, '');
};
