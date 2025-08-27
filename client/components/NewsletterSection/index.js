import React from "react";
import { Container, Row, Col, Media, Input, Button, Form } from "reactstrap";
import newsLetter from "../../public/assets/images/newletterimage.png";

function NewsletterSection() {

  return (
    <div >
      <Container>
        <Row style={{border:"0.1px solid rgba(211, 198, 198, 0.4509803922)" , padding:"0px" , margin:"0px" , borderRadius:"10px" }}>
          <Col xs="12" sm="12" md="6" lg="6" xl="6" style={{ padding:"0px" , margin:"0px" }}  >
          <Media style={{maxHeight:"400px" , width:"100%" , borderRadius:"10px"}} src={newsLetter.src} alt="show"/>
          </Col>

          <Col xs="12" sm="12" md="6" lg="6" xl="6" style={{display:"flex" , justifyContent:"center" ,  alignItems:"center" }} >

             <div style={{ display:"flex" , flexDirection:"column" }}>
              <br/>
              <h2> Nice to meet you - Let's be friends </h2>
              <p> Sign up to our newsletter to receive THE BEST entertaining news about Teas</p>

              <p> Receive  10% OFF on your first order when you sign up for Whatsapp</p>


              <Col >
                    <Form style={{flexDirection:"column" , gap:"10px" , width:"100%" ,  paddingBottom:"20px"}} className=" subscribe-form">
                     
                      <Input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput1"
                          placeholder="Enter your Name"
                          style={{width:"80%"}}
                        />
                        <Input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput1"
                          style={{width:"80%"}}
                          placeholder="Enter your Number"
                        />
                    
                      <Button style={{width:"fit-content"}} type="submit" className="btn btn-solid">
                        subscribe
                      </Button>
                    </Form>
                  </Col>
             </div>
           
             </Col>


      
        </Row>
      </Container>
    </div>
  );
}

export default NewsletterSection;
