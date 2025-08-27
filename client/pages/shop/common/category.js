import React, { useState, useContext, useEffect } from "react";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { useRouter } from "next/router";
const Category = () => {
  const router = useRouter();
  const context = useContext(FilterContext);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const setSelectedCategory = context.setSelectedCategory;
  const [url, setUrl] = useState();
  useEffect(() => {
    const pathname = window.location.pathname;
    setUrl(pathname);
  }, []);

  const updateCategory = (category) => {
    setSelectedCategory(category);
    router.push(`${url}?category=${category}&brand=${context.selectedBrands}&color=${context.selectedColor}&size=${context.selectedSize}&minPrice=${context.selectedPrice?.min}&maxPrice=${context.selectedPrice?.max}`, undefined, { shallow: true });

  };

  return (
    <>
      <div className="collection-collapse-block open">
        <h3 className="collapse-block-title" onClick={toggleCategory}>
          Category
        </h3>
        <Collapse isOpen={isCategoryOpen}>
          <div className="collection-collapse-block-content">
            <div className="collection-brand-filter">
              <ul className="category-list">
                <li>
                  <a href={null} onClick={() => updateCategory("")}>
                    all products
                  </a>
                </li>
                <li>
                  <a href={null} onClick={() => updateCategory("men")}>
                    Men
                  </a>
                </li>
                <li>
                  <a href={null} onClick={() => updateCategory("women")}>
                    Women
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Category;
