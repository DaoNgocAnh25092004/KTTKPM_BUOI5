import { useCart } from "../context/CartContext";

export default function FoodCard({ food }) {
  const { addItem } = useCart();

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.category}>{food.category}</span>
        {!food.available && <span style={styles.unavailable}>Hết hàng</span>}
      </div>
      <h3 style={styles.name}>{food.name}</h3>
      <p style={styles.desc}>{food.description}</p>
      <div style={styles.footer}>
        <span style={styles.price}>{food.price.toLocaleString("vi-VN")}đ</span>
        <button
          style={{
            ...styles.btn,
            ...(food.available ? {} : styles.btnDisabled),
          }}
          onClick={() => food.available && addItem(food)}
          disabled={!food.available}
        >
          + Thêm
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    background: "#fff3ee",
    color: "#ff6b35",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  unavailable: {
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
  },
  name: { margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" },
  desc: { margin: 0, fontSize: 13, color: "#666", flex: 1 },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: { fontWeight: 700, fontSize: 16, color: "#ff6b35" },
  btn: {
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnDisabled: { background: "#ccc", cursor: "not-allowed" },
};
