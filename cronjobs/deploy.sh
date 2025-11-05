#!/bin/bash

# Auto-deployment script for rrdemo
# This script pulls the latest changes from the main branch

# Set the project directory (change this to your actual path)
PROJECT_DIR="/apps/rrdemo"

# Log file location
LOG_FILE="$PROJECT_DIR/logs/deploy.log"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Log the deployment start
echo "================================================" >> "$LOG_FILE"
echo "Deployment started at $(date)" >> "$LOG_FILE"

# Fetch latest changes
echo "Fetching latest changes..." >> "$LOG_FILE"
git fetch origin main >> "$LOG_FILE" 2>&1

# Check if there are updates
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "Already up to date. No changes to pull." >> "$LOG_FILE"
else
    echo "New changes detected. Pulling..." >> "$LOG_FILE"

    # Stash any local changes (if any)
    git stash >> "$LOG_FILE" 2>&1

    # Pull latest changes
    git pull origin main >> "$LOG_FILE" 2>&1

    if [ $? -eq 0 ]; then
        echo "Successfully pulled changes" >> "$LOG_FILE"

        # Optional: Uncomment these lines if you want to rebuild after pulling
        # echo "Running npm install..." >> "$LOG_FILE"
        # npm install >> "$LOG_FILE" 2>&1

        # echo "Running build..." >> "$LOG_FILE"
        # npm run build >> "$LOG_FILE" 2>&1

        # Optional: Restart your application (adjust command as needed)
        # echo "Restarting application..." >> "$LOG_FILE"
        # pm2 restart rrdemo >> "$LOG_FILE" 2>&1
        # systemctl restart rrdemo >> "$LOG_FILE" 2>&1

    else
        echo "ERROR: Failed to pull changes" >> "$LOG_FILE"
    fi
fi

echo "Deployment completed at $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
