import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav style={styles.nav}>
      <Link to="/foods" style={styles.brand}>
        🍜 Mini Food
      </Link>
      <div style={styles.links}>
        <Link to="/foods" style={styles.link}>
          Thực đơn
        </Link>
        <Link to="/cart" style={styles.link}>
          🛒 Giỏ hàng{" "}
          {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
        </Link>
        {user ? (
          <>
            <span style={styles.userInfo}>
              👤 {user.username} ({user.role})
            </span>
            <button onClick={handleLogout} style={styles.btn}>
              Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#ff6b35",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  brand: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 20,
  },
  links: { display: "flex", alignItems: "center", gap: 16 },
  link: { color: "#fff", textDecoration: "none", fontWeight: 500 },
  btn: {
    background: "rgba(255,255,255,0.2)",
    border: "1px solid #fff",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 6,
    padding: "6px 14px",
    fontWeight: 500,
  },
  userInfo: { fontSize: 13, opacity: 0.9 },
  badge: {
    background: "#fff",
    color: "#ff6b35",
    borderRadius: "50%",
    padding: "2px 7px",
    fontSize: 12,
    fontWeight: 700,
    marginLeft: 4,
  },
};
