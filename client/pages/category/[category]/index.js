import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Api from "../../../components/Api";
import CategorySidebar_popup from "../../shop/categorySidebar_popup";

// shop types that should override subCategory
const specialShopTypes = [
  "formal wear",
  "everyday wear",
  "designer wear",
  "street wear",
  "trending",
  "bestseller",
];

export default function CategoryPage() {
  const router = useRouter();
  const { category: categoryy } = router.query;

  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 3500],
    selectedColors: [],
    sizes: [],
  });

  const [showSidebar, setShowSidebar] = useState(false); // 👈 control popup open/close

  // fetch API products
  useEffect(() => {
    if (categoryy) {
      const fetchProducts = async () => {
        try {
          let params = {
            category: categoryy ? categoryy.toLowerCase() : "",
            subCategory: "",
            ...filters,
          };

          if (specialShopTypes.includes(categoryy)) {
            params.subCategory = "";
            params.shopType = categoryy;
          }

          setLoading(true);
          const res = await Api.filterProduct(params);

          setProducts(res?.data || []);

          if (res?.categoryData?.image) {
            setBanner({ src: res.categoryData.image });
          }
        } catch (error) {
          console.error("Error fetching category products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [categoryy, filters]);

  return (
    <div className="category-page flex gap-6">
      {/* Sidebar popup */}
      <CategorySidebar_popup
        subCategory={categoryy}
        banner={banner}
        product={products}
        onClose={() => setShowSidebar(false)} // 👈 pass close handler
      />

      {/* Main content */}
      <div className="flex-1">
        {/* If you want filter UI later */}
        {/* <Filters filters={filters} setFilters={setFilters} /> */}

        
      </div>
    </div>
  );
}
