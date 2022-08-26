const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';

export const createFetch = async <T = any>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${SERVER_URL}/${url}`, init);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};
