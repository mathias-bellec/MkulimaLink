# Git Setup Instructions for MkulimaLink

## Step 1: Install Git

Download and install Git from: https://git-scm.com/download/win

During installation:
- Select "Git from the command line and also from 3rd-party software"
- Use default settings for everything else

## Step 2: Restart your terminal/IDE after installation

## Step 3: Configure Git (run these commands)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 4: Initialize and Push to GitHub

Open a terminal in the MkulimaLink folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MkulimaLink v2.0 - Agriculture Super-App"

# Add remote repository
git remote add origin https://github.com/kadioko/MkulimaLink.git

# Push to GitHub (use 'main' branch)
git branch -M main
git push -u origin main
```

## If repository already has content:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Authentication

You may need to authenticate with GitHub:
- Use a Personal Access Token (PAT) instead of password
- Create one at: https://github.com/settings/tokens
- Select "repo" scope when creating the token
