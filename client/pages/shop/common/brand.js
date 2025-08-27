import React, { useState, useContext, useEffect } from "react";
import { Collapse, Input } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import Api from "../../../components/Api";
import { LoaderContext } from "../../../helpers/loaderContext";


const Brand = () => {

  const context = useContext(FilterContext);
  const isChecked = context.isChecked;
  const [isOpen, setIsOpen] = useState(false);
  const toggleBrand = () => setIsOpen(!isOpen);
  const [brands , setBrands] = useState([])
  const [url, setUrl] = useState();
  const LoaderContextData = useContext(LoaderContext)
  const { catchErrors , setLoading } = LoaderContextData

  useEffect(() => {
    const pathname = window.location.pathname;
    setUrl(pathname);
  }, []);
  const fetchData = async ()=>{
    try {
      setLoading(true)
      const res = await Api.AllBrands()
      setBrands(res.data.data)
    } catch (error) {
      catchErrors(error);
    }
    finally {
      setLoading(false)
    }
  }

useEffect(() => {
  fetchData()
}, []);

 

  return (
    <div className="collection-collapse-block open">
      <h3 className="collapse-block-title" onClick={toggleBrand}>
        brand
      </h3>
      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content"> 
          <div className="collection-brand-filter">
            { brands && 
              brands.map((data, index) => (
                  <div
                    className="form-check custom-checkbox collection-filter-checkbox"
                    key={index}
                  >
                    <Input
                      checked={context.selectedBrands.includes(data.brand)}
                      onChange={() => {
                        context.handleBrands(data.brand, isChecked);

                      }}
                      type="checkbox"
                      className="custom-control-input"
                      id={data.brand}
                    />
                    <label className="custom-control-label" htmlFor={data.brand}>
                      {data.brand}
                    </label>
                  </div>
                ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Brand;
