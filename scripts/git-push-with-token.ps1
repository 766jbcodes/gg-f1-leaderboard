# Push to GitHub using a Personal Access Token (no interactive login).
# 1. Create a PAT: GitHub → Settings → Developer settings → Personal access tokens → Generate (scope: repo).
# 2. Add to .env: GITHUB_TOKEN=ghp_your_token_here
# 3. Run from repo root: .\scripts\git-push-with-token.ps1
$envPath = Join-Path $PSScriptRoot ".." ".env"
if (-not (Test-Path $envPath)) {
    Write-Error ".env not found. Add GITHUB_TOKEN=ghp_xxx to .env"
    exit 1
}
Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*GITHUB_TOKEN\s*=\s*(.+)$' -and $_.Trim() -notmatch '^\#') {
        $token = $matches[1].Trim().Trim('"').Trim("'")
        $remote = "https://766jbcodes:${token}@github.com/766jbcodes/gg-f1-leaderboard.git"
        Set-Location (Join-Path $PSScriptRoot "..")
        git remote set-url origin $remote
        git push origin main
        git remote set-url origin "https://github.com/766jbcodes/gg-f1-leaderboard"
        Write-Host "Push complete. Remote URL reset to HTTPS (no token stored)."
        exit 0
    }
}
Write-Error "GITHUB_TOKEN not found in .env. Add: GITHUB_TOKEN=ghp_your_token"
