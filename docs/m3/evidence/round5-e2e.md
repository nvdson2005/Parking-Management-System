# Client round 5 (Q37, Q38, Q45): run against the production build

RES-03, 24/11/2026, branch `feat/res03-q37-q38-q45` at `e732938`. `npm run build`, then `next start -p 3101` with
`DATABASE_URL` pointing to a scratch SQLite file (`prisma migrate deploy`, `tsx prisma/seed.ts`; `prisma/dev.db`
not touched). Requests sent with curl as `customer01` (Student), `manager1` and `staff1`.

Script:

```bash
B=http://localhost:3101; J=<scratch>/jarb
login() { rm -f $J.$1; curl -s -c $J.$1 -H 'content-type: application/json' -d "{\"email\":\"$2\",\"password\":\"password123\"}" $B/api/auth/login -o /dev/null -w "login $1 %{http_code}\n"; }
login c customer01@demo.local; login m manager1@demo.local; login s staff1@demo.local
LOT=$(curl -s -b $J.m $B/api/lots | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s)[0].id))")
echo "1) customer home before hours:"; curl -s -b $J.c $B/customer | grep -o 'Giờ hoạt động</dt><dd>[^<]*\|Opening hours</dt><dd>[^<]*'
echo "2) manager sets 06:00-22:00:"; curl -s -b $J.m -X PATCH -H 'content-type: application/json' -d '{"openTime":"06:00","closeTime":"22:00"}' $B/api/lots/$LOT -o /dev/null -w "  %{http_code}\n"
echo "   bad pair:"; curl -s -b $J.m -X PATCH -H 'content-type: application/json' -d '{"openTime":"06:00"}' $B/api/lots/$LOT -w "  %{http_code}\n"
echo "   staff tries:"; curl -s -b $J.s -X PATCH -H 'content-type: application/json' -d '{"openTime":"01:00","closeTime":"02:00"}' $B/api/lots/$LOT -o /dev/null -w "  %{http_code}\n"
echo "3) customer home after:"; curl -s -b $J.c $B/customer > <scratch>/cust.html; grep -o 'Giờ hoạt động</dt><dd>[^<]*\|Opening hours</dt><dd>[^<]*' <scratch>/cust.html; grep -o 'Mức phí của bạn[^<]*\|Your fees[^<]*' <scratch>/cust.html; grep -o '[0-9.]* đ <!-- -->[^<]*' <scratch>/cust.html | head -3; grep -o '[0-9.]\+ đ [a-zỗ ]*lượt\|[0-9.]\+ đ per entry' <scratch>/cust.html | head
echo "4) customer group block:"; grep -o 'Nhóm của bạn[^<]*<!-- -->[^<]*<!-- -->[^<]*\|Yêu cầu đổi sang[^<]*<!-- -->[^<]*' <scratch>/cust.html | head -3
echo "5) customer requests change:"; curl -s -b $J.c -X POST -H 'content-type: application/json' -d '{"group":"LECTURER_STAFF"}' $B/api/account/group-request -w "  %{http_code}\n"
echo "   home shows pending:"; curl -s -b $J.c $B/customer | grep -o 'Đang chờ quản lý[^<]*<!-- -->[^<]*' | head -1
CID=$(curl -s -b $J.m $B/api/accounts | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const a=JSON.parse(s);const u=a.find(x=>x.email==='customer01@demo.local');console.log(u.id);console.error('   list has passwordHash:',a.some(x=>'passwordHash' in x),' requested:',u.requestedUserGroup)})")
echo "6) manager applies:"; curl -s -b $J.m -X PATCH -H 'content-type: application/json' -d '{"userGroup":"LECTURER_STAFF"}' $B/api/accounts/$CID -w "  %{http_code}\n"
echo "   customer notifications:"; curl -s -b $J.c $B/api/notifications | head -c 300; echo
echo "   customer home now:"; curl -s -b $J.c $B/customer | grep -o 'Mức phí của bạn[^<]*<!-- -->[^<]*<!-- -->[^<]*' | head -1
```

Output (the customer home is server-rendered; the long React payload lines are cut):

```text
login c 200
login m 200
login s 200
1) customer home before hours:
Giờ hoạt động</dt><dd>Chưa cập nhật
2) manager sets 06:00-22:00:
  200
   bad pair:
{"error":"VALIDATION"}  400
   staff tries:
  403
3) customer home after:
Giờ hoạt động</dt><dd>06:00–22:00
Mức phí của bạn
2.000 đ mỗi lượt
10.000 đ mỗi lượt
4) customer group block:
Nhóm của bạn<!-- -->: <!-- -->Sinh viên
5) customer requests change:
{"userGroup":"STUDENT","requestedUserGroup":"LECTURER_STAFF"}  200
   list has passwordHash: false  requested: LECTURER_STAFF
6) manager applies:
{"id":"…","email":"customer01@demo.local","name":"Customer 01","roleCode":"CUSTOMER","userGroup":"LECTURER_STAFF","requestedUserGroup":null,"locked":false,"createdAt":"…"}  200
   customer notifications:
{"items":[{"id":"…","type":"GROUP_CHANGED","params":{},"createdAt":"…","readAt":null}],"unreadCount":1}
   customer home now:
Mức phí của bạn<!-- --> (<!-- -->Giảng viên / Nhân viên
```

A second request (back to Student) then showed `Đang chờ quản lý chuyển bạn sang: Sinh viên` on the customer home.
The seed gives every group the same prices (motorbike 2.000, car 10.000), so the fees shown do not change with the
group here; `tests/my-tariff.test.ts` uses different prices per group.
