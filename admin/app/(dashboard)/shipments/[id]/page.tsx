import { ShipmentDetailClient } from "./detail-client";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShipmentDetailClient id={id} />;
}
