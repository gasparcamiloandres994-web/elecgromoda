export type CategoryId = 'todos' | 'refrigeracion' | 'lavado' | 'cocina' | 'pequenos' | 'climatizacion';

export type EnergyRating = 'A+++' | 'A++' | 'A+' | 'A' | 'B' | 'C';

export interface ProductSpecs {
  dimensiones: string;
  capacidad?: string;
  potencia?: string;
  nivelRuido?: string;
  consumo?: string;
  garantia: string;
  color: string;
  smartWifi: boolean;
  peso?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  modelCode: string;
  category: CategoryId;
  categoryName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  freeShipping: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  energyRating: EnergyRating;
  image: string;
  tagline: string;
  description: string;
  specs: ProductSpecs;
  features: string[];
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  energyRatings: EnergyRating[];
  onlyInStock: boolean;
  onlyFreeShipping: boolean;
  onlyOffers: boolean;
  onlyWifi: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DbOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  city?: string;
  payment_method: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  subtotal: string | number;
  discount: string | number;
  shipping: string | number;
  total: string | number;
  status: string;
  created_at: string;
}
