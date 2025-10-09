// pages/category/[category]/[subcategory]/index.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Api from "../../../../components/Api";
import CategorySidebar_popup from "../../../shop/categorySidebar_popup";

// Special shop types
const specialShopTypes = [
  "formal wear",
  "everyday wear",
  "designer wear",
  "street wear",
  "price drop",
  "bestseller",
];

export default function SubCategoryPage() {
  const router = useRouter();
  const { category: categoryy, subcategory } = router.query;

  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch products + subcategory banner
  useEffect(() => {
    if (categoryy && subcategory) {
      const fetchProducts = async () => {
        try {
          let params = {
            category: categoryy ? categoryy.toLocaleLowerCase() : "",
            subCategory: subcategory || "",
          };

          if (specialShopTypes.includes(subcategory)) {
            params.subCategory = "";
            params.shopType = subcategory;
          }

          setLoading(true);
          const res = await Api.filterProduct(params);

          setProducts(res?.data || []);

          // 🔑 if API returns subcategory details with `image`
          if (res?.subCategoryData?.image) {
            setBanner({ src: res.subCategoryData.image });
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [categoryy, subcategory]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <CategorySidebar_popup
      subcategory={subcategory}
      title={subcategory}
      banner={banner}
      product={products}
    />
  );
}
