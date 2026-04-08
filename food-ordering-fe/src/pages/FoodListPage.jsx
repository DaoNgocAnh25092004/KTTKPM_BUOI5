import { useState, useEffect } from "react";
import axios from "axios";
import FoodCard from "../components/FoodCard";
import { FOOD_SERVICE_URL } from "../config/api";

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");

  useEffect(() => {
    axios
      .get(`${FOOD_SERVICE_URL}/foods`)
      .then((res) => setFoods(res.data))
      .catch(() =>
        setError("Không kết nối được Food Service. Kiểm tra lại IP/port."),
      )
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Tất cả", ...new Set(foods.map((f) => f.category))];

  const filtered = foods.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Tất cả" || f.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return <div style={styles.center}>⏳ Đang tải thực đơn...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🍽️ Thực đơn hôm nay</h2>

      <div style={styles.filters}>
        <input
          style={styles.search}
          placeholder="Tìm món ăn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.cats}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                ...styles.catBtn,
                ...(category === c ? styles.catActive : {}),
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={styles.empty}>Không tìm thấy món nào.</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: "0 auto", padding: 24 },
  title: { color: "#ff6b35", marginBottom: 24 },
  filters: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  search: {
    padding: "10px 16px",
    border: "1.5px solid #ddd",
    borderRadius: 8,
    fontSize: 15,
    maxWidth: 400,
  },
  cats: { display: "flex", gap: 8, flexWrap: "wrap" },
  catBtn: {
    padding: "6px 16px",
    border: "1.5px solid #ddd",
    borderRadius: 20,
    cursor: "pointer",
    background: "#fff",
    fontWeight: 500,
  },
  catActive: {
    background: "#ff6b35",
    color: "#fff",
    border: "1.5px solid #ff6b35",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
  center: { textAlign: "center", padding: 60, color: "#888" },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "16px 24px",
    borderRadius: 8,
    margin: 24,
  },
  empty: { textAlign: "center", color: "#888", padding: 40 },
};
