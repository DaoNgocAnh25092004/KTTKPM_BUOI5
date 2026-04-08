import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_SERVICE_URL } from "../config/api";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${USER_SERVICE_URL}/login`, form);
      login(res.data); // { userId, username, role }
      navigate("/foods");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🍜 Đăng nhập</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <p style={styles.link}>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
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
  },
  card: {
    background: "#fff",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 400,
  },
  title: { textAlign: "center", color: "#ff6b35", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: {
    padding: "12px 16px",
    border: "1.5px solid #ddd",
    borderRadius: 8,
    fontSize: 15,
    outline: "none",
  },
  btn: {
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "13px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 14,
  },
  link: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#666" },
};
