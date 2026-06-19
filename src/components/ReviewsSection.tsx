import type { Review } from "@/types/product";
import { StarRating } from "./ProductCard";

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function ReviewsSection({
  reviews,
  rating,
  reviewCount,
}: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">
          آراء الزبناء
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-ink">
          شنو كيقولو الزبناء ديالنا
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <StarRating rating={rating} size="md" />
          <span className="text-sm text-ink-muted">
            {rating} من 5 ({reviewCount} تقييم)
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-card transition-shadow hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <StarRating rating={review.rating} />
              {review.verified && (
                <span className="rounded-full bg-whatsapp-light px-2.5 py-0.5 text-[10px] font-bold text-whatsapp-dark">
                  مؤكد
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              &ldquo;{review.comment}&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-bold text-ink">{review.author}</p>
              <time className="text-xs text-ink-faint">
                {new Date(review.date).toLocaleDateString("ar-MA", {
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
