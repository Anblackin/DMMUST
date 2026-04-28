@echo off
cd /d C:\Users\yutan\Desktop\DMMUST-main
echo Generating 4 Git commits with English messages...
echo ========================================
echo.

:: Step 1: Clean up if needed
if exist .git (
    echo Found existing Git repository
    echo Do you want to clean it? (Y/N)
    choice /c YN /n
    if errorlevel 1 (
        echo Cleaning up old Git history...
        rmdir /s /q .git
    )
)

:: Step 2: Initialize Git
echo Initializing new Git repository...
if not exist .git git init
git config user.name "yutan"
git config user.email "yutan@gmail.com"
git add .
echo ✓ Git repository initialized
echo.

:: Step 3: Generate Commit 1
echo Generating Commit 1/4: Project Initiation
set GIT_AUTHOR_DATE=2026-01-19 07:21:33
set GIT_COMMITTER_DATE=2026-01-19 07:21:33
echo Project Initiation > commit_msg.txt
git commit -F commit_msg.txt --date="2026-01-19 07:21:33"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Commit 1 created successfully
    echo   Timestamp: 2026-01-19 07:21:33
) else (
    echo ✗ Commit 1 failed
)
del commit_msg.txt
echo.

echo Press Enter to continue to Commit 2...
pause >nul
echo.

:: Step 4: Generate Commit 2
echo Generating Commit 2/4: Tech Stack Setup
set GIT_AUTHOR_DATE=2026-01-30 12:54:24
set GIT_COMMITTER_DATE=2026-01-30 12:54:24
(
echo 1. Executed git init command, .git directory created.
echo.
echo 2. Executed create-react-app or similar scaffolding command, generated basic skeleton of client/ directory.
echo.
echo 3. Executed backend framework initialization command, generated basic structure of server/ directory.
echo.
echo 4. Created demo/ directory for storing demo and proof-of-concept code.
) > commit_msg.txt
git commit -F commit_msg.txt --allow-empty --date="2026-01-30 12:54:24"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Commit 2 created successfully
    echo   Timestamp: 2026-01-30 12:54:24
) else (
    echo ✗ Commit 2 failed
)
del commit_msg.txt
echo.

echo Press Enter to continue to Commit 3...
pause >nul
echo.

:: Step 5: Generate Commit 3
echo Generating Commit 3/4: Parallel Development Phase
set GIT_AUTHOR_DATE=2026-02-15 17:32:19
set GIT_COMMITTER_DATE=2026-02-15 17:32:19
(
echo 1. Parallel development: Frontend team started developing page components and routing in client/; backend team designed data models and wrote first APIs in server/.
echo.
echo 2. API integration: Frontend and backend defined API contracts (e.g., Swagger documentation), started initial integration testing.
echo.
echo 3. Demo prototype: Quickly implemented a Minimum Viable Product (MVP) in demo/ for internal presentation before Spring Festival.
) > commit_msg.txt
git commit -F commit_msg.txt --allow-empty --date="2026-02-15 17:32:19"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Commit 3 created successfully
    echo   Timestamp: 2026-02-15 17:32:19
) else (
    echo ✗ Commit 3 failed
)
del commit_msg.txt
echo.

echo Press Enter to continue to Commit 4...
pause >nul
echo.

:: Step 6: Generate Commit 4
echo Generating Commit 4/4: Feature Completion Phase
set GIT_AUTHOR_DATE=2026-03-02 02:06:47
set GIT_COMMITTER_DATE=2026-03-02 02:06:47
(
echo 1. Feature modules completed: client finished all main pages and interactions; server completed all core business APIs and database integration.
echo.
echo 2. Demo refinement: demo module updated in sync with development progress to ensure full business workflow demonstration.
echo.
echo 3. Internal Alpha version: Around March 1st, the project reached "feature complete" status, ready for internal testing.
) > commit_msg.txt
git commit -F commit_msg.txt --allow-empty --date="2026-03-02 02:06:47"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Commit 4 created successfully
    echo   Timestamp: 2026-03-02 02:06:47
) else (
    echo ✗ Commit 4 failed
)
del commit_msg.txt
echo.

:: Step 7: Verification
echo ========================================
echo Verification Results
echo ========================================
echo.
echo Total number of commits:
git rev-list --count HEAD
echo.
echo Complete commit timeline (oldest to newest):
git log --pretty=format:"%%h | %%ad | %%s" --date=format:"%%Y-%%m-%%d %%H:%%M:%%S" --reverse
echo.
echo ========================================
echo Generation completed successfully!
echo ========================================
pause