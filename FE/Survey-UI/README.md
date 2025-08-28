# Survey Management System - Frontend

## Tính năng đã hoàn thành

### 1. Quản lý người dùng (Admin)
- ✅ Hiển thị danh sách người dùng từ database
- ✅ Hiển thị thông tin: Họ tên, Email, Vai trò, Phòng ban, Level
- ✅ Thêm người dùng mới với validation
- ✅ Sửa thông tin người dùng (có thể giữ nguyên hoặc thay đổi mật khẩu)
- ✅ Xóa người dùng với xác nhận
- ✅ Thống kê số lượng người dùng theo vai trò
- ✅ Import/Export Excel (giao diện đã sẵn, cần implement backend)

### 2. Quản lý phòng ban (Admin)
- ✅ Hiển thị danh sách phòng ban
- ✅ Thêm phòng ban mới
- ✅ Sửa tên phòng ban
- ✅ Xóa phòng ban (kiểm tra ràng buộc)

### 3. Authentication & Authorization
- ✅ JWT Token authentication
- ✅ Role-based access control
- ✅ Protected routes cho admin

## Cách sử dụng

### 1. Đăng nhập Admin
- Email: `admin@company.com`
- Password: `admin123`

### 2. Quản lý người dùng
- Vào menu "Quản lý người dùng"
- Xem danh sách người dùng hiện có
- Click "Thêm người dùng" để tạo mới
- Click "Sửa" để chỉnh sửa thông tin
- Click "Xóa" để xóa người dùng

### 3. Quản lý phòng ban
- Vào menu "Quản lý phòng ban"
- Quản lý các phòng ban trong hệ thống

## Cấu trúc API

### Users
- `GET /api/User` - Lấy danh sách người dùng
- `GET /api/User/{id}` - Lấy thông tin người dùng
- `POST /api/User` - Tạo người dùng mới
- `PUT /api/User/{id}` - Cập nhật người dùng
- `DELETE /api/User/{id}` - Xóa người dùng

### Departments
- `GET /api/Department` - Lấy danh sách phòng ban
- `POST /api/Department` - Tạo phòng ban mới
- `PUT /api/Department/{id}` - Cập nhật phòng ban
- `DELETE /api/Department/{id}` - Xóa phòng ban

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Truy cập: `http://localhost:5173`

## Lưu ý

- Backend cần chạy trên port 5029
- Database cần có dữ liệu mẫu (đã có seed data)
- JWT token được lưu trong localStorage
- Các API endpoints cần authentication token

## Tính năng sắp tới

- [ ] Import/Export Excel cho người dùng
- [ ] Quản lý câu hỏi và bài test
- [ ] Báo cáo và thống kê
- [ ] Quản lý vai trò (Roles)
- [ ] Audit log cho các thay đổi
