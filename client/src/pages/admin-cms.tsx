import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, Plus, Edit, Trash2, Eye, Languages, Globe, Type, Image as ImageIcon, Video, Code } from "lucide-react";
import type { CmsContent } from "@shared/schema";

export default function AdminCMS() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<CmsContent | null>(null);

  const { data: cmsContent = [], isLoading } = useQuery<CmsContent[]>({
    queryKey: ["/api/admin/cms"],
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (key: string) => {
      await apiRequest("DELETE", `/api/admin/cms/${key}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'json':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'bg-primary/10 text-primary';
      case 'image':
        return 'bg-chart-2/10 text-chart-2';
      case 'video':
        return 'bg-chart-2/10 text-chart-2';
      case 'json':
        return 'bg-chart-3/10 text-chart-3';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Languages className="h-8 w-8 text-primary" />
            CMS Content Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage bilingual content for your platform (English/Arabic)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-content">
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Content</DialogTitle>
              <DialogDescription>Add bilingual content to your platform</DialogDescription>
            </DialogHeader>
            <ContentForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['text', 'image', 'video', 'json'].map(type => {
          const count = cmsContent.filter(c => c.contentType === type).length;
          return (
            <Card key={type} className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getContentTypeColor(type)}`}>
                    {getContentTypeIcon(type)}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library ({cmsContent.length})</CardTitle>
          <CardDescription>All CMS content entries with bilingual support</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : cmsContent.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No content found</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first content entry to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>English Content</TableHead>
                    <TableHead>Arabic Content</TableHead>
                    <TableHead>Updated By</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cmsContent.map((content) => (
                    <TableRow key={content.id} className="hover-elevate" data-testid={`row-cms-${content.key}`}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {content.key}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${getContentTypeColor(content.contentType)}`}>
                            {getContentTypeIcon(content.contentType)}
                          </div>
                          <span className="text-sm capitalize">{content.contentType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="text-sm text-muted-foreground truncate">
                          {content.contentEn || <span className="italic">Not set</span>}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="text-sm text-muted-foreground truncate" dir="rtl">
                          {content.contentAr || <span className="italic">Not set</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {content.updatedBy || 'System'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(content.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                data-testid={`button-view-cms-${content.key}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Preview Content</DialogTitle>
                                <DialogDescription>View bilingual content preview</DialogDescription>
                              </DialogHeader>
                              <ContentPreview content={content} />
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingContent(content)}
                                data-testid={`button-edit-cms-${content.key}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Content</DialogTitle>
                                <DialogDescription>Update bilingual content</DialogDescription>
                              </DialogHeader>
                              <ContentForm
                                initialData={content}
                                onClose={() => setEditingContent(null)}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${content.key}"?`)) {
                                deleteContentMutation.mutate(content.key);
                              }
                            }}
                            data-testid={`button-delete-cms-${content.key}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ContentForm({ initialData, onClose }: { initialData?: CmsContent; onClose: () => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    key: initialData?.key || "",
    contentType: initialData?.contentType || "text",
    contentEn: initialData?.contentEn || "",
    contentAr: initialData?.contentAr || "",
    metadata: initialData?.metadata ? JSON.stringify(initialData.metadata, null, 2) : "{}",
  });

  const upsertContentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let metadata;
      try {
        metadata = JSON.parse(data.metadata);
      } catch {
        metadata = {};
      }

      await apiRequest("PUT", "/api/admin/cms", {
        key: data.key,
        contentType: data.contentType,
        contentEn: data.contentEn,
        contentAr: data.contentAr,
        metadata,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: initialData ? "Content updated successfully" : "Content created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertContentMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Content Key*</Label>
          <Input
            id="key"
            required
            placeholder="e.g., hero.title"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            disabled={!!initialData}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type*</Label>
          <Select
            value={formData.contentType}
            onValueChange={(value) => setFormData({ ...formData, contentType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image URL</SelectItem>
              <SelectItem value="video">Video URL</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="english" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english" className="gap-2">
            <Globe className="h-4 w-4" />
            English
          </TabsTrigger>
          <TabsTrigger value="arabic" className="gap-2">
            <Languages className="h-4 w-4" />
            Arabic
          </TabsTrigger>
        </TabsList>
        <TabsContent value="english" className="space-y-2">
          <Label htmlFor="contentEn">English Content</Label>
          <Textarea
            id="contentEn"
            placeholder="Enter English content..."
            value={formData.contentEn}
            onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
            rows={6}
          />
        </TabsContent>
        <TabsContent value="arabic" className="space-y-2">
          <Label htmlFor="contentAr">Arabic Content</Label>
          <Textarea
            id="contentAr"
            placeholder="أدخل المحتوى بالعربية..."
            value={formData.contentAr}
            onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
            rows={6}
            dir="rtl"
          />
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="metadata">Metadata (JSON)</Label>
        <Textarea
          id="metadata"
          placeholder='{"key": "value"}'
          value={formData.metadata}
          onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={upsertContentMutation.isPending}>
          {upsertContentMutation.isPending ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ContentPreview({ content }: { content: CmsContent }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 pb-4 border-b">
        <div>
          <Label className="text-muted-foreground text-sm">Key</Label>
          <p className="font-mono font-medium mt-1">{content.key}</p>
        </div>
        <div>
          <Label className="text-muted-foreground text-sm">Type</Label>
          <Badge variant="outline" className="mt-1 capitalize">{content.contentType}</Badge>
        </div>
      </div>

      <Tabs defaultValue="english" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="arabic">Arabic</TabsTrigger>
        </TabsList>
        <TabsContent value="english" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {content.contentType === 'image' ? (
                <img src={content.contentEn || ''} alt="Preview" className="max-w-full rounded-md" />
              ) : content.contentType === 'video' ? (
                <video src={content.contentEn || ''} controls className="max-w-full rounded-md" />
              ) : content.contentType === 'json' ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {JSON.stringify(JSON.parse(content.contentEn || '{}'), null, 2)}
                </pre>
              ) : (
                <p className="whitespace-pre-wrap">{content.contentEn}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="arabic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent dir="rtl">
              {content.contentType === 'image' ? (
                <img src={content.contentAr || ''} alt="Preview" className="max-w-full rounded-md" />
              ) : content.contentType === 'video' ? (
                <video src={content.contentAr || ''} controls className="max-w-full rounded-md" />
              ) : content.contentType === 'json' ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {JSON.stringify(JSON.parse(content.contentAr || '{}'), null, 2)}
                </pre>
              ) : (
                <p className="whitespace-pre-wrap">{content.contentAr}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {content.metadata && Object.keys(content.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(content.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
