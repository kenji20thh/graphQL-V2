const KEY = 'graphql_profile_token';
export function setToken(token){localStorage.setItem(KEY, token)}
export function getToken(){return localStorage.getItem(KEY)}
export function removeToken(){localStorage.removeItem(KEY)}
export function isAuthenticated(){
  const t = getToken();
  return !!t; // placeholder: implement real validation if needed
}
