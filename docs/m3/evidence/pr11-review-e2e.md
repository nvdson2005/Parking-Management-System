# PR #11 review fixes: run against the production build (T017)

RES-03, 23/11/2026. `npm run build`, then `next start -p 3100` with `DATABASE_URL` pointing to a scratch
SQLite file (`prisma migrate deploy` and `tsx prisma/seed.ts`; `prisma/dev.db` not touched). Requests sent
with curl using demo accounts (`customer01`, `staff1`, `manager1`). After each step, the
`ACCESS_DENIED` rows in the scratch DB are counted.

Script:

```bash
B=http://localhost:3100; J=<scratch>/jar
login() { rm -f $J.$1; curl -s -c $J.$1 -H 'content-type: application/json' -d "{\"email\":\"$2\",\"password\":\"password123\"}" $B/api/auth/login -o /dev/null -w "login $1 %{http_code}\n"; }
count() { DATABASE_URL="file:<scratch>/e2e.db" node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.accessLog.findMany({where:{action:'ACCESS_DENIED'},select:{target:true}}).then(r=>{console.log('  ACCESS_DENIED rows:',r.length,JSON.stringify(r.map(x=>x.target)));return p.\$disconnect()})"; }
login c customer01@demo.local; login s staff1@demo.local; login m manager1@demo.local
count
echo "1) customer GET /manager/access-log (full page load)"; curl -s -b $J.c -o /dev/null -w "  %{http_code} -> %{redirect_url}\n" $B/manager/access-log; count
echo "2) customer GET /manager/accounts (page without its own requireRole)"; curl -s -b $J.c -o /dev/null -w "  %{http_code} -> %{redirect_url}\n" $B/manager/accounts; count
echo "3) customer RSC (client navigation) to /staff/lookup"; curl -s -b $J.c -H 'RSC: 1' -o <scratch>/rsc.txt -w "  %{http_code}\n" $B/staff/lookup; grep -o 'NEXT_REDIRECT[^"]*' <scratch>/rsc.txt | head -1; count
echo "4) customer opens /denied 3 times (F5)"; for i in 1 2 3; do curl -s -b $J.c -o <scratch>/denied.html -w "  %{http_code}\n" $B/denied; done; grep -o 'Không có quyền truy cập\|Access denied[^<]*' <scratch>/denied.html | head -1; count
echo "5) /denied?from=/customer forged"; curl -s -b $J.c -o /dev/null -w "  %{http_code}\n" "$B/denied?from=/customer"; count
echo "6) staff GET /manager"; curl -s -b $J.s -o /dev/null -w "  %{http_code} -> %{redirect_url}\n" $B/manager; count
echo "7) manager GET /staff/lookup (allowed)"; curl -s -b $J.m -o /dev/null -w "  %{http_code}\n" $B/staff/lookup; count
echo "8) signed out GET /staff"; curl -s -o /dev/null -w "  %{http_code} -> %{redirect_url}\n" $B/staff; count
echo "9) staff lookup with repeated identifier"; curl -s -b $J.s -o <scratch>/lk.html -w "  %{http_code}\n" "$B/staff/lookup?identifier=a&identifier=b"; grep -o 'Tìm kiếm không hợp lệ[^<]*\|Invalid search[^<]*' <scratch>/lk.html | head -1
echo "10) staff lookup method=EMAIL"; curl -s -b $J.s -o <scratch>/lk2.html -w "  %{http_code}\n" "$B/staff/lookup?method=EMAIL&identifier=x"; grep -o 'Tìm kiếm không hợp lệ[^<]*\|Invalid search[^<]*' <scratch>/lk2.html | head -1
echo "11) customer GET /api/access-logs (API path)"; curl -s -b $J.c -o /dev/null -w "  %{http_code}\n" $B/api/access-logs; count
```

Output:

```text
login c 200
login s 200
login m 200
  ACCESS_DENIED rows: 0 []
1) customer GET /manager/access-log (full page load)
  307 -> http://localhost:3100/denied
  ACCESS_DENIED rows: 1 ["page:/manager"]
2) customer GET /manager/accounts (page without its own requireRole)
  307 -> http://localhost:3100/denied
  ACCESS_DENIED rows: 2 ["page:/manager","page:/manager"]
3) customer RSC (client navigation) to /staff/lookup
  200
NEXT_REDIRECT;replace;/denied;307;
  ACCESS_DENIED rows: 3 ["page:/manager","page:/manager","page:/staff"]
4) customer opens /denied 3 times (F5)
  200
  200
  200
Không có quyền truy cập
  ACCESS_DENIED rows: 3 ["page:/manager","page:/manager","page:/staff"]
5) /denied?from=/customer forged
  200
  ACCESS_DENIED rows: 3 ["page:/manager","page:/manager","page:/staff"]
6) staff GET /manager
  307 -> http://localhost:3100/denied
  ACCESS_DENIED rows: 4 ["page:/manager","page:/manager","page:/staff","page:/manager"]
7) manager GET /staff/lookup (allowed)
  200
  ACCESS_DENIED rows: 4 ["page:/manager","page:/manager","page:/staff","page:/manager"]
8) signed out GET /staff
  307 -> http://localhost:3100/login
  ACCESS_DENIED rows: 4 ["page:/manager","page:/manager","page:/staff","page:/manager"]
9) staff lookup with repeated identifier
  200
Tìm kiếm không hợp lệ. Chọn một cách tìm và nhập một mã.
10) staff lookup method=EMAIL
  200
Tìm kiếm không hợp lệ. Chọn một cách tìm và nhập một mã.
11) customer GET /api/access-logs (API path)
  403
  ACCESS_DENIED rows: 5 ["page:/manager","page:/manager","page:/staff","page:/manager","roles:MANAGER"]
```

Reading: each refused request adds exactly one row, including step 1, where both the `/manager` layout and
the page's own `requireRole` refuse. Steps 4 and 5 add none. The allowed role (7) and a signed-out user (8)
add none. A repeated or unknown lookup parameter shows the validation message instead of an error page.
