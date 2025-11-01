# Auto-Deployment Setup

This repository is configured to automatically pull changes to your VPS when you merge to the `main` branch.

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### 1. `SSH_HOST`
- Your VPS IP address or domain
- Example: `123.456.789.0` or `example.com`

### 2. `SSH_USERNAME`
- SSH username for your VPS
- Example: `ubuntu`, `root`, or your custom user

### 3. `SSH_PRIVATE_KEY`
- Your SSH private key for authentication
- **How to get it:**
  ```bash
  # On your local machine, generate a new SSH key pair (if you don't have one)
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

  # Copy the private key content (paste this into the GitHub secret)
  cat ~/.ssh/github_deploy

  # Copy the public key to your VPS
  ssh-copy-id -i ~/.ssh/github_deploy.pub your-username@your-vps-ip

  # Or manually add it to your VPS ~/.ssh/authorized_keys
  ```

### 4. `DEPLOY_PATH`
- The absolute path to your project on the VPS
- Example: `/home/ubuntu/rrdemo` or `/var/www/rrdemo`

### 5. `SSH_PORT` (Optional)
- SSH port on your VPS
- Default: `22`
- Only add this secret if you use a custom SSH port

## Testing the Deployment

1. Add all the secrets to your GitHub repository
2. Make a small change and commit to a branch
3. Create a pull request and merge it to `main`
4. Go to **Actions** tab in GitHub to watch the deployment
5. Check your VPS to verify the changes were pulled

## Troubleshooting

- **Permission denied**: Make sure the SSH public key is added to `~/.ssh/authorized_keys` on your VPS
- **Path not found**: Verify the `DEPLOY_PATH` secret points to the correct directory
- **Git pull fails**: Ensure the VPS has git configured and the repository is clean (no uncommitted changes)
- **Port issues**: If using custom SSH port, add the `SSH_PORT` secret

## Security Notes

- Never commit your SSH private key to the repository
- Use a dedicated SSH key for deployments (not your personal key)
- Ensure your VPS firewall allows SSH connections from GitHub Actions IPs
- Consider using a dedicated deployment user with limited permissions
