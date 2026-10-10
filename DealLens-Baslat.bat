@echo off
cd /d "%~dp0"
python "start-deallens.py"
if errorlevel 1 pause
