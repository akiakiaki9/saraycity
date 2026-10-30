import { notFound } from "next/navigation";
import { supportedLocales } from "../../lib/seo.js";

export const instant = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale)) notFound();

  return children;
}
