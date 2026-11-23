# Ham dung chung cho a45-run.ps1, a45-ex.ps1, a45-params.ps1
# - CSDL replay: file SQLite moi trong %TEMP%\a45-replay, khong bao gio dung .env
# - Server test: do script tu khoi dong tren cong rieng, cung DATABASE_URL
# - Loi o bat ky buoc nao -> throw; evidence chi duoc chep khi moi buoc deu dat
$ErrorActionPreference = 'Stop'

$script:ReplayRoot = Join-Path ([IO.Path]::GetTempPath()) 'a45-replay'
$script:Port = 3100
$script:Base = "http://localhost:$script:Port"
$script:Server = $null

function Write-Utf8([string]$path, [string]$text) {
  # UTF-8 khong BOM (Out-File/Tee-Object cua PowerShell 5 ghi UTF-16)
  [IO.File]::WriteAllText($path, $text, (New-Object Text.UTF8Encoding($false)))
}

function Invoke-Native([string]$what, [scriptblock]$cmd) {
  & $cmd
  if ($LASTEXITCODE -ne 0) { throw "$what that bai (exit $LASTEXITCODE)" }
}

function New-ReplayDb {
  New-Item -ItemType Directory -Force $script:ReplayRoot | Out-Null
  $name = 'a45-{0}-{1}.db' -f (Get-Date -Format 'yyyyMMddHHmmss'), ([guid]::NewGuid().ToString('N').Substring(0, 8))
  $path = Join-Path $script:ReplayRoot $name
  $env:DATABASE_URL = 'file:' + ($path -replace '\\', '/')
  Write-Host "CSDL replay: $path"
  return $path
}

