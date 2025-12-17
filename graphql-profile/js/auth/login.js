import { graphql } from '../api/graphql-client.js';
import { setToken } from './token-manager.js';

export function renderLogin(target){
  target.innerHTML = `
    <div class="login-wrap">
      <div class="login-box card">
        <h1>Sign in</h1>
        <div class="field"><input id="email" placeholder="Email" /></div>
        <div class="field"><input id="password" type="password" placeholder="Password" /></div>
        <div><button id="loginBtn" class="btn">Sign in</button></div>
      </div>
    </div>
  `;

  document.getElementById('loginBtn').addEventListener('click', async ()=>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Placeholder mutation - replace with actual API contract
    const mutation = `mutation Login($email:String!, $password:String!){ login(email:$email,password:$password){ token } }`;
    const res = await graphql(mutation,{email,password});
    const token = res?.data?.login?.token;
    if(token){ setToken(token); window.location.reload(); }
    else alert('Login failed (placeholder)');
  });
}
