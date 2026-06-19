import { WHATSAPP_NUMBER } from "@/data/products";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppOrderUrl(
  items: { name: string; quantity: number; price: number }[],
  total: number
): string {
  const lines = items.map(
    (item) => `• ${item.name} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
  );

  const message = [
    "Bonjour SachMaroc 👋",
    "",
    "Je souhaite passer commande :",
    "",
    ...lines,
    "",
    `*Total : ${formatPrice(total)}*`,
    "",
    "Mode de paiement : Paiement à la livraison",
    "",
    "Merci !",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
