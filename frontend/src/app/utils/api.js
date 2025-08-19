export async function fetchWithAuth(url, options = {}) {
  // Ensure credentials are included
  const fetchOptions = {
    ...options,
    credentials: 'include',
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.error('API error:', response.status);
      throw new Error(`API error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
} 