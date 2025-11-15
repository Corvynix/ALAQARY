import MarketSnapshot from '../MarketSnapshot';

export default function MarketSnapshotExample() {
  const mockData = [
    { id: "1", city: "أسيوط", avgPrice: "1.2M EGP", changePercent: 23, demandLevel: "high" as const, views: 150 },
    { id: "2", city: "القاهرة", avgPrice: "3.5M EGP", changePercent: 15, demandLevel: "high" as const, views: 300 },
    { id: "3", city: "الإسكندرية", avgPrice: "2.8M EGP", changePercent: -5, demandLevel: "medium" as const, views: 200 }
  ];

  return <MarketSnapshot language="ar" data={mockData} />;
}
