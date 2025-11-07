import MarketSnapshot from '../MarketSnapshot';

export default function MarketSnapshotExample() {
  const mockData = [
    { city: "أسيوط", avgPrice: "1.2M EGP", changePercent: 23, demandLevel: "high" as const },
    { city: "القاهرة", avgPrice: "3.5M EGP", changePercent: 15, demandLevel: "high" as const },
    { city: "الإسكندرية", avgPrice: "2.8M EGP", changePercent: -5, demandLevel: "medium" as const }
  ];

  return <MarketSnapshot language="ar" data={mockData} />;
}
