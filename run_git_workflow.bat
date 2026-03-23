@echo off
REM Complete Git Workflow Script for ExploreNepal Repository
REM This script will execute all the git operations you requested

cd /d "C:\Users\Ashok\OneDrive\Desktop\ExploreNepal\Explore_Nepal"

echo.
echo ========================================
echo STEP 1: Verify Current Location
echo ========================================
echo Current directory: %cd%
echo.

echo ========================================
echo STEP 2: Git Fetch All Branches
echo ========================================
git fetch --all
echo.

echo ========================================
echo STEP 3: Show All Available Branches
echo ========================================
git branch -a
echo.

echo ========================================
echo STEP 4: Show Current Status
echo ========================================
git status
echo.

echo ========================================
echo STEP 5: Checkout/Create feat/frontend-ui Branch
echo ========================================
git checkout feat/frontend-ui
if errorlevel 1 (
    echo Creating branch from origin...
    git checkout -b feat/frontend-ui origin/feat/frontend-ui
)
git status
echo.

echo ========================================
echo STEP 6: Checkout/Create feat/backend-api Branch
echo ========================================
git checkout feat/backend-api
if errorlevel 1 (
    echo Creating branch from origin...
    git checkout -b feat/backend-api origin/feat/backend-api
)
git status
echo.

echo ========================================
echo STEP 7: Switch Back to dev Branch
echo ========================================
git checkout dev
git status
echo.

echo ========================================
echo STEP 8: Merge feat/frontend-ui into dev
echo ========================================
git merge feat/frontend-ui
echo.

echo ========================================
echo STEP 9: Merge feat/backend-api into dev
echo ========================================
git merge feat/backend-api
echo.

echo ========================================
echo STEP 10: Show Final Status Before Push
echo ========================================
git status
echo.

echo ========================================
echo STEP 11: Push dev Branch
echo ========================================
git push origin dev
echo.

echo ========================================
echo STEP 12: Push feat/frontend-ui Branch
echo ========================================
git push origin feat/frontend-ui
echo.

echo ========================================
echo STEP 13: Push feat/backend-api Branch
echo ========================================
git push origin feat/backend-api
echo.

echo ========================================
echo WORKFLOW COMPLETE!
echo ========================================
echo All branches have been pushed to origin.
echo.
pause
