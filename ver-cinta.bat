@echo off
setlocal
title Abandoned Holeway - ver la cinta
pushd "%~dp0"
echo Abriendo la cinta de Gec y Draila...
where npx >nul 2>nul
if errorlevel 1 (
  echo No se encontro NPX. Instala Node.js desde https://nodejs.org/ y vuelve a intentarlo.
  pause
  popd
  endlocal
  exit /b 1
)
start "Servidor Abandoned Holeway" cmd /k "npx --yes http-server -p 8081 -c-1"
timeout /t 3 >nul
start "" "http://localhost:8081/?cinta=1"
popd
endlocal
