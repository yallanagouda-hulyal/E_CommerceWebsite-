// Seeds DB with an admin user + 100+ sample products using existing images. Run: npm run seed
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  // --- MEN'S CATEGORY (Reusing: versace-1.jpg, zegna-1.jpg, clarks-1.jpg, valentino-1.jpg, airforce-1.jpg, kenzo-tiger-1.jpg) ---
  { name: "Versace Shoes", description: "Odissea chunky leather trainers", price: 699, image: "/products/versace-1.jpg", category: "men", stock: 10 },
  { name: "Zegna Blazer", description: "Lightweight blazer", price: 1181, image: "/products/zegna-1.jpg", category: "men", stock: 5 },
  { name: "Clarks Shoes", description: "Front lace-up derby shoes", price: 163, image: "/products/clarks-1.jpg", category: "men", stock: 8 },
  { name: "Valentino T-Shirt", description: "Short-sleeved T-shirt", price: 351, image: "/products/valentino-1.jpg", category: "men", stock: 20 },
  { name: "Nike Air Force", description: "Air Force Sneakers", price: 161, image: "/products/airforce-1.jpg", category: "men", stock: 15 },
  { name: "Kenzo Hoodie", description: "Tiger Head Hoodie", price: 281, image: "/products/kenzo-tiger-1.jpg", category: "men", stock: 12 },
  { name: "Prada Sport Sneaker", description: "Technical fabric trainers", price: 750, image: "/products/versace-1.jpg", category: "men", stock: 10 },
  { name: "Armani Suit Jacket", description: "Slim fit formal blazer", price: 890, image: "/products/zegna-1.jpg", category: "men", stock: 4 },
  { name: "Church's Derby", description: "Polished binder derby", price: 620, image: "/products/clarks-1.jpg", category: "men", stock: 6 },
  { name: "Givenchy Logo Tee", description: "Signature cotton tee", price: 410, image: "/products/valentino-1.jpg", category: "men", stock: 15 },
  { name: "Adidas Forum Low", description: "Classic retro sneakers", price: 120, image: "/products/airforce-1.jpg", category: "men", stock: 25 },
  { name: "Gucci Ghost Hoodie", description: "Luxury streetwear hoodie", price: 980, image: "/products/kenzo-tiger-1.jpg", category: "men", stock: 3 },
  { name: "Balenciaga Runner", description: "Multi-panel mesh shoes", price: 1150, image: "/products/versace-1.jpg", category: "men", stock: 7 },
  { name: "Hugo Boss Blazer", description: "Virgin wool blend jacket", price: 550, image: "/products/zegna-1.jpg", category: "men", stock: 12 },
  { name: "Dr. Martens Oxford", description: "Classic 3-eye shoe", price: 170, image: "/products/clarks-1.jpg", category: "men", stock: 20 },
  { name: "Saint Laurent Tee", description: "Reverse logo t-shirt", price: 390, image: "/products/valentino-1.jpg", category: "men", stock: 10 },
  { name: "Reebok Club C", description: "Vintage white sneakers", price: 95, image: "/products/airforce-1.jpg", category: "men", stock: 30 },
  { name: "Off-White Hoodie", description: "Industrial arrow sweatshirt", price: 590, image: "/products/kenzo-tiger-1.jpg", category: "men", stock: 5 },
  { name: "Alexander McQueen Sole", description: "Exaggerated sole sneaker", price: 540, image: "/products/versace-1.jpg", category: "men", stock: 9 },
  { name: "Tom Ford Jacket", description: "Luxury tailored evening blazer", price: 2900, image: "/products/zegna-1.jpg", category: "men", stock: 2 },
  { name: "Timberland Boot Low", description: "Nubuck leather casual shoe", price: 140, image: "/products/clarks-1.jpg", category: "men", stock: 15 },
  { name: "Fendi Baguette Tee", description: "Embroidered graphic tee", price: 650, image: "/products/valentino-1.jpg", category: "men", stock: 8 },
  { name: "Common Projects Low", description: "Original Achilles sneaker", price: 415, image: "/products/airforce-1.jpg", category: "men", stock: 12 },
  { name: "Stone Island Sweat", description: "Compass patch pullover", price: 320, image: "/products/kenzo-tiger-1.jpg", category: "men", stock: 14 },
  { name: "Bally Leather Loafer", description: "Swiss luxury trainers", price: 480, image: "/products/versace-1.jpg", category: "men", stock: 11 },
  { name: "Canali Wool Blazer", description: "Italian hand-finished jacket", price: 1450, image: "/products/zegna-1.jpg", category: "men", stock: 3 },
  { name: "Loake Brouge", description: "Traditional wingtip shoe", price: 220, image: "/products/clarks-1.jpg", category: "men", stock: 7 },
  { name: "Balmain Paris Tee", description: "Gold button detail shirt", price: 495, image: "/products/valentino-1.jpg", category: "men", stock: 12 },
  { name: "Vans Old Skool Luxe", description: "Leather trim skate shoes", price: 85, image: "/products/airforce-1.jpg", category: "men", stock: 50 },
  { name: "Burberry Check Hoodie", description: "Iconic stripe sweatshirt", price: 720, image: "/products/kenzo-tiger-1.jpg", category: "men", stock: 6 },

  // --- WOMEN'S CATEGORY (Reusing: palm-angels-1.jpg, balenciaga-1.jpg, off-white-1.jpg, mugler-1.jpg) ---
  { name: "Palm Angels Dress", description: "Mini t-shirt dress", price: 383, image: "/products/palm-angels-1.jpg", category: "women", stock: 10 },
  { name: "Balenciaga Jacket", description: "Twisted-sleeve jacket", price: 1610, image: "/products/balenciaga-1.jpg", category: "women", stock: 6 },
  { name: "Off-White Dress", description: "Designer outfit", price: 689, image: "/products/off-white-1.jpg", category: "women", stock: 9 },
  { name: "Mugler Outfit", description: "Waist tailored trousers", price: 1077, image: "/products/mugler-1.jpg", category: "women", stock: 7 },
  { name: "Jacquemus Mini", description: "Summer linen cocktail dress", price: 540, image: "/products/palm-angels-1.jpg", category: "women", stock: 12 },
  { name: "Prada Denim Jacket", description: "Logo plaque trucker jacket", price: 1850, image: "/products/balenciaga-1.jpg", category: "women", stock: 4 },
  { name: "Marine Serre Gown", description: "Crescent moon midi dress", price: 420, image: "/products/off-white-1.jpg", category: "women", stock: 8 },
  { name: "Versace Leggings", description: "Greca pattern high-waist", price: 395, image: "/products/mugler-1.jpg", category: "women", stock: 15 },
  { name: "Ganni Mesh Dress", description: "Floral print shift dress", price: 285, image: "/products/palm-angels-1.jpg", category: "women", stock: 20 },
  { name: "Saint Laurent Biker", description: "Classic leather motor jacket", price: 3200, image: "/products/balenciaga-1.jpg", category: "women", stock: 2 },
  { name: "Zimmermann Silk", description: "Flowy bohemian party dress", price: 950, image: "/products/off-white-1.jpg", category: "women", stock: 5 },
  { name: "Dior Trousers", description: "Wool silk cigarette pants", price: 1300, image: "/products/mugler-1.jpg", category: "women", stock: 6 },
  { name: "Miu Miu Mini", description: "Pleated tennis style dress", price: 820, image: "/products/palm-angels-1.jpg", category: "women", stock: 9 },
  { name: "Celine Windbreaker", description: "Luxury nylon outer shell", price: 1100, image: "/products/balenciaga-1.jpg", category: "women", stock: 7 },
  { name: "Self-Portrait Lace", description: "Elegant evening lace dress", price: 460, image: "/products/off-white-1.jpg", category: "women", stock: 11 },
  { name: "Alaia Bodysuit", description: "Sculpted fit evening wear", price: 980, image: "/products/mugler-1.jpg", category: "women", stock: 4 },
  { name: "Rick Owens Tee Dress", description: "Asymmetric cotton jersey", price: 350, image: "/products/palm-angels-1.jpg", category: "women", stock: 14 },
  { name: "Loewe Crop Jacket", description: "Aniline leather coat", price: 2400, image: "/products/balenciaga-1.jpg", category: "women", stock: 3 },
  { name: "Khaite Denim", description: "The Danielle high-rise dress", price: 580, image: "/products/off-white-1.jpg", category: "women", stock: 10 },
  { name: "Isabel Marant Pants", description: "High-waist tapered chinos", price: 440, image: "/products/mugler-1.jpg", category: "women", stock: 13 },

  // --- KIDS CATEGORY (Reusing: stella-1.jpg, molo-1.jpg, adidas-1.jpg) ---
  { name: "Kids Track Pants", description: "Drawstring cargo track pants", price: 878, image: "/products/stella-1.jpg", category: "kids", stock: 9 },
  { name: "Kids Denim Skirt", description: "Teen denim skirt", price: 91, image: "/products/molo-1.jpg", category: "kids", stock: 14 },
  { name: "Adidas Yeezy Kids", description: "Foam runner sneakers", price: 227, image: "/products/adidas-1.jpg", category: "kids", stock: 11 },
  { name: "Nike Tech Kids", description: "Fleece joggers for toddlers", price: 65, image: "/products/stella-1.jpg", category: "kids", stock: 20 },
  { name: "Levi's Mini Skirt", description: "Classic 501 denim skirt", price: 45, image: "/products/molo-1.jpg", category: "kids", stock: 30 },
  { name: "Jordan Retro Kids", description: "Jumpman toddler basketball shoes", price: 110, image: "/products/adidas-1.jpg", category: "kids", stock: 15 },
  { name: "Gucci Kids Sweat", description: "Web detail lounge pants", price: 210, image: "/products/stella-1.jpg", category: "kids", stock: 8 },
  { name: "Burberry Kids Skirt", description: "Vintage check cotton skirt", price: 195, image: "/products/molo-1.jpg", category: "kids", stock: 10 },
  { name: "New Balance Kids", description: "574 hook and loop sneakers", price: 75, image: "/products/adidas-1.jpg", category: "kids", stock: 25 },
  { name: "Moncler Enfant", description: "Nylon quilted track pants", price: 320, image: "/products/stella-1.jpg", category: "kids", stock: 5 },
  { name: "Ralph Lauren Denim", description: "Polo bear embroidered skirt", price: 85, image: "/products/molo-1.jpg", category: "kids", stock: 12 },
  { name: "Vans Kids Slip-on", description: "Checkerboard skate shoes", price: 40, image: "/products/adidas-1.jpg", category: "kids", stock: 40 },
  { name: "Fendi Kids Cargo", description: "FF logo pocket trousers", price: 340, image: "/products/stella-1.jpg", category: "kids", stock: 7 },
  { name: "Stella Kids Star", description: "Fringe detail denim skirt", price: 120, image: "/products/molo-1.jpg", category: "kids", stock: 9 },
  { name: "Converse Chucks", description: "High top canvas kids", price: 55, image: "/products/adidas-1.jpg", category: "kids", stock: 50 },
  { name: "Kenzo Kids Jogger", description: "Multi-icon print pants", price: 140, image: "/products/stella-1.jpg", category: "kids", stock: 18 },
  { name: "Chloe Kids Denim", description: "Scalloped edge skirt", price: 160, image: "/products/molo-1.jpg", category: "kids", stock: 11 },
  { name: "Reebok Classic Kids", description: "Triple white leather shoes", price: 60, image: "/products/adidas-1.jpg", category: "kids", stock: 22 },
];

(async () => {
  try {
    await connectDB();
    console.log('🗑️ Cleaning old data...');
    await Product.deleteMany();
    await User.deleteOne({ email: 'admin@shop.com' });

    console.log(`📦 Seeding ${products.length} products...`);
    await Product.insertMany(products);

    await User.create({
      name: 'Admin',
      email: 'admin@shop.com',
      password: 'admin123',
      isAdmin: true
    });

    console.log('✅ Done! Products and Admin (admin@shop.com/admin123) are ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();