import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PAYMENT_SERVICE_URL } from "../config/api";

export default function PaymentPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const order = state?.order;

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${PAYMENT_SERVICE_URL}/payments`, {
        orderId: Number(orderId),
        userId: user.userId,
        method,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.checkmark}>✅</div>
          <h2 style={{ color: "#16a34a" }}>Thanh toán thành công!</h2>
          <p style={styles.notif}>
            <strong>{user?.username}</strong> đã đặt đơn{" "}
            <strong>#{result.orderId}</strong> thành công
          </p>
          <div style={styles.details}>
            <div>
              Phương thức: <strong>{result.method}</strong>
            </div>
            <div>
              Trạng thái:{" "}
              <strong style={{ color: "#16a34a" }}>{result.status}</strong>
            </div>
            <div>
              Mã thanh toán: <strong>#{result.id}</strong>
            </div>
          </div>
          <button style={styles.homeBtn} onClick={() => navigate("/foods")}>
            🍽️ Tiếp tục đặt món
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💳 Thanh toán</h2>

        {order && (
          <div style={styles.summary}>
            <h3 style={{ marginTop: 0 }}>Đơn hàng #{order.id}</h3>
            {order.items.map((item, i) => (
              <div key={i} style={styles.orderItem}>
                <span>
                  {item.foodName} × {item.quantity}
                </span>
                <span>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
            <div style={styles.orderTotal}>
              Tổng:{" "}
              <strong style={{ color: "#ff6b35" }}>
                {order.totalAmount?.toLocaleString("vi-VN")}đ
              </strong>
            </div>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.methodGroup}>
          <p style={styles.label}>Chọn phương thức thanh toán:</p>
          <label style={styles.methodOption}>
            <input
              type="radio"
              name="method"
              value="COD"
              checked={method === "COD"}
              onChange={() => setMethod("COD")}
            />
            🚚 COD — Thanh toán khi nhận hàng
          </label>
          <label style={styles.methodOption}>
            <input
              type="radio"
              name="method"
              value="BANKING"
              checked={method === "BANKING"}
              onChange={() => setMethod("BANKING")}
            />
            🏦 Banking — Chuyển khoản ngân hàng
          </label>
        </div>

        <button style={styles.payBtn} onClick={handlePay} disabled={loading}>
          {loading ? "Đang xử lý..." : `Xác nhận thanh toán (${method})`}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff8f5",
    padding: 24,
  },
  card: {
    background: "#fff",
    padding: 36,
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 500,
  },
  title: { color: "#ff6b35", marginBottom: 24 },
  summary: {
    background: "#fff8f5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #f0e8e0",
    fontSize: 14,
  },
  orderTotal: { textAlign: "right", marginTop: 12, fontSize: 16 },
  label: { fontWeight: 600, marginBottom: 10 },
  methodGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 24,
  },
  methodOption: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15,
  },
  payBtn: {
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "14px",
    width: "100%",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 16,
  },
  successCard: {
    background: "#fff",
    padding: 48,
    borderRadius: 20,
    boxShadow: "0 4px 32px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: 420,
  },
  checkmark: { fontSize: 64, marginBottom: 16 },
  notif: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 15,
  },
  details: {
    background: "#f9fafb",
    padding: 16,
    borderRadius: 10,
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 24,
  },
  homeBtn: {
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};
