export const metadata = {
  title: "سياسة الخصوصية — SachMaroc",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">سياسة الخصوصية</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
        <p>
          فـ SachMaroc كنحترمو خصوصيتك. هاد الصفحة كتوضح كيفاش كنستعملو
          المعلومات ديالك.
        </p>
        <section>
          <h2 className="text-base font-bold text-ink">المعلومات اللي كنجمعوها</h2>
          <p className="mt-2">
            ملي تطلب عبر واتساب، كنستقبلو الاسم، رقم الهاتف والعنوان باش
            نوصلو الطلبية. ما كنجمعوش معلومات حساسة بدون موافقتك.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">استعمال المعلومات</h2>
          <p className="mt-2">
            المعلومات كتستعمل غير باش نعالجو الطلبيات ونتواصلو معاك بخصوص
            التوصيل. ما كنبيعوش ولا نشاركو المعلومات ديالك مع أطراف ثالثة.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">التواصل</h2>
          <p className="mt-2">
            لأي سؤال على الخصوصية، تواصل معنا عبر contact@sachmaroc.ma
          </p>
        </section>
      </div>
    </div>
  );
}
