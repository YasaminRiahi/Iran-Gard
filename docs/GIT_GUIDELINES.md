# Git Guidelines

## Branch Strategy

### Always develop from the `dvp` branch
- Switch to the `dvp` branch before starting any work: `git checkout dvp`
- (Optional) Create feature branches from `dvp` with a descriptive name: `git checkout -b feat/feature-name`

## Keeping Your Branches Updated

### Pull regularly to sync with the team
- Before starting a new feature, pull the latest changes: `git pull`
- Before pushing your changes, pull again to catch any updates from teammates
- This helps you see what others are working on and resolve conflicts early

### Handling Conflicts
- If conflicts occur during a pull, Git will notify you
- Open the conflicted files and resolve them manually
- Look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and decide which changes to keep

## Quick Workflow

1. Start work: `git checkout dvp` → `git pull`
2. Make changes and commit regularly
3. Before pushing: `git pull` to sync with the latest
4. Resolve any conflicts if needed
5. Push your changes

## General Tips

- **Write clear commit messages** that describe what changed and why
- **Commit frequently** with logical, related changes in each commit
- **Pull before push** to minimize merge conflicts
- **Communicate with the team** when working on shared features
