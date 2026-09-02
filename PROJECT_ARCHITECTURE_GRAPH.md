# 💎 Luxury Jewellery E-Commerce — ERP & Entity Relationship Model

> **Target Audience:** AI Agents & Software Engineers  
> **Unified ERP / ER Architecture Diagram**

---

## 1. Unified ERP & System Data Model

```mermaid
erDiagram
    CATEGORY ||--o{ PRODUCT : contains
    COLLECTION ||--o{ PRODUCT : features
    PRODUCT ||--o{ PRODUCT_IMAGE : displays
    PRODUCT ||--o{ PRODUCT_VARIANT : offers
    PRODUCT ||--o{ REVIEW : receives
    PRODUCT ||--o{ CART_ITEM : added_to
    PRODUCT ||--o{ WISHLIST_ITEM : saved_in
    
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ WISHLIST_ITEM : owns
    CUSTOMER ||--o{ REVIEW : writes
    
    ORDER ||--|{ ORDER_ITEM : includes
    ORDER ||--|| PAYMENT : processed_via
    ORDER ||--|| SHIPPING : delivered_by
    ORDER }o--o| COUPON : applies
    PRODUCT_VARIANT ||--o{ ORDER_ITEM : sold_as

    CATEGORY {
        string categoryId PK
        string slug UK "e.g. rings, necklaces, bracelets, earrings"
        string name "e.g. Luxury Rings"
        string description
        string bannerImage
        int sortOrder
    }

    COLLECTION {
        string collectionId PK
        string slug UK "e.g. bridal-2026, royal-heritage, solitaire-club"
        string title "e.g. Royal Heritage Collection"
        string tag "Limited Edition / Bestsellers"
        string heroImage
    }

    PRODUCT {
        string productId PK
        string slug UK "e.g. solitaire-diamond-ring-18k"
        string name "Solitaire Diamond Crown Ring"
        string categoryId FK
        string metal "18K Yellow Gold | 18K White Gold | Platinum 950"
        string gemstone "Certified Lab/Natural Diamond | Emerald | Sapphire"
        float caratWeight "e.g. 1.50 CT"
        string purity "18K (750) / 24K (999)"
        float basePrice
        float comparePrice "Original slash price"
        string sku UK "JW-RNG-001"
        int stockQuantity
        boolean isBestseller
        boolean isFeatured
        boolean isNewArrival
        float averageRating
        int totalReviews
        string description
    }

    PRODUCT_IMAGE {
        string imageId PK
        string productId FK
        string url
        string altText
        boolean isPrimary
        int displayOrder
    }

    PRODUCT_VARIANT {
        string variantId PK
        string productId FK
        string size "Ring size: 5, 6, 7, 8, 9"
        string metalOption "Yellow Gold / White Gold / Rose Gold"
        float priceAdjustment
        int stock
    }

    CUSTOMER {
        string customerId PK
        string email UK
        string fullName
        string phone
        string defaultAddress
        string city
        string createdAt
    }

    CART_ITEM {
        string cartItemId PK
        string customerOrSessionId
        string productId FK
        string variantId FK
        string ringSize
        int quantity
        float unitPrice
        string addedAt
    }

    WISHLIST_ITEM {
        string wishlistId PK
        string customerId FK
        string productId FK
        string savedAt
    }

    ORDER {
        string orderId PK "e.g. ORD-2026-9812"
        string customerId FK
        string customerName
        string customerEmail
        string customerPhone
        string shippingAddress
        string city
        float subtotal
        float discountAmount
        float shippingFee
        float totalAmount
        string orderStatus "Pending | Processing | Shipped | Delivered | Cancelled"
        string orderDate
    }

    ORDER_ITEM {
        string orderItemId PK
        string orderId FK
        string productId FK
        string variantId FK
        string productName
        string selectedSize
        int quantity
        float priceAtPurchase
    }

    PAYMENT {
        string paymentId PK
        string orderId FK
        string paymentMethod "CreditCard | DebitCard | COD | BankTransfer"
        string paymentStatus "Paid | Pending | Failed"
        string transactionRef
        float amountPaid
        string paidAt
    }

    SHIPPING {
        string shippingId PK
        string orderId FK
        string courierService "DHL | FedEx | LocalExpress"
        string trackingNumber
        string estimatedDelivery
        string shippingStatus "Manifested | InTransit | OutForDelivery | Delivered"
    }

    REVIEW {
        string reviewId PK
        string productId FK
        string customerId FK
        string authorName
        int rating "1 to 5 Stars"
        string reviewTitle
        string comment
        boolean isVerifiedBuyer
        string reviewDate
    }

    COUPON {
        string couponCode PK "e.g. LUXURY10"
        string discountType "Percentage | FixedAmount"
        float discountValue "e.g. 10% or $50"
        float minOrderValue
        string expiryDate
        boolean isActive
    }
```

---

## 2. ERP Entity Index

| Entity | Purpose in Jewellery System |
| :--- | :--- |
| **`CATEGORY`** | Broad jewellery types (Rings, Necklaces, Bracelets, Earrings, Bridal). |
| **`COLLECTION`** | Curated seasonal themes (e.g., Royal Heritage, Solitaire Edition). |
| **`PRODUCT`** | Core jewellery item with metal purity, gemstone carat weight, and SKU. |
| **`PRODUCT_VARIANT`** | Size specifications (Ring sizes 5–9, Metal color choices). |
| **`PRODUCT_IMAGE`** | Multi-angle high-resolution visuals. |
| **`CUSTOMER`** | Registered user profile or guest checkout info. |
| **`CART_ITEM`** | Active session items in shopping bag. |
| **`WISHLIST_ITEM`** | Bookmarked pieces for later review. |
| **`ORDER` & `ORDER_ITEM`** | Complete order records with purchase price snapshot. |
| **`PAYMENT`** | Transaction tracking (Cards, COD, Transfer). |
| **`SHIPPING`** | Courier tracking and delivery status. |
| **`REVIEW`** | Verified buyer ratings and feedback. |
| **`COUPON`** | Promotional vouchers and discount codes. |
