import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'UNIWA eClass Helper',
    description: 'Auto-login, session keep-alive, and UX tweaks for eclass.uniwa.gr',
    permissions: ['storage', 'alarms'],
    host_permissions: ['https://eclass.uniwa.gr/*'],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
  },
});
