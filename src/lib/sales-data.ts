
import type { Sale } from "@/types";

export const sales: Sale[] = [
  {
    id: "ORD-001",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@example.com",
    date: "2024-05-20T10:30:00Z",
    total: 250.00,
    status: "Fulfilled",
    items: [
      { productId: "1", productName: "Crimson Silk Saree", quantity: 1, price: 150.00 },
      { productId: "8", productName: "Casual Cotton Kurta", quantity: 2, price: 50.00 },
    ],
  },
  {
    id: "ORD-002",
    customerName: "Rohan Sharma",
    customerEmail: "rohan.sharma@example.com",
    date: "2024-05-22T14:00:00Z",
    total: 190.00,
    status: "Fulfilled",
    items: [
      { productId: "3", productName: "Classic White Kurta", quantity: 1, price: 70.00 },
      { productId: "4", productName: "Golden Border Dhoti", quantity: 1, price: 120.00 },
    ],
  },
  {
    id: "ORD-003",
    customerName: "Ananya Iyer",
    customerEmail: "ananya.iyer@example.com",
    date: "2024-05-23T11:45:00Z",
    total: 350.00,
    status: "Pending",
    items: [
      { productId: "2", productName: "Royal Blue Lehenga", quantity: 1, price: 350.00 },
    ],
  },
    {
    id: "ORD-004",
    customerName: "Vikram Singh",
    customerEmail: "vikram.singh@example.com",
    date: "2024-05-24T09:00:00Z",
    total: 100.00,
    status: "Fulfilled",
    items: [
        { productId: "6", productName: "Embroidered Kurta", quantity: 1, price: 100.00 },
    ],
  },
  {
    id: "ORD-005",
    customerName: "Meera Desai",
    customerEmail: "meera.desai@example.com",
    date: "2024-05-25T16:20:00Z",
    total: 95.00,
    status: "Cancelled",
    items: [
      { productId: "5", productName: "Green Georgette Saree", quantity: 1, price: 95.00 },
    ],
  },
  {
    id: "ORD-006",
    customerName: "Arjun Mehta",
    customerEmail: "arjun.mehta@example.com",
    date: "2024-05-26T18:00:00Z",
    total: 420.00,
    status: "Pending",
    items: [
      { productId: "7", productName: "Pastel Pink Lehenga", quantity: 1, price: 420.00 },
    ],
  },
];
