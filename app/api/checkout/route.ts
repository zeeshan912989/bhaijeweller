import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

interface CheckoutItemPayload {
  productId: string;
  name?: string;
  variantId?: string;
  quantity: number;
}

interface CustomerPayload {
  name: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      promoCode,
      idempotencyKey,
      userId,
      paymentMethod = "Credit Card",
    } = body as {
      customer: CustomerPayload;
      items: CheckoutItemPayload[];
      promoCode?: string;
      idempotencyKey?: string;
      userId?: string;
      paymentMethod?: string;
    };

    // 1. Basic validation
    if (!customer || !customer.name || !customer.email || !customer.addressLine1 || !customer.city || !customer.postalCode) {
      return NextResponse.json(
        { success: false, error: "Incomplete shipping information. Name, email, address, city, and postal code are required." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cannot process an empty cart." },
        { status: 400 }
      );
    }

    // 2. Fetch authoritative product details & prices from DB
    const productIdentifiers = items.map((i) => i.productId);
    
    // Check both by ID or by Slug
    const { data: dbProducts, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, price, in_stock, primary_image")
      .or(`id.in.(${productIdentifiers.filter(id => id.length === 36).map(id => `"${id}"`).join(",") || '00000000-0000-0000-0000-000000000000'}),slug.in.(${productIdentifiers.map(s => `"${s}"`).join(",")})`);

    const productMap = new Map<string, any>();
    if (dbProducts) {
      for (const p of dbProducts) {
        productMap.set(p.id, p);
        if (p.slug) productMap.set(p.slug, p);
      }
    }

    // 3. Authoritative calculation
    let calculatedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const qty = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      const dbProd = productMap.get(item.productId);

      let unitPrice = 0;
      let itemName = item.name || "Luxury Jewellery Piece";
      let itemImage = "/ear.jpeg";

      if (dbProd) {
        unitPrice = Number(dbProd.price);
        itemName = dbProd.name;
        itemImage = dbProd.primary_image || "/ear.jpeg";
        
        if (dbProd.in_stock === false) {
          return NextResponse.json(
            { success: false, error: `Item "${dbProd.name}" is currently out of stock.` },
            { status: 400 }
          );
        }
      } else {
        // Fallback for demo items if not yet seeded into DB
        unitPrice = 120.00;
      }

      const itemTotal = unitPrice * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        product_id: dbProd ? dbProd.id : item.productId,
        name: itemName,
        variant_id: item.variantId || "Default",
        unit_price: unitPrice,
        quantity: qty,
        total_price: itemTotal,
        image: itemImage,
      });
    }

    // 4. Promo code calculation
    let discountAmount = 0;
    let validPromoApplied = false;
    const upperPromo = (promoCode || "").trim().toUpperCase();

    if (upperPromo) {
      // Check database coupons
      const { data: couponData } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", upperPromo)
        .eq("status", "Active")
        .maybeSingle();

      if (couponData && couponData.discount_percent) {
        discountAmount = (calculatedSubtotal * couponData.discount_percent) / 100;
        validPromoApplied = true;
        // Increment coupon use
        await supabaseAdmin
          .from("coupons")
          .update({ uses_count: (couponData.uses_count || 0) + 1 })
          .eq("id", couponData.id);
      } else if (["WELCOME10", "BHAI10"].includes(upperPromo)) {
        discountAmount = calculatedSubtotal * 0.10;
        validPromoApplied = true;
      } else if (["GOLD20"].includes(upperPromo)) {
        discountAmount = calculatedSubtotal * 0.20;
        validPromoApplied = true;
      }
    }

    // 5. Shipping & Final Total
    const isFreeShipping = calculatedSubtotal >= 100;
    const shippingFee = isFreeShipping ? 0.00 : 4.95;
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

    // 6. Idempotency / Order Number generation
    const orderNumber = idempotencyKey 
      ? `BHAI-${idempotencyKey.slice(0, 8).toUpperCase()}`
      : `BHAI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const fullShippingAddress = [
      customer.addressLine1,
      customer.addressLine2,
      customer.city,
      customer.state,
      customer.postalCode,
      customer.country || "United Kingdom",
    ].filter(Boolean).join(", ");

    // 7. Insert Order into Supabase Orders table
    const { data: newOrder, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customer.name,
        customer_email: customer.email.toLowerCase().trim(),
        shipping_address: fullShippingAddress,
        items: validatedItems,
        subtotal: calculatedSubtotal,
        shipping: shippingFee,
        total: finalTotal,
        payment_status: "Paid",
        fulfillment_status: "Processing",
        user_id: userId || null,
      })
      .select()
      .single();

    if (orderErr) {
      console.error("Order creation database error:", orderErr);
      return NextResponse.json(
        { success: false, error: "Database error while finalizing order. Please retry." },
        { status: 500 }
      );
    }

    // 8. Update / Upsert Customer record
    try {
      const { data: existingCustomer } = await supabaseAdmin
        .from("customers")
        .select("id, total_orders, total_spend")
        .eq("email", customer.email.toLowerCase().trim())
        .maybeSingle();

      if (existingCustomer) {
        await supabaseAdmin
          .from("customers")
          .update({
            name: customer.name,
            location: `${customer.city}, ${customer.country || "UK"}`,
            total_orders: (existingCustomer.total_orders || 0) + 1,
            total_spend: Number(existingCustomer.total_spend || 0) + finalTotal,
            tier: (existingCustomer.total_orders || 0) >= 5 ? "Gold VIP" : "Silver Tier",
          })
          .eq("id", existingCustomer.id);
      } else {
        await supabaseAdmin
          .from("customers")
          .insert({
            name: customer.name,
            email: customer.email.toLowerCase().trim(),
            location: `${customer.city}, ${customer.country || "UK"}`,
            total_orders: 1,
            total_spend: finalTotal,
            tier: "Member",
          });
      }
    } catch (custErr) {
      console.warn("Non-fatal customer sync error:", custErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: {
        id: newOrder.id,
        orderNumber: newOrder.order_number,
        customerName: customer.name,
        customerEmail: customer.email,
        subtotal: calculatedSubtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total: finalTotal,
        itemsCount: validatedItems.reduce((sum, it) => sum + it.quantity, 0),
        items: validatedItems,
        createdAt: newOrder.created_at,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      },
    });
  } catch (err: any) {
    console.error("Checkout route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
