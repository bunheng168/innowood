import { createBrowserClient } from '@supabase/ssr';
import { Product, Category } from '@/types/product';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Upload multiple product images
export async function uploadProductImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('innowood-image')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('innowood-image')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error in file upload:', error);
      throw error;
    }
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

// Add a new product
export async function addProduct(productData: Partial<Product>) {
  const { error } = await supabase
    .from('products')
    .insert([productData]);

  return {
    success: !error,
    error: error?.message
  };
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
}

// Get a single product
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

// Update a product
export async function updateProduct(id: string, productData: Partial<Product>) {
  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  return {
    success: !error,
    error: error?.message
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  return {
    success: !error,
    error: error?.message
  };
}

// Upload product image
export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('innowood-image')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('innowood-image')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

export async function addCategory(categoryData: Pick<Category, 'name' | 'description'>) {
  const { error } = await supabase
    .from('categories')
    .insert([categoryData]);

  return {
    success: !error,
    error: error?.message
  };
}

export async function updateCategory(id: string, categoryData: Pick<Category, 'name' | 'description'>) {
  const { error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id);

  return {
    success: !error,
    error: error?.message
  };
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  return {
    success: !error,
    error: error?.message
  };
}

// Get filtered products with pagination
export async function getFilteredProducts(options: {
  categoryId?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  products: Product[];
  total: number;
}> {
  const { categoryId, page = 1, limit = 12 } = options;
  const offset = (page - 1) * limit;

  try {
    // First get the count
    const countQuery = supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Apply category filter if provided
    if (categoryId) {
      countQuery.eq('category_id', categoryId);
    }

    // Then get the actual data
    let dataQuery = supabase
      .from('products')
      .select('*, category:categories(*)');

    // Apply same category filter if provided
    if (categoryId) {
      dataQuery = dataQuery.eq('category_id', categoryId);
    }

    // Add pagination
    dataQuery = dataQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Execute both queries
    const [countResult, dataResult] = await Promise.all([
      countQuery,
      dataQuery
    ]);

    if (dataResult.error) throw dataResult.error;
    if (countResult.error) throw countResult.error;

    return {
      products: dataResult.data || [],
      total: countResult.count || 0
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
} 