import { isAuthenticated } from './auth/token-manager.js';
import { renderLogin } from './auth/login.js';
import { graphql } from './api/graphql-client.js';
import { GET_PROFILE } from './api/queries.js';
import { renderProfile } from './components/profile.js';

const app = document.getElementById('app');
app.className = 'container';

async function boot(){
  if(!isAuthenticated()){
    renderLogin(app);
    return;
  }

  // fetch profile (placeholder)
  try{
    const res = await graphql(GET_PROFILE);
    const profile = res?.data?.me || { name: 'Unknown', email: '', xp:0, projects:[] };
    renderProfile(app, profile);
  }catch(e){
    console.error(e);
    app.innerHTML = '<div class="card">Failed to load profile.</div>';
  }
}

boot();
