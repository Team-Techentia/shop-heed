import React, { Fragment, useState ,useEffect } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { Slider3 } from "../../../services/script";
import Api from "../../Api";
import { Media, Container, Row, Col } from "reactstrap";


const BlogSection = ({  sectionClass }) => {


  const [data , setData] = useState("")

  useEffect(()=>{
    fetchData()
  },[])



  const fetchData = async ()=>{
try {
  const response = await Api.get_All_Blog()
  setData(response.data.data)

} catch (error) {
return;
}

  }



  
 
  return (
    <Fragment>
      <section  className={sectionClass }>
        <Container>
          <Row>
            <Col md="12">
           
              <Slider {...Slider3} className="slide-3 no-arrow slick-default-margin">
                {data &&
                  data.map((item, index) => {
                  
                    return(
                      <Col md="12" key={index}>
                      <Link href={`/blogs/blog-details/${item._id}`}>
                        <div className="classic-effect">
                          <Media style={{ height:"200px" ,minWidth:"200px", objectFit:"cover" , width:"100%"}} src={item.photo} className="img-fluid" alt="image" />
                          <span></span>
                        </div>
                      </Link>
                      <div >
                        <br/>
                        <h2>{item.title}</h2>
                        <Link href={`/blogs/blog-details/${item._id}`}>
                          <p>{item.description.slice(0,100)} </p>
                        </Link>
                      </div>
                    </Col>
                    )
                   
                  })}
              </Slider>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};
export default BlogSection;
