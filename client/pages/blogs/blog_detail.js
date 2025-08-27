import {React , useState , useEffect} from 'react';
import { Container,  Row, Col } from "reactstrap";
import CommonLayout from "../../components/shop/common-layout";
import Api from '../../components/Api';
import { useRouter } from 'next/router'
import MarkdownRenderer from '../../components/MarkDown';

const BlogDetail = ({id}) => {
  const[data,setData ] =useState(null)
  const router = useRouter();
   
  useEffect(()=>{
    fetchData()
  },[router])

  const fetchData = async ()=>{
    try {
      const response = await Api.get_Blog_Id(id)
      setData(response.data.data)
    } catch (error) {
    }}

  return (
    <CommonLayout parent="home" title="blog" subTitle="blog detail">
      <section className="blog-detail-page section-b-space ratio2_3">
        <Container>
          <Row>
          {data !== null ?   <Col sm="12" className="blog-detail">
              <img style={{maxHeight:"500px" , objectFit:"cover" , width:"100%"}} src={data.photo} className="img-fluid blur-up lazyload" alt="" />
              <h3>{data.title}</h3>
              <ul className="post-social">
                <li>{data.createdAt.slice(0,10)} </li> 
              </ul>
              <p>
              {<MarkdownRenderer markdown={data.description} />}
              
              </p>
            </Col> : "Data Not found"}
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default BlogDetail;
