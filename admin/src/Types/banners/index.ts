// Simplified for home banners only
export interface Banner {
  _id: string;
  title: string;
  image: string;
  bannerType: "home"; // Always "home"
  isActive: boolean;
  priority: number;
  clickAction: "none" | "category" | "subcategory";
  targetCategory?: any; // ObjectId ref
  targetSubCategory?: any; // ObjectId ref
  createdAt: string;
  updatedAt: string;
}

// Keep Category/SubCategory as-is
export interface Category {
  _id: string;
  name: string;
  // Add other fields if needed
}

export interface SubCategory {
  _id: string;
  name: string;
  categoryId: string; // Ref to Category._id
  // Add other fields if needed
}