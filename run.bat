@echo off
cd /d "D:\Gym_Management_Sys"

start cmd /k npm start

timeout /t 3 > nul

start http://localhost:3000