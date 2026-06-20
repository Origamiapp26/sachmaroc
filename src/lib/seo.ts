import type { Product } from "@/types/product";
import type { StoreSettings } from "@/types/settings";

export function productJsonLd(product: Product, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "MAD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/products/${product.id}`,
    },
  };
}

export function organizationJsonLd(settings: StoreSettings, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.storeName,
    url: baseUrl,
    logo: settings.logo || `${baseUrl}/favicon.ico`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.contact.phone,
      contactType: "customer service",
      availableLanguage: "Arabic",
    },
  };
}

export function websiteJsonLd(settings: StoreSettings, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.storeName,
    url: baseUrl,
    description: settings.seo.defaultDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
