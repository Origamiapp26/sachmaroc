import { readFileSync, existsSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { runMigrations } from "./migrate";
import {
  admins,
  categories,
  products,
  productImages,
  productFeatures,
  reviews,
} from "./schema";

const CATEGORY_SEEDS = [
  {
    name: "تقليدي",
    slug: "traditionnel",
    description: "جلابات، قفاطين وأزياء مغربية",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
  },
  {
    name: "عطور",
    slug: "atour",
    description: "عطور وروائح شرقية فاخرة",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
  },
  {
    name: "مطبخ",
    slug: "matbakh",
    description: "طواجن وادوات مطبخ تقليدية",
    image:
      "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&q=80",
  },
  {
    name: "ديكور",
    slug: "decor",
    description: "سجاد وديكور مغربي أصيل",
    image:
      "https://images.unsplash.com/photo-1600166898309-ba6a5ac4be66?w=600&q=80",
  },
  {
    name: "عناية",
    slug: "aanaya",
    description: "أركان، صابون بلدي وعناية طبيعية",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80",
  },
];

interface JsonProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  features: string[];
  inStock: boolean;
  reviews: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }[];
}

async function seed() {
  runMigrations();

  const existingAdmin = await db.query.admins.findFirst();
  if (!existingAdmin) {
    const password = process.env.ADMIN_PASSWORD || "sachmaroc2026";
    const hash = await bcrypt.hash(password, 12);
    await db.insert(admins).values({
      id: nanoid(),
      username: "admin",
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    });
    console.log("✓ Admin user created (username: admin)");
  }

  const existingCategories = await db.query.categories.findFirst();
  const categoryMap = new Map<string, string>();

  if (!existingCategories) {
    for (let i = 0; i < CATEGORY_SEEDS.length; i++) {
      const cat = CATEGORY_SEEDS[i];
      const id = nanoid();
      await db.insert(categories).values({
        id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: i,
        createdAt: new Date().toISOString(),
      });
      categoryMap.set(cat.name, id);
    }
    console.log("✓ Categories seeded");
  } else {
    const cats = await db.query.categories.findMany();
    cats.forEach((c) => categoryMap.set(c.name, c.id));
  }

  const existingProducts = await db.query.products.findFirst();
  if (!existingProducts) {
    const jsonPath = path.join(process.cwd(), "data", "products.json");
    if (existsSync(jsonPath)) {
      const jsonProducts = JSON.parse(
        readFileSync(jsonPath, "utf-8")
      ) as JsonProduct[];

      for (const p of jsonProducts) {
        const id = nanoid();
        const now = new Date().toISOString();
        const categoryId = categoryMap.get(p.category) ?? [...categoryMap.values()][0];

        await db.insert(products).values({
          id,
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          categoryId,
          image: p.image,
          badge: p.badge,
          rating: p.rating,
          reviewCount: p.reviewCount,
          stockQuantity: p.inStock ? 50 : 0,
          featured: !!p.badge,
          inStock: p.inStock,
          createdAt: now,
          updatedAt: now,
        });

        for (let i = 0; i < p.images.length; i++) {
          await db.insert(productImages).values({
            id: nanoid(),
            productId: id,
            url: p.images[i],
            sortOrder: i,
          });
        }

        for (let i = 0; i < p.features.length; i++) {
          await db.insert(productFeatures).values({
            id: nanoid(),
            productId: id,
            text: p.features[i],
            sortOrder: i,
          });
        }

        for (const r of p.reviews) {
          await db.insert(reviews).values({
            id: nanoid(),
            productId: id,
            author: r.author,
            rating: r.rating,
            comment: r.comment,
            date: r.date,
            verified: r.verified,
          });
        }
      }
      console.log(`✓ ${jsonProducts.length} products seeded from JSON`);
    }
  }

  console.log("Database ready.");
}

export { seed as runSeed };
