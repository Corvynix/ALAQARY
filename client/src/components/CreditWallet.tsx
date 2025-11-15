import { useState, useEffect } from "react";
import { Coins, TrendingUp, TrendingDown, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CreditWalletProps {
  credits?: number;
  language: "ar" | "en";
  onViewHistory?: () => void;
}

export default function CreditWallet({ credits: propCredits, language, onViewHistory }: CreditWalletProps) {
  const [credits, setCredits] = useState(propCredits || 0);
  const [earned, setEarned] = useState(0);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditData();
  }, []);

  const fetchCreditData = async () => {
    try {
      // Fetch balance
      const balanceResponse = await fetch("/api/credits/balance", {
        credentials: "include",
      });
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        setCredits(balanceData.balance || 0);
      }

      // Fetch history to calculate earned/spent
      const historyResponse = await fetch("/api/credits/history", {
        credentials: "include",
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const transactions = historyData.transactions || [];
        
        let totalEarned = 0;
        let totalSpent = 0;
        
        transactions.forEach((tx: any) => {
          const amount = parseFloat(tx.amount || "0");
          if (tx.type === "earn") {
            totalEarned += amount;
          } else if (tx.type === "spend") {
            totalSpent += Math.abs(amount);
          }
        });
        
        setEarned(totalEarned);
        setSpent(totalSpent);
      }
    } catch (error) {
      console.error("Error fetching credit data:", error);
    } finally {
      setLoading(false);
    }
  };
  const content = {
    ar: {
      title: "محفظة النقاط",
      balance: "الرصيد الحالي",
      viewHistory: "عرض السجل",
      earned: "نقاط مكتسبة",
      spent: "نقاط مستخدمة",
      description: "استخدم النقاط للوصول إلى ميزات متقدمة"
    },
    en: {
      title: "Credit Wallet",
      balance: "Current Balance",
      viewHistory: "View History",
      earned: "Earned",
      spent: "Spent",
      description: "Use credits to access advanced features"
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Coins className="h-5 w-5 text-amber-500" />
            {content[language].title}
          </CardTitle>
          {onViewHistory && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onViewHistory}
              data-testid="button-view-credit-history"
            >
              <History className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
          {content[language].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">
            {content[language].balance}
          </div>
          {loading ? (
            <div className="text-5xl font-bold text-amber-500" data-testid="text-credit-balance">
              ...
            </div>
          ) : (
            <div className="text-5xl font-bold text-amber-500" data-testid="text-credit-balance">
              {credits.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 text-green-500 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">{content[language].earned}</span>
            </div>
            <div className="text-2xl font-semibold">
              {loading ? "..." : `+${earned.toLocaleString()}`}
            </div>
          </div>
          <div className="bg-card/50 p-3 rounded-md">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">{content[language].spent}</span>
            </div>
            <div className="text-2xl font-semibold">
              {loading ? "..." : `-${spent.toLocaleString()}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
