import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Building2, Award, CheckCircle2, AlertCircle, Search } from "lucide-react";
import type { Developer } from "@shared/schema";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminDevelopers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading } = useQuery<PaginatedResponse<Developer>>({
    queryKey: ["/api/admin/developers", page, pageSize, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/admin/developers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch developers');
      return response.json();
    },
  });

  const developers = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const startItem = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endItem = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">المطورين</h1>
        <p className="text-muted-foreground text-lg">إدارة ومراقبة المطورين</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name or license number..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                data-testid="input-search-developers"
              />
            </div>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-full md:w-[150px]" data-testid="select-page-size">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
            Showing {startItem}-{endItem} of {pagination.total} developers
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : developers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">لا يوجد مطورين بعد</h3>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {developers.map((developer, index) => (
            <Card key={developer.id} className="hover-elevate" data-testid={`card-developer-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span data-testid={`text-company-${index}`}>{developer.companyName}</span>
                  <Badge variant={developer.verified ? 'default' : 'secondary'} data-testid={`badge-verified-${index}`}>
                    {developer.verified ? (
                      <><CheckCircle2 className="w-3 h-3 me-1" /> موثق</>
                    ) : (
                      <><AlertCircle className="w-3 h-3 me-1" /> غير موثق</>
                    )}
                  </Badge>
                </CardTitle>
                <CardDescription data-testid={`text-license-${index}`}>
                  {developer.licenseNumber || 'لا يوجد رخصة'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">نقاط الثقة</p>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" style={{color: '#ffd700'}} />
                      <span className="text-xl font-bold text-foreground" data-testid={`text-trust-${index}`}>
                        {Number(developer.trustScore).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الصفقات الناجحة</p>
                    <span className="text-xl font-bold text-chart-3" data-testid={`text-deals-${index}`}>
                      {developer.successfulDeals}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الصفقات</p>
                    <span className="text-lg font-medium text-foreground" data-testid={`text-total-${index}`}>
                      {developer.totalDeals}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الشكاوى</p>
                    <span className="text-lg font-medium text-destructive" data-testid={`text-complaints-${index}`}>
                      {developer.complaints}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      data-testid="button-prev-page"
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNumber = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = pagination.page - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pagination.page === pageNumber}
                          className="cursor-pointer"
                          data-testid={`button-page-${pageNumber}`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                      className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      data-testid="button-next-page"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
