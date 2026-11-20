$ErrorActionPreference = "Continue"
$dir = "docs/evidence/A-45/params"
New-Item -ItemType Directory -Force $dir | Out-Null
'{"email":"manager1@demo.local","password":"password123"}' | Out-File -Encoding ascii "$dir/login.json"

$cases = [ordered]@{
  "P1-n50"          = '{"action":"live","seed":42,"n":50}'
  "P2-min150"       = '{"action":"live","seed":42,"minSessions":150}'
  "P3-exit0.2"      = '{"action":"live","seed":42,"minSessions":100,"exitRatio":0.2}'
  "P4-exit0.8"      = '{"action":"live","seed":42,"minSessions":100,"exitRatio":0.8}'
  "P5-history3"     = '{"action":"history","seed":42,"days":3}'
  "P6-bad-exit"     = '{"action":"live","seed":42,"n":10,"exitRatio":"abc"}'
}
foreach ($k in $cases.Keys) {
  cmd /c "npm run db:reset >nul 2>&1"
  Start-Sleep -Seconds 3
  $cases[$k] | Out-File -Encoding ascii "$dir/b.json"
  for ($try = 1; $try -le 3; $try++) {
    curl.exe -s -c "$dir/c.txt" -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" --data "@$dir/login.json" | Out-Null
    $res = curl.exe -s -b "$dir/c.txt" -X POST http://localhost:3000/api/simulator -H "Content-Type: application/json" --data "@$dir/b.json"
    if ($res -and $res.StartsWith("{") -and $res -notmatch "UNAUTHENTICATED") { break }
    Start-Sleep -Seconds 3
  }
  "$k  ->  $res"
  $res | Out-File "$dir/$k.json"
}
Remove-Item "$dir/c.txt","$dir/b.json","$dir/login.json"