$ErrorActionPreference = "Continue"
$dir = "docs/evidence/A-45/ex"
New-Item -ItemType Directory -Force $dir | Out-Null
'{"email":"manager1@demo.local","password":"password123"}' | Out-File -Encoding ascii "$dir/login.json"

foreach ($ex in "EX01","EX02","EX03","EX04","EX05") {
  Write-Host "=== $ex ==="
  cmd /c "npm run db:reset >nul 2>&1"
  $jar = "$dir/cookies.txt"
  curl.exe -s -c $jar -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" --data "@$dir/login.json" | Out-Null
  "{`"action`":`"exception`",`"ex`":`"$ex`",`"seed`":42}" | Out-File -Encoding ascii "$dir/body.json"
  curl.exe -s -b $jar -X POST http://localhost:3000/api/simulator -H "Content-Type: application/json" --data "@$dir/body.json" | Tee-Object "$dir/$ex-response.json"
  Write-Host ""
  npx tsx scripts/a45-export.ts "$dir/$ex.txt" | Out-Null
  Select-String -Path "$dir/$ex.txt" -Pattern "^## (parking_sessions|session_events|access_logs|parking_lots|zone_capacities)" | ForEach-Object { "   " + $_.Line }
}
Remove-Item "$dir/cookies.txt","$dir/body.json","$dir/login.json"