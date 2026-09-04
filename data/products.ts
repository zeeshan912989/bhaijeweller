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
    gallery?: string[];
  };
  metals: Array<{
    name: string;
    type: "gold" | "silver" | "mixed" | "rose-gold";
    colorHex: string;
    secondaryColorHex?: string;
  }>;
  inStock: boolean;
}

export const FEATURED_TBAR_PRODUCTS: Product[] = [];
export const BEST_SELLER_PRODUCTS: Product[] = [];
export const ALL_PRODUCTS: Product[] = [];
