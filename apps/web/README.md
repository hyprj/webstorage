# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Running the web app

Run the web app with Mock Service Worker and in-memory data:

```sh
pnpm run dev
```

This uses the `mock` Vite mode and sets `VITE_USE_MSW=true`. Mock data is reset
when the page is reloaded, and the API container is not required.

Run the web app against the backend API:

```sh
pnpm run proxy
```

This uses the `proxy` Vite mode and sets `VITE_USE_MSW=false`. Requests are sent
to the configured API at `http://localhost:3001`, as before.

The mode-specific environment files are [`.env.mock`](./.env.mock) and
[`.env.proxy`](./.env.proxy). Production builds do not enable MSW.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
