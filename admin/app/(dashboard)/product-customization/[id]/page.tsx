import { ProductCustomizationClient } from "./detail-client";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function ProductCustomizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductCustomizationClient id={id} />;
}
