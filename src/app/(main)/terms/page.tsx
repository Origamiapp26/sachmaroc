export const metadata = {
  title: "الشروط والأحكام — SachMaroc",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">الشروط والأحكام</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
        <p>
          باستعمال موقع SachMaroc، كتوافق على هاد الشروط والأحكام.
        </p>
        <section>
          <h2 className="text-base font-bold text-ink">الطلبات</h2>
          <p className="mt-2">
            الطلبات كتأكد عبر واتساب. نحتفظو بالحق فإلغاء أي طلب فحالة عدم
            توفر المنتج.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">الأسعار</h2>
          <p className="mt-2">
            الأسعار معروضة بالدرهم المغربي (MAD) وقد تتغير بدون إشعار مسبق.
            السعر المعتمد هو اللي كيتأكد فالطلب.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">الدفع والتوصيل</h2>
          <p className="mt-2">
            الدفع عند الاستلام فقط. التوصيل مجاني لجميع المدن المغربية. مدة
            التوصيل من 24 ل 72 ساعة.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">الإرجاع</h2>
          <p className="mt-2">
            فحالة وجود عيب فالمنتج أو عدم مطابقته للوصف، تواصل معنا خلال 48
            ساعة من الاستلام.
          </p>
        </section>
      </div>
    </div>
  );
}
