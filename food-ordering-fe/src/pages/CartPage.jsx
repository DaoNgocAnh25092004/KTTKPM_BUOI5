import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ORDER_SERVICE_URL } from "../config/api";

export default function CartPage() {
  const { cart, removeItem, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (cart.length === 0) {
      setError("Giỏ hàng trống!");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const payload = {
        userId: user.userId,
        items: cart.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
      };
      const res = await axios.post(`${ORDER_SERVICE_URL}/orders`, payload);
      clearCart();
      navigate(`/payment/${res.data.id}`, { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Tạo đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <p>🛒 Giỏ hàng trống</p>
        <button style={styles.backBtn} onClick={() => navigate("/foods")}>
          Xem thực đơn
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛒 Giỏ hàng</h2>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.items}>
        {cart.map((item) => (
          <div key={item.foodId} style={styles.item}>
            <div style={styles.itemInfo}>
              <span style={styles.itemName}>{item.name}</span>
              <span style={styles.itemPrice}>
                {item.price.toLocaleString("vi-VN")}đ / món
              </span>
            </div>
            <div style={styles.itemActions}>
              <button
                style={styles.qtyBtn}
                onClick={() => updateQty(item.foodId, item.quantity - 1)}
              >
                -
              </button>
              <span style={styles.qty}>{item.quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() => updateQty(item.foodId, item.quantity + 1)}
              >
                +
              </button>
              <span style={styles.subtotal}>
                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
              </span>
              <button
                style={styles.removeBtn}
                onClick={() => removeItem(item.foodId)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.total}>
          Tổng cộng:{" "}
          <strong style={{ color: "#ff6b35" }}>
            {total.toLocaleString("vi-VN")}đ
          </strong>
        </div>
        <button
          style={styles.orderBtn}
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? "Đang tạo đơn..." : "🍽️ Đặt hàng ngay"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "0 auto", padding: 24 },
  title: { color: "#ff6b35", marginBottom: 24 },
  items: { display: "flex", flexDirection: "column", gap: 12 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    flexWrap: "wrap",
    gap: 8,
  },
  itemInfo: { display: "flex", flexDirection: "column", gap: 4 },
  itemName: { fontWeight: 600, fontSize: 16 },
  itemPrice: { color: "#888", fontSize: 13 },
  itemActions: { display: "flex", alignItems: "center", gap: 10 },
  qtyBtn: {
    background: "#f3f4f6",
    border: "1px solid #ddd",
    borderRadius: 6,
    width: 32,
    height: 32,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
  },
  qty: { minWidth: 28, textAlign: "center", fontWeight: 700 },
  subtotal: {
    fontWeight: 700,
    color: "#ff6b35",
    minWidth: 80,
    textAlign: "right",
  },
  removeBtn: {
    background: "#fee2e2",
    border: "none",
    borderRadius: 6,
    width: 28,
    height: 28,
    cursor: "pointer",
    color: "#dc2626",
    fontWeight: 700,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    padding: "20px 0",
    borderTop: "2px solid #f3f4f6",
  },
  total: { fontSize: 18 },
  orderBtn: {
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 28px",
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
  empty: { textAlign: "center", padding: 80, color: "#888" },
  backBtn: {
    marginTop: 16,
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
