# A-45 / PD-P04 tieu chi 5: doi tham so khong sua ma
. "$PSScriptRoot/a45-lib.ps1"
$dest = 'docs/evidence/A-45/params'

# status: ma HTTP mong doi; check: dieu kien tren response
$cases = [ordered]@{
  'P1-n50'      = @{ body = '{"action":"live","seed":42,"n":50}'; status = 200
                     check = { param($r) ($r.entries + $r.exits + $r.rejected) -eq 50 } }
  'P2-min150'   = @{ body = '{"action":"live","seed":42,"minSessions":150}'; status = 200
                     check = { param($r) $r.sessions -ge 150 } }
  'P3-exit0.2'  = @{ body = '{"action":"live","seed":42,"minSessions":100,"exitRatio":0.2}'; status = 200
                     check = { param($r) $r.sessions -ge 100 } }
  'P4-exit0.8'  = @{ body = '{"action":"live","seed":42,"minSessions":100,"exitRatio":0.8}'; status = 200
                     check = { param($r) $r.sessions -ge 100 } }
  'P5-history3' = @{ body = '{"action":"history","seed":42,"days":3}'; status = 200
                     check = { param($r) $r.sessions -gt 0 } }
  'P6-bad-exit' = @{ body = '{"action":"live","seed":42,"n":10,"exitRatio":"abc"}'; status = 400
                     check = { param($r) $r.error -eq 'VALIDATION' } }
}

Invoke-A45 'params' {
  param($stage)
  $jar = Join-Path $stage '_cookies.txt'
  $files = @()
  foreach ($k in $cases.Keys) {
    $c = $cases[$k]
    Reset-ReplayDb
    Connect-Manager $jar $stage
    $res = Invoke-Api $k '/api/simulator' $c.body (Join-Path $stage "$k.json") $jar -expectStatus $c.status
    Assert-That (& $c.check $res) "${k}: response khong dat - $($res | ConvertTo-Json -Compress)"
    Write-Host "$k  ->  $($res | ConvertTo-Json -Compress)"
    $files += "$k.json"
  }
  Publish-Evidence $stage $dest $files
}
