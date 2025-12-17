import { GRAPHQL_ENDPOINT } from '../config.js';
import { getToken } from '../auth/token-manager.js';

/**
 * Execute a GraphQL query or mutation
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Query variables (optional)
 * @returns {Promise<Object>} - GraphQL response data
 * @throws {Error} - If request fails or token is missing
 */
export async function graphql(query, variables = {}) {
  // Get JWT token
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }
  
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // ✅ BEARER TOKEN REQUIRED!
      },
      body: JSON.stringify({ 
        query, 
        variables 
      })
    });
    
    // Check if response is OK
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden.');
      } else {
        throw new Error(`GraphQL request failed with status: ${response.status}`);
      }
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response type. Expected JSON.');
    }
    
    // Parse JSON response
    const result = await response.json();
    
    // Check for GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0].message || 'GraphQL query failed');
    }
    
    return result;
    
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
}

/**
 * Execute multiple GraphQL queries in parallel
 * @param {Array<{query: string, variables?: Object}>} queries - Array of query objects
 * @returns {Promise<Array>} - Array of results
 */
export async function graphqlBatch(queries) {
  try {
    const promises = queries.map(({ query, variables }) => 
      graphql(query, variables)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch GraphQL request failed:', error);
    throw error;
  }
}