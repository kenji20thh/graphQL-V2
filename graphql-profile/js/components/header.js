import { removeToken } from '../auth/token-manager.js';

export function createHeader(name){
  const el = document.createElement('div');
  el.className = 'profile-header card';
  el.innerHTML = `<div><strong>${name}</strong></div><div><button id="logout" class="btn">Logout</button></div>`;
  el.querySelector('#logout').addEventListener('click', ()=>{ removeToken(); window.location.reload(); });
  return el;
}
