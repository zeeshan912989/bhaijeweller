export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: "Statement" | "New In" | "Everyday Staple" | "Bestseller" | string;
  images: {
    primary: string;
    hover?: string;
  };
  metals: Array<{
    name: string;
    type: "gold" | "silver" | "mixed" | "rose-gold";
    colorHex: string;
    secondaryColorHex?: string;
  }>;
  inStock: boolean;
}

export const FEATURED_TBAR_PRODUCTS: Product[] = [
  {
    id: "p-1",
    slug: "chunky-knot-t-bar-chain-necklace",
    name: "Chunky Knot T-Bar Chain Necklace",
    category: "necklaces",
    price: 165.0,
    badge: "Statement",
    images: {
      primary: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "Mixed 18K Gold & Silver", type: "mixed", colorHex: "#E5C158", secondaryColorHex: "#D1D5DB" },
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
    ],
    inStock: true,
  },
  {
    id: "p-2",
    slug: "knot-t-bar-charm-hoop-earrings",
    name: "Knot T-Bar Charm Hoop Earrings",
    category: "earrings",
    price: 98.0,
    badge: "New In",
    images: {
      primary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "Mixed 18K Gold & Silver", type: "mixed", colorHex: "#E5C158", secondaryColorHex: "#D1D5DB" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "p-3",
    slug: "chunky-curb-t-bar-chain-necklace",
    name: "Chunky T-Bar Chain Necklace",
    category: "necklaces",
    price: 198.0,
    badge: "Statement",
    images: {
      primary: "https://images.unsplash.com/photo-1611591477292-624021798361?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "p-4",
    slug: "refined-t-bar-knot-pendant-necklace",
    name: "T-Bar Knot Pendant Necklace",
    category: "necklaces",
    price: 149.0,
    badge: "Everyday Staple",
    images: {
      primary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "Mixed 18K Gold & Silver", type: "mixed", colorHex: "#E5C158", secondaryColorHex: "#D1D5DB" },
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
    ],
    inStock: true,
  },
  {
    id: "p-5",
    slug: "ridge-t-bar-chain-necklace",
    name: "Ridge T-Bar Chain Necklace",
    category: "necklaces",
    price: 149.0,
    badge: "Everyday Staple",
    images: {
      primary: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "p-6",
    slug: "the-pearl-t-bar-layered-necklace-set",
    name: "The Pearl & T-Bar Necklace Set",
    category: "necklaces",
    price: 275.0,
    originalPrice: 327.0,
    badge: "Save £52",
    images: {
      primary: "https://images.unsplash.com/photo-1576022160538-23214b7e997f?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold & Freshwater Pearl", type: "gold", colorHex: "#E5C158" },
    ],
    inStock: true,
  },
];

export const BEST_SELLER_PRODUCTS: Product[] = [
  {
    id: "bs-1",
    slug: "roman-arc-coin-pendant-necklace",
    name: "Roman Arc Coin Pendant Necklace",
    category: "necklaces",
    price: 159.0,
    badge: "Bestseller",
    images: {
      primary: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "bs-2",
    slug: "classic-pave-huggie-hoop-earrings",
    name: "Classic Pavé Huggie Hoop Earrings",
    category: "earrings",
    price: 79.0,
    badge: "Bestseller",
    images: {
      primary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "bs-3",
    slug: "chunky-twisted-gold-bangle-bracelet",
    name: "Chunky Twisted Cuff Bangle",
    category: "bracelets",
    price: 139.0,
    badge: "New In",
    images: {
      primary: "https://images.unsplash.com/photo-1611591477292-624021798361?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
    ],
    inStock: true,
  },
  {
    id: "bs-4",
    slug: "solitaire-claw-stacking-ring",
    name: "Solitaire Claw Stacking Ring",
    category: "rings",
    price: 119.0,
    badge: "Everyday Staple",
    images: {
      primary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "bs-5",
    slug: "herringbone-flat-snake-chain-necklace",
    name: "Flat Snake Chain Necklace",
    category: "necklaces",
    price: 129.0,
    badge: "Bestseller",
    images: {
      primary: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
      { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
    ],
    inStock: true,
  },
  {
    id: "bs-6",
    slug: "lucy-williams-caesar-coin-necklace",
    name: "Caesar Roman Coin Necklace",
    category: "necklaces",
    price: 169.0,
    originalPrice: 198.0,
    badge: "Save £29",
    images: {
      primary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop",
      hover: "https://images.unsplash.com/photo-1576022160538-23214b7e997f?q=80&w=800&auto=format&fit=crop",
    },
    metals: [
      { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
    ],
    inStock: true,
  },
];
