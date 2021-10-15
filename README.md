# API_MiniSmart

# Models

User

-   name: String (Trên 2 kí tự chỉ gồm A-Z và a-z, Bắt buộc)
-   surname: String (Trên 2 kí tự chỉ gồm A-Z và a-z, Bắt buộc)
-   phone: String (Trên 9 kí tự chỉ gồm 0-9, Không bắt buộc)
-   email: String (Bắt buộc)
-   password: String (Bắt buộc)

Category

-   name: String (Bắt buộc)

Product

-   title: String (Bắt buộc)
-   description: String (Bắt buộc)
-   pictures: Array
-   price: Number (Bắt buộc)
-   discount: Number (Bắt buộc)
-   quantity: Number (Bắt buộc)
-   sellNumber: Number
-   unit: String
-   postedBy: String(Tham chiếu đến users)
-   updatedBy: Array
-   updatedAt: Array
-   category: String (Tham chiếu đến categories)

Post

-   title: String (Bắt buộc)
-   description: String (Bắt buộc)
-   picture: Array
-   postedBy: String(Tham chiếu đến users)
-   postedAt: Date

# Auth API

# [POST] api/auth/register/

-   Mô tả: Người dùng đăng kí
-   Truy cập: Công khai
-   Nhận dữ liệu: { name , surname , phone , email , password }
-   Quyền: Tất cả

# [POST] api/auth/login/

-   Mô tả: Người dùng đăng nhập
-   Truy cập: Công khai
-   Nhận dữ liệu: { email , password }
-   Quyền: Tất cả

# [POST] api/auth/access-token/

-   Mô tả: Lấy mã access token mới
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { refreshToken }
-   Quyền: ['user', 'admin']

# [POST] api/auth/forget-password/

-   Mô tả: Quên mật khẩu
-   Truy cập: Công khai
-   Nhận dữ liệu: { email }
-   Quyền: ['user', 'admin']

# [POST] api/auth/reset-password/

-   Mô tả: Xác thực mã + đổi mật khẩu
-   Truy cập: Công khai
-   Nhận dữ liệu: { email }
-   Quyền: ['user', 'admin']

# Category API

# [POST] api/categories/

-   Mô tả: Thêm mới danh mục
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { name }
-   Quyền: ['admin']

# [GET] api/categories/

-   Mô tả: Lấy danh sách danh mục
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

# Post API
