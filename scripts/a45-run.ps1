$ErrorActionPreference = "Continue"
$dir = "docs/evidence/A-45"
New-Item -ItemType Directory -Force $dir | Out-Null
'{"email":"manager1@demo.local","password":"password123"}' | Out-File -Encoding ascii "$dir/login.json"

$runs = @(@{name="run1";seed=42}, @{name="run2";seed=42}, @{name="run3";seed=43})
foreach ($r in $runs) {
  Write-Host "=== $($r.name) seed=$($r.seed) ==="
  cmd /c "npm run db:reset >nul 2>&1"
  if ($LASTEXITCODE -ne 0) { Write-Host "db:reset loi (exit $LASTEXITCODE)" }
  $jar = "$dir/cookies.txt"
  curl.exe -s -c $jar -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" --data "@$dir/login.json" | Out-Null
  "{`"action`":`"live`",`"seed`":$($r.seed),`"minSessions`":100}" | Out-File -Encoding ascii "$dir/body.json"
  curl.exe -s -b $jar -X POST http://localhost:3000/api/simulator -H "Content-Type: application/json" --data "@$dir/body.json" | Tee-Object "$dir/$($r.name)-response.json"
  Write-Host ""
  npx tsx scripts/a45-export.ts "$dir/$($r.name).txt"
}
Remove-Item "$dir/cookies.txt", "$dir/body.json", "$dir/login.json"

Write-Host "`n=== KET QUA ==="
Get-FileHash "$dir/run1.txt","$dir/run2.txt","$dir/run3.txt" | Format-Table Hash, Path -AutoSize | Tee-Object "$dir/hash.txt"
$same = (Get-FileHash "$dir/run1.txt").Hash -eq (Get-FileHash "$dir/run2.txt").Hash
$diff = (Get-FileHash "$dir/run1.txt").Hash -ne (Get-FileHash "$dir/run3.txt").Hash
Write-Host "seed42 x2 giong nhau: $same   |   seed43 khac seed42: $diff"