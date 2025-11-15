import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Plus, Search, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  credits: number;
}

interface CreditTransaction {
  id: string;
  userId: string;
  amount: string;
  type: string;
  reason: string;
  createdAt: string;
}

export default function AdminCreditManagement() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/credits/transactions", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleAddCredits = async () => {
    if (!selectedUserId || !creditAmount || parseFloat(creditAmount) <= 0) {
      alert(language === 'ar' ? "يرجى اختيار مستخدم وإدخال مبلغ صحيح" : "Please select a user and enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/credits/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedUserId,
          amount: parseFloat(creditAmount),
          reason: reason || (language === 'ar' ? "إضافة يدوية من المدير" : "Manual addition by admin"),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(language === 'ar' 
          ? `تمت إضافة ${creditAmount} نقطة بنجاح. الرصيد الجديد: ${data.newBalance}`
          : `Successfully added ${creditAmount} credits. New balance: ${data.newBalance}`);
        
        // Reset form
        setCreditAmount("");
        setReason("");
        setSelectedUserId("");
        
        // Refresh data
        fetchUsers();
        fetchTransactions();
      } else {
        const errorData = await response.json();
        alert(errorData.error || (language === 'ar' ? "فشلت العملية" : "Operation failed"));
      }
    } catch (error) {
      console.error("Error adding credits:", error);
      alert(language === 'ar' ? "حدث خطأ أثناء إضافة النقاط" : "Error adding credits");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const content = {
    ar: {
      title: "إدارة النقاط",
      description: "إضافة وإدارة نقاط المستخدمين",
      addCredits: "إضافة نقاط",
      selectUser: "اختر المستخدم",
      amount: "المبلغ",
      reason: "السبب (اختياري)",
      submit: "إضافة",
      users: "المستخدمون",
      transactions: "سجل المعاملات",
      search: "بحث...",
      username: "اسم المستخدم",
      email: "البريد الإلكتروني",
      role: "الدور",
      credits: "النقاط",
      noUsers: "لا يوجد مستخدمون",
      noTransactions: "لا توجد معاملات",
    },
    en: {
      title: "Credit Management",
      description: "Add and manage user credits",
      addCredits: "Add Credits",
      selectUser: "Select User",
      amount: "Amount",
      reason: "Reason (optional)",
      submit: "Add",
      users: "Users",
      transactions: "Transaction History",
      search: "Search...",
      username: "Username",
      email: "Email",
      role: "Role",
      credits: "Credits",
      noUsers: "No users found",
      noTransactions: "No transactions",
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            <Coins className="h-5 w-5" />
            {content[language].title}
          </CardTitle>
          <CardDescription className={language === 'ar' ? 'font-arabic' : ''}>
            {content[language].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={language === 'ar' ? 'font-arabic' : ''}>
                {content[language].selectUser}
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={content[language].selectUser} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.credits} {content[language].credits})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={language === 'ar' ? 'font-arabic' : ''}>
                {content[language].amount}
              </Label>
              <Input
                type="number"
                min="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].reason}
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={language === 'ar' ? "سبب إضافة النقاط..." : "Reason for adding credits..."}
              className={language === 'ar' ? 'font-arabic text-right' : ''}
            />
          </div>
          <Button
            onClick={handleAddCredits}
            disabled={loading || !selectedUserId || !creditAmount}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? (language === 'ar' ? "جاري..." : "Loading...") : content[language].submit}
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].users}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={content[language].search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className={`text-muted-foreground text-center py-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].noUsers}
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div>
                      <div className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {user.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email} • {user.role}
                      </div>
                    </div>
                    <div className={`font-bold text-amber-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {user.credits}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
              {content[language].transactions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className={`text-muted-foreground text-center py-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {content[language].noTransactions}
                </p>
              ) : (
                transactions.slice(0, 20).map((tx) => {
                  const user = users.find(u => u.id === tx.userId);
                  const amount = parseFloat(tx.amount);
                  return (
                    <div
                      key={tx.id}
                      className="p-3 border rounded-md text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {user?.username || tx.userId}
                        </span>
                        <span className={`font-bold ${amount >= 0 ? 'text-green-500' : 'text-red-500'} ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {amount >= 0 ? '+' : ''}{amount}
                        </span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {tx.reason} • {new Date(tx.createdAt).toLocaleString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

