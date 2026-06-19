import { buildWhatsAppContactUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/config";

export const metadata = {
  title: "اتصل بنا — SachMaroc",
  description: "تواصل مع فريق SachMaroc عبر واتساب أو البريد الإلكتروني",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-whatsapp">
          تواصل
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-ink">اتصل بنا</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
          فريقنا جاهز باش يجاوبك على أي سؤال
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-whatsapp-light">
            <svg
              className="h-6 w-6 text-whatsapp"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink">واتساب</h2>
          <p className="mt-2 text-sm text-ink-muted">
            أسرع طريقة باش تواصل معنا. رد خلال ساعات.
          </p>
          <a
            href={buildWhatsAppContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-whatsapp hover:text-whatsapp-dark"
          >
            +{WHATSAPP_NUMBER}
          </a>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
            <svg
              className="h-6 w-6 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink">البريد الإلكتروني</h2>
          <p className="mt-2 text-sm text-ink-muted">
            للاستفسارات والشراكات
          </p>
          <a
            href="mailto:contact@sachmaroc.ma"
            className="mt-4 inline-block text-sm font-bold text-ink hover:text-whatsapp"
          >
            contact@sachmaroc.ma
          </a>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-card md:col-span-2">
          <h2 className="text-lg font-bold text-ink">ساعات العمل</h2>
          <p className="mt-2 text-sm text-ink-muted">
            من الإثنين للسبت: 9:00 - 20:00
          </p>
          <p className="mt-1 text-sm text-ink-muted">الأحد: 10:00 - 18:00</p>
        </div>
      </div>
    </div>
  );
}
