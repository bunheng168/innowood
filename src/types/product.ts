export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  category_id: string;
  category?: Category;  // Optional because it might not be loaded
  in_stock: boolean;
  created_at: string;
  updated_at: string;
} 