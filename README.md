# API_MiniSmart

# Models

User - Người dùng

-   name: String (Trên 2 kí tự chỉ gồm A-Z và a-z, Bắt buộc)
-   surname: String (Trên 2 kí tự chỉ gồm A-Z và a-z, Bắt buộc)
-   phone: String (Trên 9 kí tự chỉ gồm 0-9, Không bắt buộc)
-   email: String (Bắt buộc)
-   password: String (Bắt buộc)
-   role: ["user", "Admin"]
-   isActive: Boolean
-   favoriteProducts: Array

Category - Danh mục sản phẩm

-   name: String (Bắt buộc)

Product - Sản phẩm

-   title: String (Bắt buộc)
-   description: String (Bắt buộc)
-   pictures: Array
-   price: Number (Bắt buộc)
-   discount: Number (Bắt buộc)
-   quantity: Number (Bắt buộc)
-   sellNumber: Number
-   unit: String
-   postedBy: String(Tham chiếu đến users)
-   category: String (Tham chiếu đến categories)

Post - Bài viết

-   title: String (Bắt buộc)
-   description: String (Bắt buộc)
-   pictures: Array
-   postedBy: String(Tham chiếu đến users)
-   postedAt: Date

Diary - Nhật kí cập nhật sản phẩm

-   productId: String
-   nameProduct: String
-   updatedBy: Array
-   updatedAt: Array
-   message: Array
-   isDeleted: Boolean

# Auth API

# [POST] api/auth/register/

-   Mô tả: Người dùng đăng kí
-   Truy cập: Công khai
-   Nhận dữ liệu: { name , surname , phone , email , password }
-   Quyền: Tất cả

# [GET] /api/auth/confirm/:id

-   Mô tả: Người dùng kích hoạt tài khoản
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
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
-   Nhận dữ liệu: { resetCode, resetPassword, confirmResetPassword }
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

# [POST] api/posts/

-   Mô tả: Thêm mới bài viết
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { title, description, pictures }
-   Quyền: ['user','admin']

# [GET] api/posts/

-   Mô tả: Lấy danh sách bài viết
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

# [GET] api/posts/:id

-   Mô tả: Lấy danh sách bài viết theo id
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

# [PUT] api/posts/

-   Mô tả: Chỉnh sửa bài viết
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { title, description, pictures }
-   Quyền: ['user','admin']

# [DELETE] api/posts/:id

-   Mô tả: Xóa sửa bài viết
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ['user','admin']

# Products API

# [POST] api/products/

-   Mô tả: Tạo 1 sản phẩm mới
-   Truy cập: Cá nhân
-   Nhận dữ liệu: {
    title,
    description,
    pictures,
    price,
    discount,
    quantity,
    country,
    unit,
    category,
    }
-   Quyền: ["admin"]

# [PUT] api/products/:id

-   Mô tả: Update 1 sản phẩm với Id
-   Truy cập: Cá nhân
-   Nhận dữ liệu: {
    title,
    description,
    pictures,
    price,
    discount,
    quantity,
    country,
    unit,
    category,
    }
-   Quyền: ["admin"]

# [GET] api/products/

-   Mô tả: Lấy danh sách sản phẩm
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

# [GET] api/products/:id

-   Mô tả: Lấy thông tin 1 sản phẩm bằng id
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

# [DELETE] api/products/:id

-   Mô tả: Xóa 1 sản phẩm bằng id
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: ["admin"]

# [DELETE] api/products/

-   Mô tả: Xóa nhiều sản phẩm bằng id
-   Truy cập: Công khai
-   Nhận dữ liệu: {
    productIds: []
    }
-   Quyền: ["admin"]
