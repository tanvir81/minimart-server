require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

// Seed products (in-memory)
let products = [
  {
    id: "1",
    name: "Perfume",
    price: 50,
    stock: 10,
    category: "grocery",
    image: "/images/perfume.jpg",
  },
  {
    id: "2",
    name: "Shoes",
    price: 80,
    stock: 5,
    category: "clothing",
    image: "/images/shoes.jpg",
  },
  {
    id: "3",
    name: "Watch",
    price: 120,
    stock: 3,
    category: "electronics",
    image: "/images/watch.jpg",
  },
  {
    id: "4",
    name: "Laptop",
    price: 900,
    stock: 7,
    category: "electronics",
    image: "/images/laptop.jpg",
  },
  {
    id: "5",
    name: "Backpack",
    price: 40,
    stock: 15,
    category: "accessories",
    image: "/images/backpack.jpg",
  },
  {
    id: "6",
    name: "Headphones",
    price: 70,
    stock: 8,
    category: "electronics",
    image: "/images/headphones.jpg",
  },
];

// Routes
app.get("/api/products", (req, res) => res.json(products));

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const b = req.body || {};
  const newProduct = {
    id: Date.now().toString(),
    name: b.name,
    shortDescription: b.shortDescription || "No short description",
    fullDescription: b.fullDescription || "No full description",
    price: Number(b.price) || 0,
    date: b.date || new Date().toISOString().split("T")[0],
    priority: b.priority || "Medium",
    stock: Number(b.stock) || 0,
    image:
      b.image?.startsWith("http") || b.image?.startsWith("/")
        ? b.image
        : b.image
        ? `/images/${b.image}`
        : "/images/default.jpg",
    category: b.category || "misc",
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  let updated = false;
  products = products.map((p) => {
    if (p.id === req.params.id) {
      updated = true;
      return { ...p, ...req.body };
    }
    return p;
  });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product updated" });
});

app.delete("/api/products/:id", (req, res) => {
  const initial = products.length;
  products = products.filter((p) => p.id !== req.params.id);
  if (products.length === initial)
    return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.PORT || !process.env.CORS_ORIGIN) {
    console.warn("Warning: Missing env variables. Check your .env.");
  }
});
