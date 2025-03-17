
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Save, DollarSign, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PricingService, PriceTier, ServiceType } from "@/services/pricing-service";

const Pricing = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentFilter, setCurrentFilter] = useState<'all' | ServiceType>('all');
  const [editingTier, setEditingTier] = useState<PriceTier | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTier, setNewTier] = useState<Omit<PriceTier, 'id'>>({
    service: 'followers',
    quantity: 100,
    price: 1.99,
    originalPrice: 2.99
  });

  // Query to fetch price tiers
  const { data: priceTiers = [], isLoading } = useQuery({
    queryKey: ['priceTiers'],
    queryFn: PricingService.getAllPriceTiers
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: PricingService.updatePriceTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceTiers'] });
      setEditingTier(null);
      toast({
        title: "Price updated",
        description: "The pricing tier has been updated successfully",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: PricingService.deletePriceTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceTiers'] });
      toast({
        title: "Price tier deleted",
        description: "The pricing tier has been removed",
        variant: "destructive",
      });
    }
  });

  const addMutation = useMutation({
    mutationFn: PricingService.addPriceTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceTiers'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Price tier added",
        description: `Added new pricing for ${newTier.quantity} ${newTier.service}`,
      });
      
      // Reset form
      setNewTier({
        service: 'followers',
        quantity: 100,
        price: 1.99,
        originalPrice: 2.99
      });
    }
  });

  const filteredTiers = currentFilter === 'all' 
    ? priceTiers 
    : priceTiers.filter(tier => tier.service === currentFilter);

  const handleSaveEdits = () => {
    if (!editingTier) return;
    updateMutation.mutate(editingTier);
  };

  const handleDeleteTier = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleAddNewTier = () => {
    addMutation.mutate(newTier);
  };
  
  const handleTogglePopular = (tier: PriceTier) => {
    updateMutation.mutate({
      ...tier,
      popular: !tier.popular
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing Management</h1>
          <p className="text-muted-foreground">
            Manage your service pricing tiers and special offers.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Price Tier
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={currentFilter === 'all' ? 'default' : 'outline'} 
          onClick={() => setCurrentFilter('all')}
        >
          All Services
        </Button>
        <Button 
          variant={currentFilter === 'followers' ? 'default' : 'outline'} 
          onClick={() => setCurrentFilter('followers')}
        >
          Followers
        </Button>
        <Button 
          variant={currentFilter === 'likes' ? 'default' : 'outline'} 
          onClick={() => setCurrentFilter('likes')}
        >
          Likes
        </Button>
        <Button 
          variant={currentFilter === 'views' ? 'default' : 'outline'} 
          onClick={() => setCurrentFilter('views')}
        >
          Views
        </Button>
        <Button 
          variant={currentFilter === 'comments' ? 'default' : 'outline'} 
          onClick={() => setCurrentFilter('comments')}
        >
          Comments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell className="capitalize">{tier.service}</TableCell>
                      <TableCell>{tier.quantity.toLocaleString()}</TableCell>
                      <TableCell>${tier.price.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground line-through">
                        ${tier.originalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={tier.popular ? "text-yellow-500" : "text-muted-foreground"}
                          onClick={() => handleTogglePopular(tier)}
                          disabled={updateMutation.isPending}
                        >
                          {tier.popular ? "★ Popular" : "☆ Mark as Popular"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setEditingTier(tier)}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteTier(tier.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending && deleteMutation.variables === tier.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredTiers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No pricing tiers found for this filter. Add a new price tier to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Price Sheet */}
      <Sheet open={!!editingTier} onOpenChange={(open) => !open && setEditingTier(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Price Tier</SheetTitle>
            <SheetDescription>
              Update the pricing for this service tier.
            </SheetDescription>
          </SheetHeader>
          
          {editingTier && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <div className="capitalize font-medium">{editingTier.service}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={editingTier.quantity}
                  onChange={(e) => setEditingTier({
                    ...editingTier,
                    quantity: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Current Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingTier.price}
                  onChange={(e) => setEditingTier({
                    ...editingTier,
                    price: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={editingTier.originalPrice}
                  onChange={(e) => setEditingTier({
                    ...editingTier,
                    originalPrice: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="popular">Mark as Popular</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={!!editingTier.popular}
                    onChange={(e) => setEditingTier({
                      ...editingTier,
                      popular: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="popular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Highlight as a popular option
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button 
              onClick={handleSaveEdits} 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Add New Tier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Price Tier</DialogTitle>
            <DialogDescription>
              Create a new pricing tier for your services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-service">Service</Label>
              <select 
                id="new-service"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={newTier.service}
                onChange={(e) => setNewTier({
                  ...newTier,
                  service: e.target.value as ServiceType
                })}
              >
                <option value="followers">Followers</option>
                <option value="likes">Likes</option>
                <option value="views">Views</option>
                <option value="comments">Comments</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-quantity">Quantity</Label>
              <Input
                id="new-quantity"
                type="number"
                value={newTier.quantity}
                onChange={(e) => setNewTier({
                  ...newTier,
                  quantity: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-price">Current Price ($)</Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                value={newTier.price}
                onChange={(e) => setNewTier({
                  ...newTier,
                  price: parseFloat(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-originalPrice">Original Price ($)</Label>
              <Input
                id="new-originalPrice"
                type="number"
                step="0.01"
                value={newTier.originalPrice}
                onChange={(e) => setNewTier({
                  ...newTier,
                  originalPrice: parseFloat(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-popular">Mark as Popular</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="new-popular"
                  checked={!!newTier.popular}
                  onChange={(e) => setNewTier({
                    ...newTier,
                    popular: e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="new-popular" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Highlight as a popular option
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleAddNewTier}
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Price Tier
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
