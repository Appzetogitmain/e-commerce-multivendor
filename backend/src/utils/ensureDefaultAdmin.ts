import Admin from '../models/Admin';
import Seller from '../models/Seller';
import Delivery from '../models/Delivery';
import Customer from '../models/Customer';

const DEFAULT_ADMIN_MOBILE = process.env.DEFAULT_ADMIN_MOBILE || '9876543210';
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@geetastores.com';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
const DEFAULT_ADMIN_FIRST = process.env.DEFAULT_ADMIN_FIRST || 'Default';
const DEFAULT_ADMIN_LAST = process.env.DEFAULT_ADMIN_LAST || 'Admin';
const DEFAULT_ADMIN_ROLE = (process.env.DEFAULT_ADMIN_ROLE as 'Super Admin' | 'Admin') || 'Super Admin';

/**
 * Ensure default admin and test credentials exist with proper structures.
 */
export async function ensureDefaultAdmin() {
  const existing = await Admin.findOne({
    $or: [{ mobile: DEFAULT_ADMIN_MOBILE }, { email: DEFAULT_ADMIN_EMAIL }],
  });

  if (!existing) {
    const admin = await Admin.create({
      firstName: DEFAULT_ADMIN_FIRST,
      lastName: DEFAULT_ADMIN_LAST,
      mobile: DEFAULT_ADMIN_MOBILE,
      email: DEFAULT_ADMIN_EMAIL,
      role: DEFAULT_ADMIN_ROLE,
      password: DEFAULT_ADMIN_PASSWORD,
    });
    console.log(`Default admin created (mobile: ${admin.mobile}, role: ${admin.role})`);
  }

  // 1. Reset and recreate Admin 9111966734
  const newAdminMobile = '9111966734';
  const newAdminEmail = 'admin9111966734@ecommerce.com';
  await Admin.deleteOne({ mobile: newAdminMobile });
  const newAdmin = await Admin.create({
    firstName: 'Test',
    lastName: 'Admin',
    mobile: newAdminMobile,
    email: newAdminEmail,
    role: 'Super Admin',
    password: 'AdminPassword@123',
  });
  console.log(`New test admin created (mobile: ${newAdmin.mobile})`);

  // 2. Reset and recreate Seller 9111966732 with correct location coordinates
  const sellerMobile = '9111966732';
  await Seller.deleteOne({ mobile: sellerMobile });
  const seller = await Seller.create({
    sellerName: 'Test Seller',
    email: 'seller9111966732@ecommerce.com',
    mobile: sellerMobile,
    storeName: 'Test Seller Store',
    category: 'Grocery',
    address: 'Test Seller Address',
    city: 'Test City',
    status: 'Approved',
    isEnabled: true,
    canCreateCategories: true,
    requireProductApproval: false,
    commission: 0,
    balance: 0,
    categories: ['Grocery'],
    location: {
      type: 'Point',
      coordinates: [77.1025, 28.7041], // [longitude, latitude]
    },
    latitude: '28.7041',
    longitude: '77.1025',
  });
  console.log(`New test seller created (mobile: ${seller.mobile})`);

  // 3. Reset and recreate Delivery 9111966733
  const deliveryMobile = '9111966733';
  await Delivery.deleteOne({ mobile: deliveryMobile });
  const delivery = await Delivery.create({
    name: 'Test Delivery',
    email: 'delivery9111966733@ecommerce.com',
    mobile: deliveryMobile,
    password: 'DeliveryPassword@123',
    address: 'Test Delivery Address',
    city: 'Test City',
    status: 'Active',
    isOnline: true,
    balance: 0,
    cashCollected: 0,
    settings: {
      notifications: true,
      location: true,
      sound: true,
    },
  });
  console.log(`New test delivery created (mobile: ${delivery.mobile})`);

  // 4. Reset and recreate Customer 9111966731
  const customerMobile = '9111966731';
  await Customer.deleteOne({ phone: customerMobile, sellerId: null });
  const customer = await Customer.create({
    name: 'Test Customer',
    email: 'customer9111966731@ecommerce.com',
    phone: customerMobile,
    status: 'Active',
    totalOrders: 0,
    totalSpent: 0,
    creditBalance: 0,
  });
  console.log(`New test customer created (mobile: ${customer.phone})`);

  // Ensure Admin Store (Seller) account is approved and enabled
  const adminStore = await Seller.findOne({
    $or: [{ email: "admin-store@geetastores.com" }, { mobile: "9999999999" }],
  });
  if (adminStore) {
    if (adminStore.status !== "Approved" || !adminStore.isEnabled) {
      adminStore.status = "Approved";
      adminStore.isEnabled = true;
      await adminStore.save();
      console.log("Admin Store (Seller) status verified and updated to Approved/Enabled.");
    }
  } else {
    await Seller.create({
      sellerName: "Geeta Stores Admin",
      storeName: "Geeta Stores Admin Store",
      email: "admin-store@geetastores.com",
      mobile: "9999999999",
      password: "AdminStore@123",
      address: "Geeta Stores HQ",
      city: "Admin City",
      category: "Admin",
      commission: 0,
      status: "Approved",
      isEnabled: true,
      requireProductApproval: false,
      location: { type: "Point", coordinates: [0, 0] },
    });
    console.log("Admin Store (Seller) account created as Approved/Enabled.");
  }
}

export default ensureDefaultAdmin;
