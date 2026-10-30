import { notFound } from "next/navigation";
import Site from "../../components/Site.js";
import { getPageMetadata, supportedLocales } from "../../lib/seo.js";

export const instant = false;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale)) notFound();
  return getPageMetadata(locale, "home");
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale)) notFound();
  return <Site locale={locale} pageType="home" />;
}
