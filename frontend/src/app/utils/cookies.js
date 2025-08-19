// Set a cookie
export function setCookie(name, value, days) {
  try {
    // Always convert value to string explicitly
    const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    
    document.cookie = `${name}=${strValue}${expires}; path=/`;
  } catch (err) {
    console.error('Error setting cookie:', err);
  }
}

// Get a cookie
export function getCookie(name) {
  try {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
  } catch (err) {
    console.error('Error getting cookie:', err);
  }
  return null;
}

// Delete a cookie
export function deleteCookie(name) {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (err) {
    console.error('Error deleting cookie:', err);
  }
} 