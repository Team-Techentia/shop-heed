import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Image from "next/image";
import limitedCollection from "../../public/assets/images/fashion/limited-collection.png"
import limitedCollection2 from "../../public/assets/images/fashion/limited-collection2.png"
function WhyheedHerbal() {

  return (
    <div style={{ padding:"30px 0px"}}>
      <Container>
        <Row style={{alignSelf:"center" , display:"flex" , alignItems:"center"  }}>
          
             <Col   md="5" lg="4"> 
             <h2 >LIMITED COLLECTION</h2>
           
            <Button className="btn btn-solid py-2 mt-2">See Now</Button>
            
             </Col>
             <Col  md="6" lg="3"> 
             <div >
             <Image style={{  maxHeight:"400px", objectFit:"contain" , width:"100%"}}  src={limitedCollection2} />
             </div>
            
             </Col>
             <Col xs="11" sm="11"  lg="5"> 
             <Image style={{  maxHeight:"800px" , objectFit:"contain" , width:"100%"}}  src={limitedCollection} />
             </Col>


      
        </Row>
      </Container>
    </div>
  );
}

export default WhyheedHerbal;
