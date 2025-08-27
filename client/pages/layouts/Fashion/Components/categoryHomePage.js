import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Container,  Media } from "reactstrap";
import Api from "../../../../components/Api";



const MasterCollectionBanner = ({ img, about, link }) => {
  return (
    <div className="mx-2" >
      <Link href={link}>
      
          <div >
            <Media style={{ borderRadius:"5px", width:"100px" , height:"70px" , objectFit:"cover" }} src={img} className="" alt="" />
         
            <h5 style={{textTransform:"capitalize" , textAlign:"center"}}> <strong>{about}</strong> </h5>
          </div>
        
      </Link>
    </div>
  );
};

const CategoryHomePage = () => {
  const [data , setData] = useState([])

  const fetchData = async ()=>{
    try {
      
      const getData = await Api.getCategory()
      setData(getData.data.data)
    } catch (error) {
      return;
    }
  }
useEffect(() => {
  fetchData()
}, []);
  return (
    <Fragment>
      <section className=""> 
        <Container>
          <div  className="d-flex px-2 py-3" style={{flexWrap:"wrap" ,boxShadow:" 4px 9px 33px -3px rgba(0,0,0,0.1)"}}>
            { data && data.length>=1 && data.map((data, i) => {
              return (
                <MasterCollectionBanner
                  key={i}
                  img={data.image}
                  about={data.category}
                  link={`/${data.category}`}
                />
              );
            })}
          </div>
        </Container>
      </section>
    </Fragment>
  );
};

export default CategoryHomePage;
