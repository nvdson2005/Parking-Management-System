# A-45 / SC-07: 3 lan chay live (seed 42 x2, seed 43) tren CSDL replay rieng
. "$PSScriptRoot/a45-lib.ps1"
$dest = 'docs/evidence/A-45'

Invoke-A45 'run' {
  param($stage)
  $jar = Join-Path $stage '_cookies.txt'
  $runs = @(@{name = 'run1'; seed = 42 }, @{name = 'run2'; seed = 42 }, @{name = 'run3'; seed = 43 })
  $files = @()

  foreach ($r in $runs) {
    Write-Host "=== $($r.name) seed=$($r.seed) ==="
    Reset-ReplayDb
    Connect-Manager $jar $stage
    $body = '{"action":"live","seed":' + $r.seed + ',"minSessions":100}'
    $res = Invoke-Api $r.name '/api/simulator' $body (Join-Path $stage "$($r.name)-response.json") $jar
    Assert-That ($res.seed -eq $r.seed) "$($r.name): seed tra ve $($res.seed)"
    Assert-That ($res.sessions -ge 100) "$($r.name): chi $($res.sessions) luot gui"
    Assert-That ($res.rejected -eq 0) "$($r.name): rejected = $($res.rejected)"
    Export-Db (Join-Path $stage "$($r.name).txt")

    # Doi chieu exits = luot da dong = payments (KB-A45-02)
    $txt = Get-Content (Join-Path $stage "$($r.name).txt") -Encoding UTF8
    $closed = @($txt | Select-String 'plate_snapshot=.*\| status="CLOSED"').Count
    $pay = [int]([regex]::Match(($txt -join "`n"), '(?m)^## payments \((\d+)\)').Groups[1].Value)
    Write-Host "exits=$($res.exits) closed=$closed payments=$pay"
    Assert-That (($res.exits -eq $closed) -and ($closed -eq $pay)) "$($r.name): exits/closed/payments lech"
    $files += "$($r.name)-response.json", "$($r.name).txt"
  }

  $h = @{}
  foreach ($n in 'run1', 'run2', 'run3') { $h[$n] = (Get-FileHash (Join-Path $stage "$n.txt") -Algorithm SHA256).Hash }
  Assert-That ($h.run1 -eq $h.run2) 'seed 42 chay 2 lan cho ket qua khac nhau'
  Assert-That ($h.run1 -ne $h.run3) 'seed 43 trung ket qua seed 42'
  Write-Utf8 (Join-Path $stage 'hash.txt') ((@('run1', 'run2', 'run3') | ForEach-Object { "$($h[$_])  $_.txt" }) -join "`n")
  $files += 'hash.txt'

  Publish-Evidence $stage $dest $files
  Write-Host 'seed42 x2 giong nhau: True   |   seed43 khac seed42: True'
}
