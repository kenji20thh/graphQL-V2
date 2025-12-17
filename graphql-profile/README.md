# graphql-profile

Small single-file frontend scaffold for a GraphQL-powered profile page.

Structure:

- `index.html` - entry point
- `assets/styles/` - CSS files (main, login, profile)
- `js/` - ES modules: `main.js`, `config.js`, `auth/`, `api/`, `components/`, `graphs/`

Quick start (static):

Serve the folder `graphql-profile/` with any static server and open `index.html`.

Example using Python 3's built-in server (from project root):
```
python -m http.server 8000 --directory graphql-profile
```

Notes:
- `GRAPHQL_ENDPOINT` in `js/config.js` is a placeholder; set it to your server.
- Authentication and token validation are minimal placeholders; replace with real logic.
