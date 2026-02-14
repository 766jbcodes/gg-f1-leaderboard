# Invoke send-race-reminders Edge Function (Windows PowerShell).
# Run from repo root. Loads .env so you don't paste the anon key.
$envPath = Join-Path $PSScriptRoot ".." ".env"
if (-not (Test-Path $envPath)) {
    Write-Error ".env not found at $envPath. Run from repo root or create .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    exit 1
}
Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$' -and $_.Trim() -notmatch '^\#') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
    }
}
$base = $env:VITE_SUPABASE_URL
$key = $env:VITE_SUPABASE_ANON_KEY
if (-not $base -or -not $key) {
    Write-Error "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env"
    exit 1
}
$url = "$base/functions/v1/send-race-reminders"
Write-Host "POST $url"
try {
    $r = Invoke-RestMethod -Uri $url -Method Post -Headers @{ Authorization = "Bearer $key"; "Content-Type" = "application/json" }
    $r | ConvertTo-Json
} catch {
    Write-Host "Status:" $_.Exception.Response.StatusCode
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    Write-Host $reader.ReadToEnd()
}
