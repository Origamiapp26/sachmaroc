/** Moroccan cities with shipping costs (MAD) — used on product order form */
export const MOROCCAN_CITIES = [
  { name: "Casablanca", shippingCost: 25 },
  { name: "Rabat", shippingCost: 25 },
  { name: "Marrakech", shippingCost: 30 },
  { name: "Fes", shippingCost: 30 },
  { name: "Tangier", shippingCost: 30 },
  { name: "Agadir", shippingCost: 35 },
  { name: "Meknes", shippingCost: 30 },
  { name: "Oujda", shippingCost: 35 },
  { name: "Kenitra", shippingCost: 25 },
  { name: "Tetouan", shippingCost: 30 },
  { name: "Safi", shippingCost: 30 },
  { name: "El Jadida", shippingCost: 25 },
  { name: "Beni Mellal", shippingCost: 30 },
  { name: "Nador", shippingCost: 35 },
  { name: "Khouribga", shippingCost: 30 },
  { name: "Taza", shippingCost: 35 },
  { name: "Settat", shippingCost: 25 },
  { name: "Larache", shippingCost: 30 },
] as const;

export type MoroccanCityName = (typeof MOROCCAN_CITIES)[number]["name"];

export function getCityShippingCost(cityName: string): number {
  const city = MOROCCAN_CITIES.find((c) => c.name === cityName);
  return city?.shippingCost ?? 35;
}
