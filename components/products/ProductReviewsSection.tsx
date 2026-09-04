"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Star, 
  CheckCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Plus, 
  X, 
  Sparkles, 
  ChevronDown,
  MessageSquare,
  Award,
  Check
} from "lucide-react";

export interface ReviewItem {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  content: string;
  purchasedVariant?: string;
  helpfulCount: number;
  unhelpfulCount: number;
  photos?: string[];
}

interface ProductReviewsSectionProps {
  productName: string;
  productSlug?: string;
  currentMetalName?: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Sophia L.",
    verified: true,
    rating: 5,
    date: "2 days ago",
    title: "Absolutely obsessed with the weight and shine!",
    content: "The craftsmanship on this piece is genuinely beyond expectations. The 18K gold vermeil has such a rich, warm tone—not brassy at all. I have worn it in the shower and gym, and it still looks freshly unboxed.",
    purchasedVariant: "18K Gold Vermeil",
    helpfulCount: 24,
    unhelpfulCount: 0,
    photos: ["/ear.jpeg"],
  },
  {
    id: "rev-2",
    author: "Charlotte R.",
    verified: true,
    rating: 5,
    date: "1 week ago",
    title: "My new everyday staple piece",
    content: "Layers effortlessly with my existing necklace collection. The clasp is super secure and comfortable to sleep in. Packaging was also stunning—felt like opening high jewellery.",
    purchasedVariant: "18K Gold Vermeil",
    helpfulCount: 18,
    unhelpfulCount: 1,
  },
  {
    id: "rev-3",
    author: "Emma W.",
    verified: true,
    rating: 5,
    date: "2 weeks ago",
    title: "Pure luxury without the astronomical markup",
    content: "I was hesitant about ordering online without trying it on in person, but the sizing guide was 100% accurate. The finish feels heavy, solid, and premium.",
    purchasedVariant: "Sterling Silver 925",
    helpfulCount: 12,
    unhelpfulCount: 0,
  },
  {
    id: "rev-4",
    author: "Olivia K.",
    verified: true,
    rating: 4,
    date: "3 weeks ago",
    title: "Gorgeous design, slightly shorter than expected",
    content: "Stunning craftsmanship! Just double check your chain length preference before ordering. I added an extender and now it sits at the exact collarbone sweet spot.",
    purchasedVariant: "18K Gold Vermeil",
    helpfulCount: 9,
    unhelpfulCount: 1,
  },
  {
    id: "rev-5",
    author: "Jessica M.",
    verified: true,
    rating: 5,
    date: "1 month ago",
    title: "Gets compliments wherever I go",
    content: "I receive questions every single time I wear this. The textured surface catches natural light so beautifully. Worth every single penny.",
    purchasedVariant: "18K Gold Vermeil",
    helpfulCount: 15,
    unhelpfulCount: 0,
    photos: ["/ring.jpeg"],
  },
  {
    id: "rev-6",
    author: "Hannah P.",
    verified: true,
    rating: 5,
    date: "1 month ago",
    title: "10/10 quality and fast dispatch",
    content: "Arrived within 48 hours in London beautifully presented in an embossed jewellery box and travel pouch. Will definitely be purchasing more for gifting!",
    purchasedVariant: "18K Rose Gold",
    helpfulCount: 7,
    unhelpfulCount: 0,
  },
];

