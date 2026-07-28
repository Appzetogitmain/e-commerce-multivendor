import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";
import Category from "../models/Category";
import Seller from "../models/Seller";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to DB.");

  const product = await Product.findOne({ productName: "text1" });
  if (!product) {
    console.log("Product 'text1' not found in database.");
    process.exit(0);
  }

  console.log("\n=== Product Details ===");
  console.log("ID:", product._id);
  console.log("Name:", product.productName);
  console.log("Status:", product.status);
  console.log("Publish:", product.publish);
  console.log("Category ID:", product.category);
  console.log("Seller ID:", product.seller);
  console.log("Variations:", JSON.stringify(product.variations, null, 2));

  if (product.category) {
    const categoryObj = await Category.findById(product.category);
    console.log("\n=== Category Details ===");
    if (categoryObj) {
      console.log("Name:", categoryObj.name);
      console.log("Status:", categoryObj.status);
    } else {
      console.log("Category not found for ID:", product.category);
    }
  }

  if (product.seller) {
    const sellerObj = await Seller.findById(product.seller);
    console.log("\n=== Seller Details ===");
    if (sellerObj) {
      console.log("Store Name:", sellerObj.storeName);
      console.log("Status (Approved/Pending):", sellerObj.status);
      console.log("isEnabled:", sellerObj.isEnabled);
      console.log("Coordinates:", sellerObj.location?.coordinates);
    } else {
      console.log("Seller not found for ID:", product.seller);
    }
  }

  process.exit(0);
}

run().catch(console.error);
