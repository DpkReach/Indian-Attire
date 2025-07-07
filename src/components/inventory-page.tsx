
"use client";

import Image from "next/image";
import * as React from "react";
import {
  Package,
  PlusCircle,
  MoreHorizontal,
  Shirt,
  GalleryVerticalEnd,
  Pyramid,
  WrapText,
  Filter,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductCategory } from "@/types";
import { ItemForm } from "./item-form";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { products as initialProducts } from "@/lib/data";


const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  Saree: <GalleryVerticalEnd className="h-4 w-4" />,
  Lehenga: <Pyramid className="h-4 w-4" />,
  Kurta: <Shirt className="h-4 w-4" />,
  Dhoti: <WrapText className="h-4 w-4" />,
};

export function InventoryPage() {
  const [isAdmin, setIsAdmin] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const [genderFilter, setGenderFilter] = React.useState<string>("All");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");
  const [occasionFilter, setOccasionFilter] = React.useState<string>("All");

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [deletingProductId, setDeletingProductId] = React.useState<string | null>(null);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");

  const { toast } = useToast();

  React.useEffect(() => {
    setIsLoading(true);
    try {
      const storedProducts = localStorage.getItem("inventory-products");
      const storedCategories = localStorage.getItem("inventory-categories");

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts);
      }
      
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        const uniqueCategories = [...new Set(parsedCategories)] as ProductCategory[];
        setCategories(uniqueCategories);
      } else {
        const uniqueCategories = [...new Set(initialProducts.map((p) => p.category))] as ProductCategory[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
      setProducts(initialProducts);
      const uniqueCategories = [...new Set(initialProducts.map((p) => p.category))] as ProductCategory[];
      setCategories(uniqueCategories);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem("inventory-products", JSON.stringify(products));
        localStorage.setItem("inventory-categories", JSON.stringify(categories));
      } catch (error) {
        console.error("Error writing to localStorage", error);
        toast({
          variant: "destructive",
          title: "Could not save data",
          description: "There was an error saving your changes.",
        });
      }
    }
  }, [products, categories, isInitialLoad, toast]);


  const handleAddItem = () => {
    setEditingProduct(null);
    setIsSheetOpen(true);
  };

  const handleEditItem = (product: Product) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  const handleDeleteRequest = (productId: string) => {
    setDeletingProductId(productId);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProductId) {
      setProducts(products.filter((p) => p.id !== deletingProductId));
      toast({
        title: "Success",
        description: "Item has been deleted.",
      });
    }
    setIsAlertOpen(false);
    setDeletingProductId(null);
  };

  const handleFormSubmit = async (values: Omit<Product, "id" | "imageUrl">) => {
    setIsSheetOpen(false);
    
    if (editingProduct) {
      // Update
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...values, imageUrl: p.imageUrl } : p
        )
      );
      toast({
        title: "Success!",
        description: "Item has been updated.",
      });
    } else {
      // Add
      const newProduct: Product = {
        ...values,
        id: new Date().getTime().toString(), // Simple unique ID
        imageUrl: `https://placehold.co/600x400.png`,
      };
      setProducts([newProduct, ...products]);
      toast({
        title: "Success!",
        description: "New item added to inventory.",
      });
    }
    setEditingProduct(null);
  };
  
  const handleAddCategory = async () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      const newCategories = [...categories, trimmedCategory as ProductCategory];
      setCategories(newCategories);
      toast({
        title: "Success",
        description: `Category "${trimmedCategory}" added.`,
      });
      setCategoryFilter(trimmedCategory);
    } else if (categories.includes(trimmedCategory)) {
      toast({
        title: "Info",
        description: `Category "${trimmedCategory}" already exists.`,
      });
    }
    setIsAddCategoryOpen(false);
    setNewCategory("");
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const genderMatch =
        genderFilter === "All" || product.gender === genderFilter;
      const categoryMatch =
        categoryFilter === "All" || product.category === categoryFilter;
      const occasionMatch =
        occasionFilter === "All" || product.occasion === occasionFilter;
      return genderMatch && categoryMatch && occasionMatch;
    });
  }, [products, genderFilter, categoryFilter, occasionFilter]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-headline text-3xl font-semibold">Inventory</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="admin-mode" className="text-sm font-medium">
              Admin Mode
            </Label>
            <Switch
              id="admin-mode"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
          </div>
          {isAdmin && (
            <>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category
              </Button>
              <Button onClick={handleAddItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
          <CardDescription>
            Refine your inventory view with the filters below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Gender</label>
            <Tabs value={genderFilter} onValueChange={setGenderFilter}>
              <TabsList>
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Women">Women</TabsTrigger>
                <TabsTrigger value="Men">Men</TabsTrigger>
                <TabsTrigger value="Unisex">Unisex</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Occasion</label>
            <Select
              value={occasionFilter}
              onValueChange={setOccasionFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Occasions</SelectItem>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Inventory List</CardTitle>
          <CardDescription>
            A list of all traditional Indian attire in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fabric
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Occasion
                </TableHead>
                <TableHead>Stock</TableHead>
                {isAdmin && (
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                    {isAdmin && <TableCell><Skeleton className="h-8 w-8" /></TableCell>}
                  </TableRow>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                        data-ai-hint={`${product.category} ${product.color}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 w-fit"
                      >
                        {categoryIcons[product.category] || <Package className="h-4 w-4" />}
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.fabric}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.occasion}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditItem(product)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteRequest(product.id)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                    No products found. Add one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </div>
        </CardFooter>
      </Card>

      {/* Add/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="font-headline">
              {editingProduct ? "Edit Item" : "Add New Item"}
            </SheetTitle>
            <SheetDescription>
              {editingProduct
                ? "Update the details of your item."
                : "Fill in the details for the new inventory item."}
            </SheetDescription>
          </SheetHeader>
          <ItemForm
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
            onCancel={() => setIsSheetOpen(false)}
            categories={categories}
          />
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Add New Category</DialogTitle>
            <DialogDescription>
              Enter the name for the new category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="category-name" className="sr-only">
              Category Name
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Sherwani"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
          <DialogFooter>
             <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
