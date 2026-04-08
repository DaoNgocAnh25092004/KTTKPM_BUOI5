# HƯỚNG DẪN TRIỂN KHAI — Mini Food Ordering System

## Docker Compose (Backend) + React (Frontend trên máy khác)

---

## Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────┐
│               MÁY BACKEND (Docker Host)             │
│                   IP: 192.168.X.X                   │
│                                                     │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ Docker       │  │         food-network         │ │
│  │ Compose      │  │  user-service    :8081        │ │
│  │              │  │  food-service    :8082        │ │
│  │              │  │  order-service   :8083  ──┐   │ │
│  │              │  │  payment-service :8084  ──┘   │ │
│  └──────────────┘  └──────────────────────────────┘ │
│        Ports 8081–8084 mở ra ngoài LAN              │
└─────────────────────────────────────────────────────┘
           ↕  HTTP qua LAN (port 8081–8084)
┌──────────────────────────────┐
│    MÁY FRONTEND (máy khác)   │
│    npm run dev  →  :5173     │
│    Axios gọi IP:port         │
└──────────────────────────────┘
```

**Lưu ý quan trọng:**

- Bên trong Docker, các service gọi nhau bằng **tên container** (`http://food-service:8082`)
- Frontend trên máy khác gọi qua **IP thật** của máy backend (`http://192.168.X.X:8082`)

---

## YÊU CẦU CÀI ĐẶT

### Máy Backend

| Phần mềm       | Phiên bản tối thiểu                | Link tải                                       |
| -------------- | ---------------------------------- | ---------------------------------------------- |
| Docker Desktop | 4.x                                | https://www.docker.com/products/docker-desktop |
| Docker Compose | v2 (tích hợp trong Docker Desktop) | —                                              |

> **Kiểm tra:** Mở terminal → `docker --version` && `docker compose version`

### Máy Frontend

| Phần mềm | Phiên bản tối thiểu |
| -------- | ------------------- |
| Node.js  | 18+                 |
| npm      | 9+                  |

---

## BƯỚC 1 — Chuẩn bị máy Backend

### 1.1 Tìm IP của máy Backend

Mở **Command Prompt** hoặc **PowerShell**, chạy:

```cmd
ipconfig
```

Tìm dòng **IPv4 Address** trong phần **Wi-Fi** (hoặc Ethernet nếu dùng dây):

```
IPv4 Address. . . . . . . . . . . : 192.168.1.10   ← ĐÂY LÀ IP CẦN GHI LẠI
```

> **Ghi lại IP này**, sẽ dùng ở Bước 3.

### 1.2 Kiểm tra Firewall

Mở **Windows Defender Firewall** → **Advanced Settings** → **Inbound Rules** → **New Rule**:

- Rule Type: **Port**
- Protocol: **TCP**
- Specific ports: `8081, 8082, 8083, 8084`
- Action: **Allow the connection**
- Name: `Food Ordering Backend`

Hoặc dùng PowerShell (chạy với quyền Admin):

```powershell
New-NetFirewallRule -DisplayName "Food Backend 8081-8084" -Direction Inbound -Protocol TCP -LocalPort 8081,8082,8083,8084 -Action Allow
```

---

## BƯỚC 2 — Chạy Backend bằng Docker Compose

### 2.1 Clone/copy project lên máy Backend

Đảm bảo thư mục `Buổi 5/` có cấu trúc sau:

```
Buổi 5/
├── docker-compose.yml       ← file quan trọng nhất
├── user-service/
│   ├── Dockerfile
│   └── src/...
├── food-service/
│   ├── Dockerfile
│   └── src/...
├── order-service/
│   ├── Dockerfile
│   └── src/...
├── payment-service/
│   ├── Dockerfile
│   └── src/...
└── food-ordering-fe/        ← KHÔNG cần trên máy này
```

### 2.2 Khởi động toàn bộ Backend

Mở terminal tại thư mục `Buổi 5/`:

```bash
# Build image và khởi động tất cả 4 containers (lần đầu mất 2–5 phút)
docker compose up -d --build
```

**Giải thích các tham số:**

- `up` — khởi động services
- `-d` — chạy nền (detach), không chiếm terminal
- `--build` — rebuild image (dùng lần đầu hoặc sau khi sửa code)

### 2.3 Kiểm tra containers đang chạy

```bash
docker compose ps
```

Kết quả mong đợi:

```
NAME               STATUS          PORTS
user-service       Up (healthy)    0.0.0.0:8081->8081/tcp
food-service       Up (healthy)    0.0.0.0:8082->8082/tcp
order-service      Up (healthy)    0.0.0.0:8083->8083/tcp
payment-service    Up              0.0.0.0:8084->8084/tcp
```

### 2.4 Kiểm tra nhanh bằng curl (tùy chọn)

```bash
# Kiểm tra Food Service
curl http://localhost:8082/foods

# Kiểm tra User Service
curl http://localhost:8081/users
```

---