function Assert-ReplayDb {
  $url = $env:DATABASE_URL
  if (-not $url -or -not $url.StartsWith('file:')) { throw "Tu choi reset: DATABASE_URL khong phai SQLite ($url)" }
  $p = [IO.Path]::GetFullPath(($url.Substring(5) -replace '/', '\'))
  $root = [IO.Path]::GetFullPath($script:ReplayRoot).TrimEnd('\') + '\'
  if (-not $p.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or
      ((Split-Path $p -Leaf) -notmatch '^a45-\d{14}-[0-9a-f]{8}\.db$')) {
    throw "Tu choi reset: $url khong phai CSDL replay trong $root"
  }
}

function Reset-ReplayDb {
  Assert-ReplayDb
  # Qua cmd /c de stderr cua Prisma khong bi PowerShell 5 bien thanh loi; log ghi ra file
  $log = Join-Path $script:ReplayRoot 'last-reset.log'
  Invoke-Native "prisma migrate reset (xem $log)" { cmd /c "npx prisma migrate reset --force --skip-generate > `"$log`" 2>&1" }
}

function Test-PortBusy([int]$port) {
  $c = New-Object Net.Sockets.TcpClient
  try { $c.Connect('127.0.0.1', $port); return $true } catch { return $false } finally { $c.Close() }
}

function Start-TestServer([string]$logFile) {
  Assert-ReplayDb
  if (Test-PortBusy $script:Port) { throw "Cong $script:Port dang ban - tat server cu truoc" }
  # Tien trinh con ke thua $env:DATABASE_URL; Next.js khong ghi de bien da co bang .env
  $script:Server = Start-Process -FilePath 'cmd.exe' -PassThru -WindowStyle Hidden `
    -ArgumentList "/c npx next dev -p $script:Port > `"$logFile`" 2>&1"
  $deadline = (Get-Date).AddSeconds(180)
  while ((Get-Date) -lt $deadline) {
    if ($script:Server.HasExited) { throw "Server test tat ngay khi khoi dong, xem $logFile" }
    $code = & curl.exe -s -o NUL -w '%{http_code}' "$script:Base/api/auth/login"
    if ($code -and $code -ne '000') { return }
    Start-Sleep -Seconds 2
  }
  throw "Server test khong len sau 180 s, xem $logFile"
}

function Stop-TestServer {
  if ($script:Server -and -not $script:Server.HasExited) {
    & taskkill.exe /PID $script:Server.Id /T /F | Out-Null   # /T: kill ca tien trinh node con
  }
  $script:Server = $null
}

# Goi API; sai ma HTTP mong doi -> throw. Tra ve doi tuong JSON.
function Invoke-Api([string]$name, [string]$path, [string]$bodyJson, [string]$outFile,
                    [string]$jar, [int]$expectStatus = 200, [switch]$SaveCookie) {
  $bodyFile = "$outFile.body"
  Write-Utf8 $bodyFile $bodyJson
  $cookieArgs = if ($SaveCookie) { @('-c', $jar) } else { @('-b', $jar) }
  $code = & curl.exe -s @cookieArgs -o $outFile -w '%{http_code}' -X POST "$script:Base$path" `
    -H 'Content-Type: application/json' --data-binary "@$bodyFile"
  Remove-Item $bodyFile -ErrorAction SilentlyContinue
  if ($LASTEXITCODE -ne 0) { throw "${name}: curl loi $LASTEXITCODE" }
  $raw = if (Test-Path $outFile) { Get-Content $outFile -Raw -Encoding UTF8 } else { '' }
  if ([int]$code -ne $expectStatus) { throw "${name}: HTTP $code (mong doi $expectStatus) - $raw" }
  try { return $raw | ConvertFrom-Json } catch { throw "${name}: response khong phai JSON - $raw" }
}

function Connect-Manager([string]$jar, [string]$stage) {
  $body = '{"email":"manager1@demo.local","password":"password123"}'
  # Lan goi dau sau reset co the cham do Next.js dang bien dich route -> thu lai toi da 3 lan
  for ($i = 1; $i -le 3; $i++) {
    try { Invoke-Api 'login' '/api/auth/login' $body "$stage/_login.json" $jar -SaveCookie | Out-Null; break }
    catch { if ($i -eq 3) { throw } ; Start-Sleep -Seconds 3 }
  }
  Remove-Item "$stage/_login.json" -ErrorAction SilentlyContinue
  if (-not (Test-Path $jar) -or -not (Select-String -Path $jar -Pattern '^(#HttpOnly_)?[^#\s]\S*\t' -Quiet)) {
    throw 'login: khong nhan duoc cookie'
  }
}

function Export-Db([string]$outFile) {
  Invoke-Native "export $outFile" { npx tsx scripts/a45-export.ts $outFile }
}

function Assert-That([bool]$cond, [string]$msg) { if (-not $cond) { throw "Kiem tra that bai: $msg" } }

function New-Stage {
  $s = Join-Path ([IO.Path]::GetTempPath()) ('a45-stage-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
  New-Item -ItemType Directory $s | Out-Null
  return $s
}

# Chi goi khi MOI buoc da dat: chep file da kiem tra sang thu muc evidence
function Publish-Evidence([string]$stage, [string]$dest, [string[]]$files) {
  New-Item -ItemType Directory -Force $dest | Out-Null
  foreach ($f in $files) { Copy-Item (Join-Path $stage $f) (Join-Path $dest $f) -Force }
  Write-Host "Da ghi $($files.Count) file vao $dest"
}

# Khung chay chung: tao CSDL + server, chay $body, don dep; loi -> exit 1
function Invoke-A45([string]$title, [scriptblock]$body) {
  $stage = New-Stage
  $db = $null
  $ok = $false
  try {
    $db = New-ReplayDb
    Reset-ReplayDb                       # tao schema + seed tren file moi
    Start-TestServer (Join-Path $stage '_server.log')
    & $body $stage
    $ok = $true
  } catch {
    Write-Host "LOI [$title]: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Evidence KHONG duoc ghi. Log server/CSDL giu lai tai: $stage ; $db"
  } finally {
    Stop-TestServer
    if ($ok) {
      Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
      if ($db) { Start-Sleep -Seconds 1; Remove-Item "$db*" -Force -ErrorAction SilentlyContinue }
    }
  }
  if (-not $ok) { exit 1 }
}
