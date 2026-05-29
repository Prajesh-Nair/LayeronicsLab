import type { Product } from "@/components/site/ProductCard";
import { SEED_PRODUCT_CATEGORIES } from "@/data/categories";
import dragon from "@/assets/product-dragon.jpg";
import organizer from "@/assets/product-organizer.jpg";
import planter from "@/assets/product-planter.jpg";
import stand from "@/assets/product-stand.jpg";
import ship from "@/assets/product-ship.jpg";
import wallart from "@/assets/product-wallart.jpg";
import keychain from "@/assets/product-keychain.jpg";
import phonestand from "@/assets/product-phonestand.jpg";

const FILAMENT = ["#FF7A00", "#22C55E", "#111111", "#FFFFFF", "#9CA3AF", "#3B82F6"];

export const products: Product[] = [
  { id: "1", name: "Articulated Dragon", description: "Print-in-place, fully posable", price: 24, image: dragon, colors: FILAMENT, tag: "Bestseller", category: SEED_PRODUCT_CATEGORIES["1"] },
  { id: "2", name: "Hex Desk Organizer", description: "Modular workspace catch-all", price: 32, image: organizer, colors: ["#111111", "#FFFFFF", "#9CA3AF"], category: SEED_PRODUCT_CATEGORIES["2"] },
  { id: "3", name: "Geo Planter", description: "Low-poly succulent home", price: 18, image: planter, colors: ["#FFFFFF", "#111111", "#22C55E"], category: SEED_PRODUCT_CATEGORIES["3"] },
  { id: "4", name: "Controller Stand", description: "Minimal gamepad display", price: 14, image: stand, colors: ["#3B82F6", "#FF7A00", "#111111"], tag: "New", category: SEED_PRODUCT_CATEGORIES["4"] },
  { id: "5", name: "Mini Spaceship", description: "Tabletop collector model", price: 22, image: ship, colors: ["#9CA3AF", "#111111", "#FFFFFF"], category: SEED_PRODUCT_CATEGORIES["5"] },
  { id: "6", name: "Mandala Wall Art", description: "Hand-finished centerpiece", price: 39, image: wallart, colors: ["#22C55E", "#FF7A00", "#3B82F6"], category: SEED_PRODUCT_CATEGORIES["6"] },
  { id: "7", name: "Geometric Keychain", description: "Pair of laser-tight charms", price: 9, image: keychain, colors: FILAMENT, category: SEED_PRODUCT_CATEGORIES["7"] },
  { id: "8", name: "Angular Phone Stand", description: "Desk + bedside ready", price: 12, image: phonestand, colors: ["#111111", "#FFFFFF", "#3B82F6"], category: SEED_PRODUCT_CATEGORIES["8"] },
];