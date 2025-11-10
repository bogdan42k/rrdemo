module.exports = {
  apps: [
    {
      name: 'rrdemo-dev',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0',
      cwd: '/apps/rrdemo',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
