@echo off
REM Step Flash Smart Agent - Quick Runner for Windows
REM
REM Usage:
REM   ask.bat "Your question here"
REM   ask.bat --setup
REM   ask.bat (interactive mode)

cd /d "%~dp0.."

npx ts-node smart/cli.ts %*
