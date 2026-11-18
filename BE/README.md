# BloomCraft Backend — Identity và Catalog API

Base URL: `/api/v1`

## Quy ước chung

- Request và response dùng JSON, trừ refresh token được truyền bằng cookie `HttpOnly`.
- Access token được gửi qua header `Authorization: Bearer <accessToken>`.
- Response thành công: `{ "success": true, "data": ... }`. Riêng đăng ký và logout chỉ trả `{ "success": true }`.
- Response lỗi: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`.
- `price` là decimal string để giữ nguyên độ chính xác, ví dụ `"350000.00"`.
- Public Catalog chỉ trả sản phẩm `ACTIVE`, chưa bị soft-delete và category đang active.

## Identity API

### `POST /identity/register`

Tạo user `ACTIVE` và gán role `CUSTOMER` trong cùng transaction.

```json
{
  "email": "customer@example.com",
  "password": "Valid@123",
  "fullName": "Bloom Customer",
  "phone": "0900000000"
}
```

- Email được trim và chuyển lowercase.
- Password dài 8–32 ký tự, có chữ hoa, chữ thường, chữ số và ký tự đặc biệt không phải khoảng trắng.
- Thành công: `201 { "success": true }`.
- Email trùng: `409 EMAIL_ALREADY_EXISTS`.
- Rate limit mặc định: 5 request/IP/giờ.

### `POST /identity/login`

```json
{
  "email": "customer@example.com",
  "password": "Valid@123"
}
```

Thành công trả `accessToken` và profile public. Refresh token opaque được đặt trong cookie `refreshToken`, không xuất hiện trong JSON.

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "profile": {
      "id": "uuid",
      "email": "customer@example.com",
      "fullName": "Bloom Customer",
      "phone": "0900000000",
      "avatarUrl": null,
      "roles": ["CUSTOMER"]
    }
  }
}
```

- Credential hoặc trạng thái account không hợp lệ: `401 INVALID_CREDENTIALS` với thông báo chung.
- Rate limit mặc định: 10 request/IP/15 phút.

### `POST /identity/refresh`

Yêu cầu cookie `refreshToken`. Token hiện tại được revoke và token mới được tạo trong cùng transaction; replay token cũ trả `401`.

```json
{
  "success": true,
  "data": { "accessToken": "..." }
}
```

Rate limit mặc định: 30 request/IP/15 phút.

### `POST /identity/logout`

Yêu cầu cookie refresh hợp lệ. Revoke phiên hiện tại và xóa cookie. Thành công trả `{ "success": true }`.

### `GET /identity/profile`

Yêu cầu Bearer access token. Trả `id`, `email`, `fullName`, `phone`, `avatarUrl`, `roles`.

### `PATCH /identity/profile`

Yêu cầu Bearer access token. Nhận ít nhất một trong các field sau:

```json
{
  "fullName": "Tên mới",
  "phone": null,
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

Không nhận `email`, `password`, `roles`, `status` hoặc address. Field ngoài allowlist trả `422 VALIDATION_ERROR`.

## Authorization middleware

- `authenticate` xác minh JWT rồi tải user từ database để bảo đảm account còn `ACTIVE`.
- JWT chứa role đã ký; `authorizeRoles(...roles)` kiểm tra role mà không nhận role tự khai báo từ client.
- Thay đổi role có hiệu lực khi access token hiện tại hết hạn, tối đa 15 phút theo cấu hình mặc định.

## Catalog API

### `GET /catalog/categories`

Trả danh sách category active dạng phẳng, sắp xếp theo tên. Field public: `id`, `name`, `slug`, `description`, `parentId`.

### `GET /catalog/products`

Query parameters:

| Tên | Mặc định | Quy tắc |
| --- | --- | --- |
| `page` | `1` | Số nguyên dương |
| `limit` | `20` | Từ 1 đến 100 |
| `search` | - | Tìm không phân biệt hoa thường trong tên/mô tả |
| `category` | - | Category slug trực tiếp |
| `sort` | `newest` | `newest`, `price_asc`, `price_desc` |

Mỗi item chỉ trả ảnh primary. Pagination metadata gồm `page`, `limit`, `totalItems`, `totalPages`, `hasNextPage`, `hasPreviousPage`. Category không tồn tại hoặc page vượt phạm vi trả mảng rỗng với HTTP `200`.

### `GET /catalog/products/:slug`

Trả product public cùng toàn bộ `images` được sắp xếp và `categories` active. Product không tồn tại, inactive hoặc đã soft-delete trả `404 PRODUCT_NOT_FOUND`.

## Cấu hình môi trường

Ứng dụng fail-fast nếu thiếu cấu hình bắt buộc. Không commit secret vào repository.

| Biến | Bắt buộc | Mặc định |
| --- | --- | --- |
| `DATABASE_URL` | Có | - |
| `JWT_ACCESS_SECRET` | Có, tối thiểu 32 ký tự | - |
| `JWT_ISSUER` | Có | - |
| `JWT_AUDIENCE` | Có | - |
| `PORT` | Không | `5000` |
| `ACCESS_TOKEN_TTL_SECONDS` | Không | `900` |
| `REFRESH_TOKEN_TTL_DAYS` | Không | `30` |
| `CORS_ORIGIN` | Không | `http://localhost:5173` |
| `COOKIE_SECURE` | Không | `false` |
| `DATABASE_SSL` | Không | `true` |
| `REGISTER_RATE_LIMIT_PER_HOUR` | Không | `5` |
| `LOGIN_RATE_LIMIT_PER_15_MINUTES` | Không | `10` |
| `REFRESH_RATE_LIMIT_PER_15_MINUTES` | Không | `30` |

Cookie refresh dùng `HttpOnly`, `SameSite=Lax`, path `/api/v1/identity`; `Secure` luôn bật trong production hoặc khi `COOKIE_SECURE=true`. CORS chỉ cho phép đúng `CORS_ORIGIN` và bật credentials.

## Kiểm tra chất lượng

```bash
pnpm typecheck
pnpm typecheck:test
pnpm build
pnpm test
pnpm test:integration
```

Integration suite kết nối trực tiếp PostgreSQL thật qua `DATABASE_URL`. Mọi record được tạo có marker `TEST` và được giữ lại để nhận diện, không tự xóa sau test. Chỉ chạy suite trên database mà bạn cho phép chứa dữ liệu kiểm thử.
