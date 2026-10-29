$ErrorActionPreference = "Stop"

$projectPath = Join-Path $PSScriptRoot "MyProject"
$rootAssetsPath = Join-Path $PSScriptRoot "assets"
$projectAssetsPath = Join-Path $projectPath "assets"

Copy-Item -LiteralPath (Join-Path $projectPath "index.html") -Destination $PSScriptRoot -Force
Copy-Item -LiteralPath (Join-Path $projectPath "style.css") -Destination $PSScriptRoot -Force
Copy-Item -LiteralPath (Join-Path $projectPath "script.js") -Destination $PSScriptRoot -Force
New-Item -ItemType Directory -Force -Path $rootAssetsPath | Out-Null
Copy-Item -Path (Join-Path $projectAssetsPath "*") -Destination $rootAssetsPath -Force

Write-Output "Synced MyProject files to the Vercel site root."
