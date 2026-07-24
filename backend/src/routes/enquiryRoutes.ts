import { Router, Request, Response } from "express";
import { authenticate, requireUserType } from "../middleware/auth";
import Enquiry from "../models/Enquiry";
import Product from "../models/Product";
import { sendNotification, sendBroadcastNotification } from "../services/notificationService";

const router = Router();

// Create a new enquiry (Customer / Public)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, name, phone, email, message, customerId } = req.body;

    if (!productId || !name || !phone) {
      res.status(400).json({ success: false, message: "Product ID, Name, and Phone number are required." });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }

    const sellerId = product.seller;
    if (!sellerId) {
      res.status(400).json({ success: false, message: "Product does not have an associated seller." });
      return;
    }

    const enquiry = await Enquiry.create({
      customer: customerId || undefined,
      product: productId,
      seller: sellerId,
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
      status: "Pending",
    });

    // Notify Admin
    try {
      await sendBroadcastNotification(
        "Admin",
        `New Product Enquiry: ${product.productName}`,
        `A new enquiry has been submitted by ${name} (${phone}) for product "${product.productName}".`,
        { type: "Info", priority: "High" }
      );
    } catch (err) {
      console.error("Error sending admin broadcast notification:", err);
    }

    // Notify Seller
    try {
      await sendNotification(
        "Seller",
        sellerId.toString(),
        `New Product Enquiry: ${product.productName}`,
        `A customer is enquiring about your product "${product.productName}". Contact: ${name} (${phone})`,
        { type: "Info", priority: "High" }
      );
    } catch (err) {
      console.error("Error sending seller notification:", err);
    }

    res.status(201).json({ success: true, data: enquiry });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create enquiry." });
  }
});

// List all enquiries (Admin or Seller)
router.get("/", authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const user = req.user;
    let query: any = {};

    if (user.userType === "Seller") {
      query.seller = user._id;
    } else if (user.userType !== "Admin") {
       res.status(403).json({ success: false, message: "Unauthorized access." });
       return;
    }

    const enquiries = await Enquiry.find(query)
      .populate("product", "productName mainImage price discPrice variations")
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: enquiries });
  } catch (error: any) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch enquiries." });
  }
});

// Update enquiry status (Admin or Seller)
router.patch("/:id", authenticate, async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.user;

    if (!["Pending", "Responded", "Closed"].includes(status)) {
       res.status(400).json({ success: false, message: "Invalid status." });
       return;
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
       res.status(404).json({ success: false, message: "Enquiry not found." });
       return;
    }

    // Authorization check for Sellers
    if (user.userType === "Seller" && enquiry.seller.toString() !== user._id.toString()) {
       res.status(403).json({ success: false, message: "Unauthorized to update this enquiry." });
       return;
    } else if (user.userType !== "Admin" && user.userType !== "Seller") {
       res.status(403).json({ success: false, message: "Unauthorized access." });
       return;
    }

    enquiry.status = status;
    await enquiry.save();

    res.status(200).json({ success: true, data: enquiry });
  } catch (error: any) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update enquiry." });
  }
});

export default router;
