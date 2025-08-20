# Survey Management - Admin Interface

Giao diện quản trị cho hệ thống Survey Management được xây dựng bằng React và Ant Design.

## 🚀 Cách chạy ứng dụng

### 1. Khởi động API Backend
```bash
# Mở terminal và chuyển đến thư mục backend
cd SurveyManagement

# Chạy API server
dotnet run
```

API server sẽ chạy tại: `https://localhost:5029`

### 2. Khởi động Frontend
```bash
# Mở terminal mới và chuyển đến thư mục frontend
cd FE/Survey-UI

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🔐 Tài khoản mặc định

### Đăng nhập với tài khoản có sẵn:
- **Email:** `admin@company.com`
- **Password:** `123456`

### Hoặc đăng ký tài khoản mới:
- Truy cập: `http://localhost:5173/register`
- Điền thông tin và tạo tài khoản mới

## 📋 Tính năng chính

### 🔐 Authentication
- Đăng nhập/Đăng ký với JWT
- Bảo vệ route admin
- Quản lý token tự động

### 📊 Dashboard
- Thống kê tổng quan
- Quick actions
- Biểu đồ phân bố

### 👥 Quản lý người dùng
- CRUD người dùng
- Phân quyền theo Role
- Import/Export Excel

### ❓ Quản lý câu hỏi
- Tạo/sửa/xóa câu hỏi
- Phân loại theo kỹ năng và độ khó
- Hỗ trợ trắc nghiệm và tự luận

### 📝 Quản lý bài test
- Tạo bài test với 3 bước
- Phân công người tham gia
- Theo dõi tiến độ

## 🛠️ Công nghệ sử dụng

- **Frontend:** React 18, Vite
- **UI Library:** Ant Design
- **Routing:** React Router DOM
- **State Management:** React Hooks
- **HTTP Client:** Fetch API
- **Authentication:** JWT

## 📁 Cấu trúc thư mục

```
FE/Survey-UI/
├── src/
│   ├── components/
│   │   ├── Admin/          # Components cho admin panel
│   │   └── Auth/           # Components authentication
│   ├── config/
│   │   └── api.js          # Cấu hình API endpoints
│   ├── App.jsx             # Component chính
│   └── main.jsx            # Entry point
├── package.json
└── README.md
```

## 🔧 Cấu hình API

File `src/config/api.js` chứa cấu hình API endpoints:

```javascript
export const API_BASE_URL = 'https://localhost:5029';
export const API_ENDPOINTS = {
  LOGIN: '/api/Auth/login',
  REGISTER: '/api/Auth/register',
  // ... các endpoints khác
};
```

## 🚨 Troubleshooting

### Lỗi kết nối API
1. Kiểm tra API server đã chạy chưa
2. Chạy lệnh `dotnet run` trong thư mục `SurveyManagement`
3. Kiểm tra port 5029 có bị chiếm không

### Lỗi CORS
- API server đã được cấu hình CORS để cho phép frontend
- Nếu vẫn lỗi, kiểm tra cấu hình CORS trong `Program.cs`

### Lỗi build
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install

# Hoặc clear cache
npm run build --force
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12)
2. Kiểm tra terminal chạy API
3. Đảm bảo cả frontend và backend đều đang chạy

---

**Lưu ý:** Đảm bảo API backend đang chạy trước khi sử dụng frontend!
