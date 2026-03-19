@echo off
REM Step Flash Agent - Simple Prompt Runner (Windows)
REM Usage: ask "your prompt here"

set API_KEY=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
set API_URL=https://openrouter.ai/api/v1/chat/completions
set MODEL=step-ai/step-flash-3.5

echo.
echo ========================================
echo    Step Flash Agent - Simple Runner
echo ========================================
echo.

if "%~1"=="" (
    echo Usage: ask "your prompt here"
    echo.
    echo Examples:
    echo   ask "What is AI?"
    echo   ask "Write a Python function"
    exit /b 1
)

set PROMPT=%~1

echo Prompt: %PROMPT%
echo.
echo Response:
echo ----------------------------------------

REM Use PowerShell to make API request
powershell -Command ^
    "$headers = @{ ^
        'Authorization' = 'Bearer %API_KEY%'; ^
        'Content-Type' = 'application/json'; ^
        'HTTP-Referer' = 'https://github.com/mcbackup058-netizen/skills-collection'; ^
        'X-Title' = 'Step Flash Simple Runner' ^
    }; ^
    $body = @{ ^
        model = '%MODEL%'; ^
        messages = @(
            @{role = 'system'; content = 'You are a helpful AI assistant.'}, ^
            @{role = 'user'; content = '%PROMPT%'} ^
        ); ^
        temperature = 0.7; ^
        max_tokens = 4096 ^
    } | ConvertTo-Json -Depth 10; ^
    $response = Invoke-RestMethod -Uri '%API_URL%' -Method Post -Headers $headers -Body $body; ^
    Write-Output $response.choices[0].message.content"

echo.
echo ----------------------------------------