export default function ProductReviewsSection({
  productName,
  productSlug = "product",
  currentMetalName = "18K Gold Vermeil",
}: ProductReviewsSectionProps) {
  const storageKey = `bhai_reviews_${productSlug}`;

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_REVIEWS;
  });

  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"helpful" | "recent" | "highest" | "lowest">("helpful");
  const [visibleCount, setVisibleCount] = useState(4);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, "yes" | "no">>({});

  // Write Review Form State
  const [authorName, setAuthorName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewVariant, setReviewVariant] = useState(currentMetalName);
  const [submittedToast, setSubmittedToast] = useState(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { average: 5.0, recommendPercent: 100, counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let positive = 0;

    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
      if (r.rating >= 4) positive++;
    });

    const recommend = Math.round((positive / total) * 100);

    return {
      average: avg,
      recommendPercent: recommend,
      counts,
      total,
    };
  }, [reviews]);

  // Filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (selectedRatingFilter !== "all") {
      list = list.filter((r) => Math.round(r.rating) === selectedRatingFilter);
    }

    if (sortBy === "helpful") {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    }

    return list;
  }, [reviews, selectedRatingFilter, sortBy]);

  const handleHelpfulClick = (reviewId: string, type: "yes" | "no") => {
    if (helpfulFeedback[reviewId]) return;

    setHelpfulFeedback((prev) => ({ ...prev, [reviewId]: type }));
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpfulCount: type === "yes" ? r.helpfulCount + 1 : r.helpfulCount,
          unhelpfulCount: type === "no" ? r.unhelpfulCount + 1 : r.unhelpfulCount,
        };
      }
      return r;
    });

    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewContent.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      verified: true,
      rating: reviewRating,
      date: "Just now",
      title: reviewTitle.trim() || "Exceptional piece",
      content: reviewContent.trim(),
      purchasedVariant: reviewVariant,
      helpfulCount: 1,
      unhelpfulCount: 0,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    setIsWriteModalOpen(false);
    setAuthorName("");
    setReviewTitle("");
    setReviewContent("");
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  return (
    <section className="w-full bg-[#FAF8F5] border-t border-[#EAE4D8] py-14 sm:py-20 px-4 sm:px-8 lg:px-12 text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* 1. SECTION HEADER */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#997b24]">
            Verified Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight uppercase text-neutral-950 font-serif">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Authentic experiences from verified collectors of {productName}
          </p>
        </div>

        {/* 2. REVIEWS BREAKDOWN CARD (Matches Screenshot Structure) */}
        <div className="bg-white border border-[#E8E1D4] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">

            {/* Left Score Summary (4.8 Stars + Recommend %) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3 pb-6 md:pb-0 border-b md:border-b-0 md:border-r border-neutral-200">
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 font-serif">
                {stats.average}
              </div>
              <div className="flex items-center gap-1 text-[#d4af37]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(stats.average)
                        ? "fill-[#d4af37] text-[#d4af37]"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-neutral-600">
                Based on <span className="text-neutral-900 font-bold">{stats.total} verified reviews</span>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#d4af37]/30 rounded-full text-[11px] font-semibold text-[#8c6d1f]">
                <CheckCircle className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span>{stats.recommendPercent}% recommend this design</span>
              </div>
            </div>

            {/* Right Rating Progress Bars */}
            <div className="md:col-span-8 space-y-2.5">
              {[5, 4, 3, 2, 1].map((starKey) => {
                const count = stats.counts[starKey as 1 | 2 | 3 | 4 | 5] || 0;
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

                return (
                  <button
                    key={starKey}
                    type="button"
                    onClick={() =>
                      setSelectedRatingFilter(
                        selectedRatingFilter === starKey ? "all" : starKey
                      )
                    }
                    className="w-full flex items-center gap-3 text-xs font-semibold text-neutral-700 hover:text-black group transition-colors cursor-pointer"
                  >
                    <span className="w-12 text-left shrink-0 text-neutral-600 group-hover:text-black flex items-center gap-1">
                      {starKey} <Star className="w-3 h-3 fill-neutral-400 text-neutral-400 group-hover:fill-[#d4af37] group-hover:text-[#d4af37]" />
                    </span>
                    <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                      <div
                        className="h-full bg-neutral-950 group-hover:bg-[#d4af37] transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right shrink-0 font-mono text-[11px] text-neutral-500">
                      {percentage}% ({count})
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* 3. FILTER CHIPS & CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Star Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedRatingFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedRatingFilter === "all"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-white border border-neutral-300 text-neutral-700 hover:border-black"
              }`}
            >
              All ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const c = stats.counts[star as 1 | 2 | 3 | 4 | 5] || 0;
              return (
                <button
                  key={star}
                  onClick={() => setSelectedRatingFilter(star)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all whitespace-nowrap ${
                    selectedRatingFilter === star
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "bg-white border border-neutral-300 text-neutral-700 hover:border-black"
                  }`}
                >
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] opacity-70">({c})</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Sort + Write Review */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort reviews"
                className="bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 rounded-full px-3.5 py-2 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-black"
              >
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="recent">Most Recent</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* 4. SUCCESS SUBMIT NOTIFICATION */}
        {submittedToast && (
          <div className="p-4 bg-[#e8f5e9] border border-[#a5d6a7] text-[#1b5e20] rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-[#2e7d32]" />
            <span>Thank you! Your verified review has been published and added to this piece.</span>
          </div>
        )}

        {/* 5. INDIVIDUAL REVIEW CARDS LIST (Exact Mobile Style from Screenshot) */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 p-8 space-y-3">
              <p className="text-sm font-semibold text-neutral-600">No reviews found matching this filter.</p>
              <button
                onClick={() => setSelectedRatingFilter("all")}
                className="text-xs uppercase tracking-wider font-bold text-[#997b24] underline cursor-pointer"
              >
                View all reviews
              </button>
            </div>
          ) : (
            filteredReviews.slice(0, visibleCount).map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E8E1D4] rounded-2xl p-5 sm:p-7 space-y-4 shadow-sm hover:border-neutral-400 transition-colors"
              >
                {/* Top Row: Stars + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? "fill-[#d4af37] text-[#d4af37]"
                            : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-neutral-500">
                    {rev.date}
                  </span>
                </div>

                {/* Author + Verified Buyer Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {rev.author.charAt(0)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-950">
                    {rev.author}
                  </span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold uppercase tracking-wider border border-[#c8e6c9]">
                      <CheckCircle className="w-2.5 h-2.5" /> Verified Buyer
                    </span>
                  )}
                </div>

                {/* Review Title & Content */}
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 leading-snug">
                    {rev.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-normal">
                    {rev.content}
                  </p>
                </div>

                {/* Attached Photo Thumbnails */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.photos.map((imgSrc, i) => (
                      <div
                        key={i}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100"
                      >
                        <Image
                          src={imgSrc}
                          alt="Customer review photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Purchased Variant Info & Helpful Vote */}
                <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-neutral-500">
                  {rev.purchasedVariant && (
                    <span>
                      Purchased: <strong className="text-neutral-800 font-semibold">{rev.purchasedVariant}</strong>
                    </span>
                  )}

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span>Was this review helpful?</span>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id, "yes")}
                      disabled={!!helpfulFeedback[rev.id]}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded border transition-colors cursor-pointer ${
                        helpfulFeedback[rev.id] === "yes"
                          ? "bg-neutral-950 text-white border-neutral-950 font-bold"
                          : "border-neutral-200 hover:bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.helpfulCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id, "no")}
                      disabled={!!helpfulFeedback[rev.id]}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded border transition-colors cursor-pointer ${
                        helpfulFeedback[rev.id] === "no"
                          ? "bg-neutral-950 text-white border-neutral-950 font-bold"
                          : "border-neutral-200 hover:bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>{rev.unhelpfulCount}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* 6. LOAD MORE BUTTON */}
        {visibleCount < filteredReviews.length && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-8 py-3 bg-white border border-neutral-900 text-neutral-950 hover:bg-neutral-950 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer"
            >
              Load More Reviews ({filteredReviews.length - visibleCount} Remaining)
            </button>
          </div>
        )}

      </div>

      {/* 7. WRITE A REVIEW MODAL POPUP */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-950 font-serif">Write a Verified Review</h3>
                <p className="text-xs text-neutral-500">{productName}</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? "fill-[#d4af37] text-[#d4af37]"
                            : "text-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* Review Headline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Absolutely breathtaking quality"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>

              {/* Review Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Detailed Experience &amp; Fit *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How does it feel, layer, and catch the light? How was the packaging?"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* Variant Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Purchased Metal / Option
                </label>
                <select
                  value={reviewVariant}
                  onChange={(e) => setReviewVariant(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="18K Gold Vermeil">18K Gold Vermeil</option>
                  <option value="Sterling Silver 925">Sterling Silver 925</option>
                  <option value="18K Rose Gold">18K Rose Gold</option>
                  <option value="Solid 14ct Fine Gold">Solid 14ct Fine Gold</option>
                </select>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors rounded-none cursor-pointer"
                >
                  Submit Verified Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-3 border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
