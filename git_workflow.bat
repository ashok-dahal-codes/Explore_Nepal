@echo off
setlocal enabledelayedexpansion

cd /d "C:\Users\Ashok\OneDrive\Desktop\ExploreNepal\Explore_Nepal"

echo ========================================
echo Step 1: Fetch all remote branches
echo ========================================
git fetch --all
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 2: Check available branches
echo ========================================
echo Local and remote branches:
git branch -a
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 3: Check current status
echo ========================================
git status
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 4: Switch to feat/frontend-ui
echo ========================================
git checkout feat/frontend-ui
if errorlevel 1 (
    echo Trying to create feat/frontend-ui from origin/feat/frontend-ui
    git checkout -b feat/frontend-ui origin/feat/frontend-ui
    if errorlevel 1 goto error
)

echo Current branch: 
git rev-parse --abbrev-ref HEAD

echo.
echo ========================================
echo Step 5: Check what changes are in frontend/
echo ========================================
git status
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 6: Switch to feat/backend-api
echo ========================================
git checkout feat/backend-api
if errorlevel 1 (
    echo Trying to create feat/backend-api from origin/feat/backend-api
    git checkout -b feat/backend-api origin/feat/backend-api
    if errorlevel 1 goto error
)

echo Current branch:
git rev-parse --abbrev-ref HEAD

echo.
echo ========================================
echo Step 7: Check what changes are in backend/
echo ========================================
git status
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 8: Switch back to dev
echo ========================================
git checkout dev
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 9: Merge feat/frontend-ui into dev
echo ========================================
git merge feat/frontend-ui -m "Merge feat/frontend-ui into dev"
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 10: Merge feat/backend-api into dev
echo ========================================
git merge feat/backend-api -m "Merge feat/backend-api into dev"
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 11: Check final status
echo ========================================
git status
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 12: Push all changes
echo ========================================
git push origin dev
if errorlevel 1 goto error

echo.
echo ========================================
echo Step 13: Push feature branches
echo ========================================
git push origin feat/frontend-ui
if errorlevel 1 goto error

git push origin feat/backend-api
if errorlevel 1 goto error

echo.
echo ========================================
echo SUCCESS: Git workflow completed!
echo ========================================
goto end

:error
echo.
echo ========================================
echo ERROR: Git workflow failed!
echo ========================================
exit /b 1

:end
exit /b 0
