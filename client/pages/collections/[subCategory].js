import React, { useEffect, useState ,useContext} from 'react';
import CategorySidebar_popup from '../shop/categorySidebar_popup';
import { useRouter } from 'next/router'
import Api from '../../components/Api';
import { LoaderContext } from '../../helpers/loaderContext';
import kurta from "../../public/assets/images/fashion/category-banner-kurta.jpg"
import plain from "../../public/assets/images/fashion/category-banner-plain.jpg"
import checked from "../../public/assets/images/fashion/category-banner-check.jpg"
import printed from "../../public/assets/images/fashion/category-banner-printed.jpg";
import trending from "../../public/assets/images/fashion/trending-banner.jpg"
import { MENUITEMS } from '../../components/constant/menu';
import PlainMetaTag from '../MetaTag/plainMetaTag';
import StripeMetaTag from '../MetaTag/stripeMetaTag';
import HalfSleveMetaTag from '../MetaTag/halfSleveMetaTag';
import PrintedMetaTag from '../MetaTag/printedMetaTag';
import CargoMetaTag from '../MetaTag/cargoMetaTag';
import FormalWearMetaTag from '../MetaTag/formalWearMetaTag';
import CheckShirtsMeta from '../MetaTag/CheckShirtsMeta';

function Category() {
    const router = useRouter();
    const subCategory = router.query.subCategory;
    const [categoryy, setCategoryy] = useState('');
    console.log("subCategory---", subCategory)

    const [data , setData] = useState([])
    const [banner , setBanner] = useState()
    const LoaderContextData = useContext(LoaderContext)
    const { catchErrors , setLoading } = LoaderContextData
    const category = MENUITEMS[1].children;
    // console.log("category", category);
    useEffect(() => {
      if (!category) return;
    
      category.forEach(item => {
        item.children?.forEach(ii => {
          const pathSegment = ii.path.split("/")[2];
          if (pathSegment === subCategory) {
            setCategoryy(item.title);
          }
        });
      });
    }, [category, subCategory]);
    
    
    const fetchData = async ()=>{
        try {
            
          const params = {
            category : categoryy?categoryy.toLocaleLowerCase():'',
            subCategory:subCategory,
            // shopType: updateShopType
          }
          if(subCategory == "formal wear") {
            params.subCategory = "";
            params.shopType = subCategory;
          }
          if(subCategory == "everyday wear") {
            params.subCategory = "";
            params.shopType = subCategory;
          }
          if(subCategory == "designer wear") {
            params.subCategory = "";
            params.shopType = subCategory;
          }
          
          if(subCategory == "street wear") {
            params.subCategory = "";
            params.shopType = subCategory;
          }
          if(subCategory == "trending") {
            params.subCategory = "";
            params.shopType = subCategory;
          }
          if(subCategory == "new") {
            params.subCategory = "";
            params.shopType = subCategory;
          }
          setLoading(true)
          const res = await Api.filterProduct(params)
          setData(res.data)
        } catch (error) {
          catchErrors(error)
        }
        finally {
          setLoading(false)
        }
      }
      useEffect(()=>{
       fetchData()
    const newBanner =   
    //  subCategory ==="check-shirts" ?
    //  checked : subCategory==="plain-shirts" ? 
    //  plain :
      subCategory ==="printed-shirts" ? printed  :subCategory==="kurta-shirts" ? kurta : subCategory==="trending" ? trending : subCategory==="all"  ?"" :""

       setBanner(newBanner)
      },[subCategory, categoryy])
  return (
    <>
    
    <CategorySidebar_popup subCategory={subCategory} banner = {banner} product={data}/>
    </>
  );
}

export default Category;
