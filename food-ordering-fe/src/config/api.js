// ======================================================
// CẤU HÌNH IP CHO TỪNG SERVICE
// Khi demo trên LAN, thay localhost bằng IP thật của máy
// đang chạy service đó (ví dụ: http://192.168.1.10:8081)
// ======================================================

export const USER_SERVICE_URL =
  import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:8081";
export const FOOD_SERVICE_URL =
  import.meta.env.VITE_FOOD_SERVICE_URL || "http://localhost:8082";
export const ORDER_SERVICE_URL =
  import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:8083";
export const PAYMENT_SERVICE_URL =
  import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:8084";
