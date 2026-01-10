$ErrorActionPreference = "Stop"

$scriptDir = $PSScriptRoot
$imageDir = Join-Path $scriptDir "static\image"
$outputFile = Join-Path $imageDir "photos.json"

Write-Host "Scanning directory: $imageDir"

if (-not (Test-Path $imageDir)) {
    Write-Error "Image directory not found!"
}

# Get all image files
$files = Get-ChildItem -Path $imageDir -File | Where-Object { 
    $_.Extension -match "\.(jpg|jpeg|png|gif|webp)$" 
} | Select-Object -ExpandProperty Name

if ($files.Count -eq 0) {
    Write-Warning "No names found. Creating empty list."
    $files = @()
}

# Convert to JSON
$json = $files | ConvertTo-Json -Compress

# Write to file
Set-Content -Path $outputFile -Value $json -Encoding UTF8

Write-Host "Success! Generated photos.json with $($files.Count) images."
Write-Host "Location: $outputFile"
