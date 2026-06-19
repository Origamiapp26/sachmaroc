export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
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
  badge?: "Nouveau" | "Best-seller" | "Édition limitée";
  rating: number;
  reviewCount: number;
  reviews: Review[];
  features: string[];
  inStock: boolean;
}

export const WHATSAPP_NUMBER = "212600000000";

export const products: Product[] = [
  {
    id: "1",
    slug: "sac-cuir-premium-marrakech",
    name: "Sac Cuir Premium Marrakech",
    tagline: "Artisanat marocain, finition luxe",
    description:
      "Un sac en cuir pleine fleur, confectionné à la main par des artisans de Marrakech. Doublure en soie, fermeture magnétique discrète et bandoulière ajustable en cuir tressé.",
    price: 1299,
    originalPrice: 1599,
    category: "Sacs",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d12836?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d12836?w=1200&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80",
    ],
    badge: "Best-seller",
    rating: 4.9,
    reviewCount: 128,
    features: [
      "Cuir pleine fleur",
      "Fait main au Maroc",
      "Doublure soie",
      "Bandoulière ajustable",
    ],
    inStock: true,
    reviews: [
      {
        id: "r1",
        author: "Fatima B.",
        rating: 5,
        comment:
          "Qualité exceptionnelle. Le cuir est magnifique et la finition est impeccable.",
        date: "2026-03-12",
        verified: true,
      },
      {
        id: "r2",
        author: "Youssef A.",
        rating: 5,
        comment:
          "Livraison rapide à Casablanca. Le sac est encore plus beau en vrai.",
        date: "2026-02-28",
        verified: true,
      },
    ],
  },
  {
    id: "2",
    slug: "montre-classique-atlas",
    name: "Montre Classique Atlas",
    tagline: "Élégance intemporelle",
    description:
      "Montre minimaliste au design épuré, inspirée des sommets de l'Atlas. Boîtier en acier brossé, verre saphir et bracelet cuir italien.",
    price: 2499,
    category: "Montres",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
      "https://images.unsplash.com/photo-1524593361935-7622bfc3d90b?w=1200&q=80",
    ],
    badge: "Nouveau",
    rating: 4.8,
    reviewCount: 64,
    features: [
      "Acier brossé",
      "Verre saphir",
      "Bracelet cuir italien",
      "Étanchéité 5 ATM",
    ],
    inStock: true,
    reviews: [
      {
        id: "r3",
        author: "Karim M.",
        rating: 5,
        comment: "Design sobre et raffiné. Parfaite pour le quotidien.",
        date: "2026-04-01",
        verified: true,
      },
    ],
  },
  {
    id: "3",
    slug: "parfum-essence-fes",
    name: "Parfum Essence Fès",
    tagline: "Notes orientales raffinées",
    description:
      "Fragrance exclusive aux notes de rose de Damas, safran et bois de cèdre. Flacon en verre soufflé à la main, édition limitée.",
    price: 899,
    originalPrice: 1099,
    category: "Parfums",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80",
    ],
    badge: "Édition limitée",
    rating: 4.7,
    reviewCount: 89,
    features: [
      "100 ml",
      "Notes orientales",
      "Flacon artisanal",
      "Made in Morocco",
    ],
    inStock: true,
    reviews: [
      {
        id: "r4",
        author: "Amina L.",
        rating: 5,
        comment: "Un parfum sophistiqué qui tient toute la journée.",
        date: "2026-01-20",
        verified: true,
      },
    ],
  },
  {
    id: "4",
    slug: "ceinture-cuir-tanne",
    name: "Ceinture Cuir Tanné",
    tagline: "Simplicité premium",
    description:
      "Ceinture en cuir végétal tanné traditionnellement. Boucle en laiton poli, coupe ajustable pour un confort parfait.",
    price: 449,
    category: "Accessoires",
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=1200&q=80",
    ],
    rating: 4.6,
    reviewCount: 42,
    features: [
      "Cuir végétal",
      "Boucle laiton",
      "Tailles S à XL",
      "Artisanat local",
    ],
    inStock: true,
    reviews: [
      {
        id: "r5",
        author: "Hassan R.",
        rating: 4,
        comment: "Belle qualité, finition soignée.",
        date: "2025-12-15",
        verified: true,
      },
    ],
  },
  {
    id: "5",
    slug: "lunettes-soleil-sahara",
    name: "Lunettes Soleil Sahara",
    tagline: "Protection UV, style affirmé",
    description:
      "Lunettes de soleil à monture acétate premium. Verres polarisés catégorie 3, étui rigide et chiffon microfibre inclus.",
    price: 749,
    category: "Accessoires",
    image:
      "https://images.unsplash.com/photo-1572635196233-14bfa7bd1377?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196233-14bfa7bd1377?w=1200&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=80",
    ],
    badge: "Nouveau",
    rating: 4.8,
    reviewCount: 56,
    features: [
      "Verres polarisés",
      "Monture acétate",
      "UV400",
      "Étui premium inclus",
    ],
    inStock: true,
    reviews: [
      {
        id: "r6",
        author: "Nadia S.",
        rating: 5,
        comment: "Très confortables et élégantes. Je recommande.",
        date: "2026-03-05",
        verified: true,
      },
    ],
  },
  {
    id: "6",
    slug: "portefeuille-minimal-riad",
    name: "Portefeuille Minimal Riad",
    tagline: "Compact et raffiné",
    description:
      "Portefeuille slim en cuir grainé avec 6 emplacements cartes et poche billet. Design minimal inspiré de l'architecture des riads.",
    price: 399,
    category: "Accessoires",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80",
    ],
    rating: 4.5,
    reviewCount: 31,
    features: [
      "Cuir grainé",
      "6 emplacements cartes",
      "Format slim",
      "Finition main",
    ],
    inStock: true,
    reviews: [
      {
        id: "r7",
        author: "Omar T.",
        rating: 4,
        comment: "Parfait format, cuir de qualité.",
        date: "2026-02-10",
        verified: true,
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "Tous") return products;
  return products.filter((p) => p.category === category);
}

export const categories = [
  "Tous",
  "Sacs",
  "Montres",
  "Parfums",
  "Accessoires",
];
