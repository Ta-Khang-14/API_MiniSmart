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

Cart - Giỏ hàng

-   User: String
-   products: Array
-   quantity: Array

Order - Hóa đơn

-   user: userID
-   name: String
-   email: String
-   address: String
-   city: String
-   district: String
-   note: String
-   products: String
-   quantity: String
-   sumMoney: Number
-   status: String ["Chờ xác nhận", "Chờ lấy hàng", "Đã thanh toán"]

Address

-   user: userID
-   name: String
-   phone: String
-   company: String
-   city: String
-   district: String
-   village: String

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

# [PUT] /api/auth/

-   Mô tả: Chỉnh sửa thông tin cá nhân
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { name, surname, email, phone }
-   Quyền: ['user', 'admin']

# [GET] /api/auth/

-   Mô tả: Lấy thông tin cá nhân
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ['user', 'admin']

# [POST] api/auth/change-password/

-   Mô tả: Người dùng đổi mật khẩu
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { password, newPassword, confirmNewPassword }
-   Quyền: ["admin", "user"]

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
    country,
    unit,
    category,
    newPictures
    }
-   Quyền: ["admin"]

# [GET] api/products/?sort&page&limit&field&search

-   Mô tả: Lấy danh sách sản phẩm
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

-   limit: Number (Số sản phẩm 1 trang. Mặc đinh = 5)
-   page: Number (Trang hiện tại. Mặc định = 1)
-   sort: String (Sắp xếp bản ghi. Nhận field cần sắp xếp, ví dụ: sort=name -price.)
-   field: Object (Lọc theo điều kiện field cụ thể. Ví dụ: price[gt] = 10000)
-   Thuộc tính của field: [gt,gte,lt,lte,eq] = ["lớn hơn", "lớn hơn bằng", "nhỏ hơn", "nhỏ hơn bằng", "bằng"]
-   search: String (Tìm sản phẩm theo giá trị. VD: search=Táo)

# [GET] api/products/:id

-   Mô tả: Lấy thông tin 1 sản phẩm bằng id
-   Truy cập: Công khai
-   Nhận dữ liệu: Không
-   Quyền: Tất cả

# [GET] api/products/category/:id

-   Mô tả: Lấy thông tin 1 sản phẩm bằng id category
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
-   Nhận dữ liệu: { productIds: [] }
-   Quyền: ["admin"]

# Cart API

# [GET] /api/cart/

-   Mô tả: Lấy thông tin giỏ hàng
-   Truy cập: Cá nhân
-   Nhận dữ liệu: không
-   Quyền: ["User"]

# [PUT] /api/cart/add

-   Mô tả: Thêm sản phẩm vào giỏ hàng
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { productId, quantity }
-   Quyền: ["User"]

# [PUT] /api/cart/update-product/:productId

-   Mô tả: Chỉnh sửa số lượng sản phẩm trong giỏ
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { quantity }
-   Quyền: ["User"]

# [PUT] /api/cart/delete-product/:productId

-   Mô tả: Xóa sản phẩm khỏi giỏ hàng
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["User"]

# [PUT] /api/cart/delete-product/

-   Mô tả: Xóa nhiều sản phẩm khỏi giỏ hàng
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { productIds:[] }
-   Quyền: ["User"]

# Order API

# [GET] /api/orders/

-   Mô tả: Lấy danh sách hóa đơn. Với
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["User", "Admin"]

# [GET] /api/orders/:orderId

-   Mô tả: Lấy thông tin chi tiết hóa đơn theo ID
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["User", "Admin"]

# [POST] /api/orders/

-   Mô tả: Tạo hóa đơn
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { name, email, address , note ,products, city, district, sumMoney, status }
-   Quyền: ["User", "Admin"]

# [PUT] /api/orders/change-status/:orderId

-   Mô tả: Thay đổi trạng thái hóa đơn
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { status }
-   Quyền: ["User", "Admin"]

# Address API

# [GET] /api/address/

-   Mô tả: Lấy danh sách địa chỉ
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["User"]

# [POST] /api/address/

-   Mô tả: Tạo địa chỉ mới
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { name, phone, company, city, district, village}
-   Quyền: ["User"]

# [PUT] /api/address/:addressId

-   Mô tả: Cập nhật địa chỉ
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { name, phone, company, city, district, village}
-   Quyền: ["User"]

# [DELETE] /api/address/:addressId

-   Mô tả: Xóa địa chỉ
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["User"]

# Admin API

# [GET] /api/admin/user

-   Mô tả: Lấy danh sách User
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["Admin"]

# [DELETE] /api/admin/user/delete/:id

-   Mô tả: Khóa tài khoản User by Id
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["Admin"]

# [DELETE] /api/admin/user/delete/

-   Mô tả: Khóa tài khoản Users
-   Truy cập: Cá nhân
-   Nhận dữ liệu: { userIds }
-   Quyền: ["Admin"]

# [PUT] /api/admin/user/activated/:id

-   Mô tả: Khóa tài khoản Users
-   Truy cập: Cá nhân
-   Nhận dữ liệu: Không
-   Quyền: ["Admin"]
