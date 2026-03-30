@echo off
echo Starting MongoDB...
net start MongoDB

echo Starting FastAPI...
start cmd /k "cd /d C:\Users\piyus\OneDrive\Desktop\Projects\Sentient Analysis\backend\python-api && uvicorn main:app --reload"

echo Starting Express...
start cmd /k "cd /d C:\Users\piyus\OneDrive\Desktop\Projects\Sentient Analysis\backend\node-api && node server.js"

echo Starting React...
start cmd /k "cd /d C:\Users\piyus\OneDrive\Desktop\Projects\Sentient Analysis\frontend && npm run dev"

echo All servers started!