## BƯỚC 3 — Cấu hình và chạy Frontend (máy khác)

### 3.1 Copy thư mục `food-ordering-fe` sang máy Frontend

Có thể dùng:

- USB, Google Drive, hoặc chia sẻ qua LAN (\\\\IP_BACKEND\share)
- Git: push lên GitHub rồi clone về

### 3.2 Tạo file `.env` với IP của máy Backend

Trong thư mục `food-ordering-fe/`:

```bash
# Sao chép file mẫu
cp .env.example .env
```

Mở file `.env` vừa tạo, **thay `192.168.X.X` bằng IP thật của máy Backend** (đã ghi ở Bước 1.1):

```env
VITE_USER_SERVICE_URL=http://192.168.1.10:8081
VITE_FOOD_SERVICE_URL=http://192.168.1.10:8082
VITE_ORDER_SERVICE_URL=http://192.168.1.10:8083
VITE_PAYMENT_SERVICE_URL=http://192.168.1.10:8084
```

> ⚠️ **KHÔNG dùng `localhost`** — localhost ở đây là máy Frontend, không phải máy Backend!

### 3.3 Cài dependencies và chạy

```bash
cd food-ordering-fe

npm install

npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## BƯỚC 4 — Kịch bản Demo (Bắt buộc)

### Test từ máy Frontend (browser):

1. **Truy cập** `http://localhost:5173`
2. **Đăng ký** → điền username/password → click Đăng ký
3. **Đăng nhập** → điền thông tin vừa đăng ký
4. **Xem thực đơn** → 8 món ăn hiện ra từ Food Service
5. **Thêm món** → click "+ Thêm" 2–3 món → vào Giỏ hàng
6. **Đặt hàng** → click "Đặt hàng ngay" → chờ xác nhận
7. **Thanh toán** → chọn COD hoặc Banking → click Xác nhận
8. **Xem notification** → màn hình hiện `✅ Thanh toán thành công`

### Kiểm tra Notification trên máy Backend:

```bash
docker compose logs payment-service --tail=20
```

Kết quả:

```
============================================================
[NOTIFICATION] username đã đặt đơn #1 thành công (BANKING)
============================================================
```

---

## CÁC LỆNH QUẢN LÝ DOCKER HỮU ÍCH

```bash
# Xem logs realtime tất cả services
docker compose logs -f

# Xem logs của 1 service cụ thể
docker compose logs -f order-service

# Dừng tất cả containers (giữ data)
docker compose stop

# Dừng và xóa containers
docker compose down

# Rebuild lại 1 service sau khi sửa code
docker compose up -d --build order-service

# Restart 1 service
docker compose restart payment-service

# Xem resource usage
docker stats
```

---

## XỬ LÝ SỰ CỐ

### ❌ Frontend báo "Network Error" hoặc CORS

**Nguyên nhân:** Sai IP trong file `.env`
**Giải pháp:**

1. Kiểm tra IP backend: `ipconfig` trên máy backend
2. Sửa lại file `.env` trên máy frontend
3. Restart frontend: `Ctrl+C` → `npm run dev`

### ❌ `docker compose ps` hiện STATUS = "Exiting"

**Nguyên nhân:** Container bị lỗi khi khởi động
**Giải pháp:**

```bash
docker compose logs <tên-service>
# Ví dụ:
docker compose logs order-service
```

### ❌ Port đã bị chiếm (Port already in use)

**Giải pháp:**

```bash
# Tìm process chiếm port 8081
netstat -ano | findstr :8081

# Kill process theo PID
taskkill /PID <PID> /F
```

### ❌ Máy Frontend ping không thấy máy Backend

**Giải pháp:**

1. Kiểm tra 2 máy trong cùng mạng Wi-Fi
2. Tắt Firewall tạm thời để test: `netsh advfirewall set allprofiles state off`
3. Thêm rule Firewall như hướng dẫn ở Bước 1.2

### ❌ `docker: command not found`

**Giải pháp:** Cài Docker Desktop rồi **restart lại terminal**

---

## CẤU TRÚC FILE CUỐI CÙNG

```
Buổi 5/
├── docker-compose.yml         ← Chạy: docker compose up -d --build
├── user-service/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/...
├── food-service/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/...
├── order-service/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/...
├── payment-service/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/...
└── food-ordering-fe/
    ├── .env.example           ← Mẫu cấu hình IP
    ├── .env                   ← Tạo từ .env.example (điền IP thật)
    └── src/...
```

---

## TÓM TẮT NHANH (Cheat Sheet)

### Máy Backend (1 lần duy nhất):

```bash
cd "Buổi 5"
docker compose up -d --build
```

### Máy Frontend (mỗi lần chạy):

```bash
# Lần đầu: tạo .env từ mẫu rồi sửa IP
cp .env.example .env
# → Mở .env, thay 192.168.X.X bằng IP máy backend

# Chạy frontend
cd food-ordering-fe
npm install
npm run dev
# → Mở http://localhost:5173
```
