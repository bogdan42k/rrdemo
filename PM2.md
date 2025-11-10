# PM2 Setup for rrdemo Dev Instance

This document describes how to use PM2 to keep the development server running with automatic restarts on crashes and system reboots.

## Initial Setup

### 1. Start the application with PM2

```bash
pm2 start ecosystem.config.cjs
```

This will start the dev server using the configuration in `ecosystem.config.cjs`.

### 2. Save the PM2 process list

```bash
pm2 save
```

This saves the current process list so PM2 can restore it after a reboot.

### 3. Set up PM2 to start on system boot

```bash
pm2 startup
```

This command will output a command that you need to run with sudo. The output will look something like:

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u your-username --hp /home/your-username
```

Copy and run that command to enable PM2 to start on system boot.

## PM2 Management Commands

### View running processes

```bash
pm2 list
```

### View logs

```bash
# View all logs
pm2 logs

# View logs for rrdemo-dev only
pm2 logs rrdemo-dev

# View last 200 lines
pm2 logs --lines 200
```

### Monitor the application

```bash
pm2 monit
```

This opens an interactive monitoring dashboard showing CPU, memory usage, and logs in real-time.

### Restart the application

```bash
pm2 restart rrdemo-dev
```

### Stop the application

```bash
pm2 stop rrdemo-dev
```

### Delete the application from PM2

```bash
pm2 delete rrdemo-dev
```

### View detailed information

```bash
pm2 show rrdemo-dev
```

## Configuration Details

The `ecosystem.config.cjs` file configures:

- **Auto-restart**: Automatically restarts on crashes
- **Memory limit**: Restarts if memory usage exceeds 1GB
- **Min uptime**: Process must run for at least 10s to be considered stable
- **Max restarts**: Maximum 10 restarts within a short period (prevents restart loops)
- **Restart delay**: 4 second delay between restarts
- **Logs**: All logs are stored in `./logs/` directory

## Logs Location

PM2 logs are stored in:
- `/apps/rrdemo/logs/pm2-error.log` - Error logs
- `/apps/rrdemo/logs/pm2-out.log` - Standard output logs
- `/apps/rrdemo/logs/pm2-combined.log` - Combined logs

## Troubleshooting

### App keeps restarting

Check the logs to see what's causing the crashes:

```bash
pm2 logs rrdemo-dev --lines 50
```

### Check if PM2 startup is enabled

```bash
pm2 startup
```

If it says "Already setup", you're good to go.

### Remove PM2 from startup

```bash
pm2 unstartup
```

### Reset PM2

If you need to start fresh:

```bash
pm2 kill
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Follow the instructions
```

## Testing the Setup

### Test crash recovery

1. Find the process ID:
   ```bash
   pm2 list
   ```

2. Kill the process:
   ```bash
   pm2 delete rrdemo-dev
   pm2 start ecosystem.config.cjs
   pm2 list  # Note the pid
   kill -9 <pid>
   ```

3. Check if PM2 restarted it:
   ```bash
   pm2 list
   ```

### Test system reboot

1. Reboot your system:
   ```bash
   sudo reboot
   ```

2. After reboot, check if the app is running:
   ```bash
   pm2 list
   ```

The app should automatically start after the system reboots.

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 Startup Script](https://pm2.keymetrics.io/docs/usage/startup/)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/usage/process-management/)
