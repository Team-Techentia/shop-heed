// pages/category/[category]/index.js
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

  useEffect(() => {
    if (categoryy) {
      const fetchProducts = async () => {
        try {
          let params = {
            category: categoryy ? categoryy.toLocaleLowerCase() : "",
            subCategory: "",
          };

          // if category itself matches shopType, handle here
          if (specialShopTypes.includes(categoryy)) {
            params.subCategory = "";
            params.shopType = categoryy;
          }

          setLoading(true);
          const res = await Api.filterProduct(params);

          setProducts(res?.data || []);

          // 🔑 use category image (if API returns category info)
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
  }, [categoryy]);

  // if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <CategorySidebar_popup
      subCategory={categoryy} // pass category name as heading
      banner={banner}
      product={products}
    />
  );
}
