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

type InventoryPageProps = {
  initialProducts: Product[];
};

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  Saree: <GalleryVerticalEnd className="h-4 w-4" />,
  Lehenga: <Pyramid className="h-4 w-4" />,
  Kurta: <Shirt className="h-4 w-4" />,
  Dhoti: <WrapText className="h-4 w-4" />,
};

export function InventoryPage({ initialProducts }: InventoryPageProps) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [genderFilter, setGenderFilter] = React.useState<string>("All");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");
  const [occasionFilter, setOccasionFilter] = React.useState<string>("All");

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [deletingProductId, setDeletingProductId] = React.useState<string | null>(null);

  const { toast } = useToast();

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

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      setProducts(products.filter((p) => p.id !== deletingProductId));
      toast({
        title: "Success",
        description: "Item has been deleted from inventory.",
        variant: "default",
      });
    }
    setIsAlertOpen(false);
    setDeletingProductId(null);
  };

  const handleFormSubmit = (values: Omit<Product, "id" | "imageUrl">) => {
    if (editingProduct) {
      // Update
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...editingProduct, ...values }
            : p
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
        id: (Math.random() * 10000).toString(),
        imageUrl: "https://placehold.co/600x400.png",
      };
      setProducts([newProduct, ...products]);
      toast({
        title: "Success!",
        description: "New item added to inventory.",
      });
    }
    setIsSheetOpen(false);
    setEditingProduct(null);
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
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 h-16 z-10">
        <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-2xl font-semibold">Attire Inventory Pilot</h1>
        </div>
        <div className="ml-auto">
            <Button onClick={handleAddItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Filter className="h-5 w-5"/> Filters</CardTitle>
                <CardDescription>Refine your inventory view with the filters below.</CardDescription>
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
                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Saree">Saree</SelectItem>
                            <SelectItem value="Lehenga">Lehenga</SelectItem>
                            <SelectItem value="Kurta">Kurta</SelectItem>
                            <SelectItem value="Dhoti">Dhoti</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Occasion</label>
                     <Select value={occasionFilter} onValueChange={setOccasionFilter}>
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
            <CardTitle className="font-headline">Inventory</CardTitle>
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
                  <TableHead className="hidden md:table-cell">Fabric</TableHead>
                  <TableHead className="hidden md:table-cell">Occasion</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
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
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="flex items-center gap-2 w-fit">
                            {categoryIcons[product.category]}
                            {product.category}
                        </Badge>
                    </TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.fabric}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.occasion}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditItem(product)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRequest(product.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Add/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="font-headline">{editingProduct ? 'Edit Item' : 'Add New Item'}</SheetTitle>
            <SheetDescription>
              {editingProduct ? 'Update the details of your item.' : 'Fill in the details for the new inventory item.'}
            </SheetDescription>
          </SheetHeader>
          <ItemForm 
            onSubmit={handleFormSubmit}
            initialData={editingProduct}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
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
    </div>
  );
}
