# API_MiniSmart
# Models
User
- name: String (Trên 2 kí tự chỉ gồm A-Z và a-z, Bắt buộc)
- surname: String (Trên 2 kí tự chỉ gồm A-Z và a-z, Bắt buộc)
- phone: String (Trên 9 kí tự chỉ gồm 0-9, Không bắt buộc)
- email: String (Bắt buộc)
- password: String (Bắt buộc)
# Auth API
# [POST] api/auth/register
Mô tả: Người dùng đăng kí
Truy cập: Công khai
Nhận dữ liệu: form-data { name , surname , phone , email , password }
# [POST] api/auth/login
Mô tả: Người dùng đăng kí
Truy cập: Công khai
Nhận dữ liệu: form-data { email , password }
