import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";

interface RoiCalculatorProps {
  language: "ar" | "en";
}

export default function RoiCalculator({ language }: RoiCalculatorProps) {
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [annualExpenses, setAnnualExpenses] = useState<string>("");
  const [downPayment, setDownPayment] = useState<string>("");
  const [loanInterest, setLoanInterest] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [totalUsage, setTotalUsage] = useState<number>(0);

  useEffect(() => {
    fetch("/api/roi-calculator/usage")
      .then(res => res.json())
      .then(data => setTotalUsage(data.totalUsage))
      .catch(console.error);
  }, []);

  const content = {
    ar: {
      title: "حاسبة العائد على الاستثمار",
      description: "احسب العائد على استثمارك العقاري",
      purchasePrice: "سعر الشراء",
      monthlyRent: "الإيجار الشهري",
      annualExpenses: "المصاريف السنوية",
      downPayment: "الدفعة الأولى",
      loanInterest: "فائدة القرض (%)",
      calculate: "احسب",
      reset: "إعادة تعيين",
      results: "النتائج",
      annualRentalIncome: "الدخل الإيجاري السنوي",
      netAnnualIncome: "صافي الدخل السنوي",
      cashOnCashReturn: "العائد النقدي",
      capRate: "معدل الرسملة",
      totalReturn: "إجمالي العائد",
      loanAmount: "مبلغ القرض",
      annualLoanPayment: "الدفع السنوي للقرض",
      usageCounter: "إجمالي الاستخدامات",
      enterValues: "أدخل القيم لحساب العائد على الاستثمار",
      currency: "ر.س"
    },
    en: {
      title: "ROI Calculator",
      description: "Calculate your real estate investment return",
      purchasePrice: "Purchase Price",
      monthlyRent: "Monthly Rent",
      annualExpenses: "Annual Expenses",
      downPayment: "Down Payment",
      loanInterest: "Loan Interest Rate (%)",
      calculate: "Calculate",
      reset: "Reset",
      results: "Results",
      annualRentalIncome: "Annual Rental Income",
      netAnnualIncome: "Net Annual Income",
      cashOnCashReturn: "Cash-on-Cash Return",
      capRate: "Cap Rate",
      totalReturn: "Total Return",
      loanAmount: "Loan Amount",
      annualLoanPayment: "Annual Loan Payment",
      usageCounter: "Total Usage Count",
      enterValues: "Enter values to calculate ROI",
      currency: "SAR"
    }
  };

  const t = content[language];

  const calculateROI = async () => {
    const price = parseFloat(purchasePrice);
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(annualExpenses);
    const down = parseFloat(downPayment);
    const interest = parseFloat(loanInterest) / 100;

    if (isNaN(price) || isNaN(rent) || isNaN(down)) {
      return;
    }

    const annualRentalIncome = rent * 12;
    const loanAmount = price - down;
    const annualLoanPayment = loanAmount > 0 && !isNaN(interest) && interest > 0
      ? (loanAmount * interest * Math.pow(1 + interest, 30)) / (Math.pow(1 + interest, 30) - 1)
      : 0;
    const netAnnualIncome = annualRentalIncome - (expenses || 0) - annualLoanPayment;
    const cashOnCashReturn = (netAnnualIncome / down) * 100;
    const capRate = ((annualRentalIncome - (expenses || 0)) / price) * 100;
    const totalReturn = (netAnnualIncome / price) * 100;

    setResults({
      annualRentalIncome,
      netAnnualIncome,
      cashOnCashReturn,
      capRate,
      totalReturn,
      loanAmount,
      annualLoanPayment
    });

    try {
      const response = await fetch("/api/roi-calculator/usage", { method: "POST" });
      const data = await response.json();
      setTotalUsage(data.totalUsage);
    } catch (error) {
      console.error("Error tracking usage:", error);
    }
  };

  const resetForm = () => {
    setPurchasePrice("");
    setMonthlyRent("");
    setAnnualExpenses("");
    setDownPayment("");
    setLoanInterest("");
    setResults(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{t.usageCounter}: {totalUsage.toLocaleString()}</span>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Calculator className="h-6 w-6" />
            {t.title}
          </CardTitle>
          <CardDescription className={language === 'ar' ? 'text-right' : ''}>
            {t.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${language === 'ar' ? 'text-right' : ''}`}>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">{t.purchasePrice} ({t.currency})</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="1000000"
                className={language === 'ar' ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRent">{t.monthlyRent} ({t.currency})</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="5000"
                className={language === 'ar' ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">{t.downPayment} ({t.currency})</Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="300000"
                className={language === 'ar' ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualExpenses">{t.annualExpenses} ({t.currency})</Label>
              <Input
                id="annualExpenses"
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(e.target.value)}
                placeholder="10000"
                className={language === 'ar' ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanInterest">{t.loanInterest}</Label>
              <Input
                id="loanInterest"
                type="number"
                step="0.1"
                value={loanInterest}
                onChange={(e) => setLoanInterest(e.target.value)}
                placeholder="5"
                className={language === 'ar' ? 'text-right' : ''}
              />
            </div>
          </div>

          <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Button onClick={calculateROI} className="flex-1">
              <Calculator className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.calculate}
            </Button>
            <Button onClick={resetForm} variant="outline" className="flex-1">
              {t.reset}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="h-6 w-6" />
              {t.results}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <DollarSign className="h-4 w-4" />
                  {t.annualRentalIncome}
                </div>
                <div className="text-2xl font-bold">{formatCurrency(results.annualRentalIncome)} {t.currency}</div>
              </div>

              <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <DollarSign className="h-4 w-4" />
                  {t.netAnnualIncome}
                </div>
                <div className="text-2xl font-bold">{formatCurrency(results.netAnnualIncome)} {t.currency}</div>
              </div>

              <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Percent className="h-4 w-4" />
                  {t.cashOnCashReturn}
                </div>
                <div className="text-2xl font-bold text-primary">{formatPercentage(results.cashOnCashReturn)}%</div>
              </div>

              <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Percent className="h-4 w-4" />
                  {t.capRate}
                </div>
                <div className="text-2xl font-bold text-primary">{formatPercentage(results.capRate)}%</div>
              </div>

              <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Percent className="h-4 w-4" />
                  {t.totalReturn}
                </div>
                <div className="text-2xl font-bold text-primary">{formatPercentage(results.totalReturn)}%</div>
              </div>

              {results.loanAmount > 0 && (
                <>
                  <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <DollarSign className="h-4 w-4" />
                      {t.loanAmount}
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(results.loanAmount)} {t.currency}</div>
                  </div>

                  <div className={`p-4 rounded-lg bg-background/50 ${language === 'ar' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <DollarSign className="h-4 w-4" />
                      {t.annualLoanPayment}
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(results.annualLoanPayment)} {t.currency}</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!results && (
        <Card className="border-dashed border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t.enterValues}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
