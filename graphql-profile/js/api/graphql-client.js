import { GRAPHQL_ENDPOINT } from '../config.js';

export async function graphql(query, variables = {}){
  const resp = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  return resp.json();
}
