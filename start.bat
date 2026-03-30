@echo off
title MoodScope - Start All Servers

echo ================================
echo Starting MoodScope Servers...
echo ================================

:: Start Backend (Node)
echo Starting Node Backend...
cd backend\node-api
start cmd /k node server.js

:: Start FastAPI
echo Starting FastAPI...
cd ..\fast-api
start cmd /k uvicorn main:app --reload

:: Start Frontend
echo Starting Frontend...
cd ..\..\frontend
start cmd /k npm run dev

echo ================================
echo All servers started!
echo ================================
pause