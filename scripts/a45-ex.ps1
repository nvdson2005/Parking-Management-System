# A-45 / SC-02..SC-06: kich hoat EX01..EX05, moi ngoai le tren CSDL vua reset
. "$PSScriptRoot/a45-lib.ps1"
$dest = 'docs/evidence/A-45/ex'

$expected = [ordered]@{
  EX01 = 'ZONE_FULL'
  EX02 = 'SESSION_OPEN'
  EX03 = 'SESSION_OPEN'
  EX04 = 'ALREADY_OPEN'
  EX05 = 'LOT_SUSPENDED'
}

Invoke-A45 'ex' {
  param($stage)
  $jar = Join-Path $stage '_cookies.txt'
  $files = @()
  foreach ($ex in $expected.Keys) {
    Write-Host "=== $ex ==="
    Reset-ReplayDb
    Connect-Manager $jar $stage
    $body = '{"action":"exception","ex":"' + $ex + '","seed":42}'
    $res = Invoke-Api $ex '/api/simulator' $body (Join-Path $stage "$ex-response.json") $jar
    Assert-That ($res.exception -eq $ex) "${ex}: response cua $($res.exception)"
    Assert-That ($res.outcome -eq $expected[$ex]) "${ex}: outcome $($res.outcome), mong doi $($expected[$ex])"
    Export-Db (Join-Path $stage "$ex.txt")
    $files += "$ex-response.json", "$ex.txt"
  }
  Publish-Evidence $stage $dest $files
}
