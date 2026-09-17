/**
 * PM2 process file for a single-server (e.g. Contabo VPS) deployment.
 *
 *   pm2 start deploy/ecosystem.config.cjs --env production
 *   pm2 save            # persist across reboots (after `pm2 startup`)
 *
 * Paths assume the repository is checked out at /var/www/nexora. Adjust `cwd`
 * to wherever it actually lives. Secrets are NOT set here: the API reads
 * backend/.env, and the frontend's NEXT_PUBLIC_* values are baked in at
 * `npm run build` time from frontend/.env.production.
 *
 * Before starting, check `pm2 ls` for an existing process with the same name
 * so a second copy is not created.
 */
module.exports = {
  apps: [
    {
      name: "nexora-api",
      cwd: "/var/www/nexora/backend",
      script: "dist/server.js",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
        PORT: "5050",
      },
      // server.ts drains connections and closes MongoDB on SIGINT/SIGTERM, with
      // its own 10s failsafe. Give it slightly longer before PM2 force-kills.
      kill_timeout: 12000,
      max_memory_restart: "300M",
      restart_delay: 3000,
      max_restarts: 10,
      time: true,
    },
    {
      name: "nexora-web",
      cwd: "/var/www/nexora/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
      },
      kill_timeout: 8000,
      max_memory_restart: "500M",
      restart_delay: 3000,
      max_restarts: 10,
      time: true,
    },
  ],
};
