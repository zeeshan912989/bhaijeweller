export interface ProductSetItem {
  id: string;
  targetProductSlug: string; // e.g. "mixed-metal-t-bar-chain-necklace" or "all"
  setTitle: string; // e.g. "The Mixed Metal Starter Set"
  setSlug?: string;
  badgeText: string; // e.g. "SAVE Rs.14,678.00 AS A SET"
  discountDescription: string; // e.g. "Save 15% with our jewellery sets."
  bundleImage: string; // e.g. "/ear.jpeg" or URL
  bundlePrice: number; // e.g. 195
  originalTotalPrice: number; // e.g. 230
  includedItems: string[]; // names of items in set
  moreStyles?: {
    name: string;
    image: string;
    price: number;
    slug: string;
  }[];
}

export interface SeeItIRLItem {
  id: string;
  imageUrl: string;
  customerHandle: string; // e.g. "@rebecca_london"
  caption?: string; // e.g. "Layering the T-Bar with classic hoops"
  productSlug?: string; // tagged product or "all"
  productName?: string;
  productPrice?: number;
  displayOrder: number;
}

export const DEFAULT_PRODUCT_SETS: ProductSetItem[] = [
  {
    id: "set-mixed-metal-starter",
    targetProductSlug: "all",
    setTitle: "The Mixed Metal Starter Set",
    setSlug: "the-mixed-metal-starter-set",
    badgeText: "SAVE Rs.14,678.00 AS A SET",
    discountDescription: "Save 15% with our jewellery sets.",
    bundleImage: "/ear.jpeg",
    bundlePrice: 195,
    originalTotalPrice: 230,
    includedItems: ["Mixed Metal T-Bar Necklace", "Mixed Metal Hoop Earrings"],
    moreStyles: [
      {
        name: "Classic Chunky Hoop Earrings",
        image: "/ear.jpeg",
        price: 98,
        slug: "classic-chunky-hoop-earrings",
      },
      {
        name: "Deconstructed Bangle",
        image: "/ear.jpeg",
        price: 135,
        slug: "deconstructed-bangle",
      },
      {
        name: "Dome Ridge Ring",
        image: "/ear.jpeg",
        price: 89,
        slug: "dome-ridge-ring",
      }
    ]
  }
];

export const DEFAULT_SEE_IT_IRL_ITEMS: SeeItIRLItem[] = [
  {
    id: "irl-1",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    customerHandle: "@rebecca_london",
    caption: "Effortless Parisian layering with the T-Bar chain",
    productSlug: "all",
    productName: "T-Bar Chain Necklace",
    productPrice: 165,
    displayOrder: 1
  },
  {
    id: "irl-2",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
    customerHandle: "@sophia.aesthetic",
    caption: "Golden hour glow in the 18K chunky huggies",
    productSlug: "all",
    productName: "Chunky Hoop Earrings",
    productPrice: 98,
    displayOrder: 2
  },
  {
    id: "irl-3",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
    customerHandle: "@elena_couture",
    caption: "Mixed metals styled with a clean tailored blazer",
    productSlug: "all",
    productName: "Mixed Metal Starter Set",
    productPrice: 195,
    displayOrder: 3
  },
  {
    id: "irl-4",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    customerHandle: "@charlotte_v",
    caption: "My everyday staple stack that never comes off",
    productSlug: "all",
    productName: "Deconstructed Bangle",
    productPrice: 135,
    displayOrder: 4
  }
];
