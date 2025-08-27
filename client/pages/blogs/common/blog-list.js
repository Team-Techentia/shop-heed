import { React, useState, useEffect } from "react";
import { Col, Media, Row } from "reactstrap";
import Api from "../../../components/Api";


const BlogList = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Api.get_All_Blog();
      setData(response.data.data);
    } catch (error) {}
  };

  return (
    <>
      {" "}
      <Row className="blog-media ">
        {data &&
          data.map((item, i) => {
            const newDes = item.description && item.description.slice(0, 100);
            return (
              <Col xl="4" key={i} lg="4" md="6" sm="12" xs="12" className="mt-3">
                <div className="">
                  <a href={`/blogs/blog-details/${item._id}`}>
                    <Media
                      style={{
                        maxHeight: "200px",
                        minHeight: "200px",
                        minWidth: "200px",
                        width:"100%",objectFit:"cover"
                      }}
                      src={item.photo}
                      className="img-fluid blur-up lazyload bg-img"
                      alt=""
                    />
                  </a>
                </div>
                <div>
                  <div  className="mt-2">
                    <h4 style={{fontWeight:"600"}}>{item.title}</h4>
                    <a href={`/blogs/blog-details/${item._id}`}>
                  <p>{newDes} </p>
                    </a>
                  </div>
                </div>
              </Col>
            );
          })}
      </Row>
    </>
  );
};

export default BlogList;
