// import { TopDashboardCardsData } from "@/Data/Dashboard";
import CountUp from "react-countup";
import { Card, CardBody, Col, Media } from "reactstrap";
import { Box, MessageSquare, Navigation, Users } from "react-feather";
import Link from "next/link";
const TopDashboardCards = ({TopDashboardCardsData}:any) => {

  return (
    <>
     <h4>This Month </h4>
      {TopDashboardCardsData.map((item:any, i:any) => (
        <Col key={i} xl="3 xl-50" md="6">
          <Card className=" o-hidden widget-cards">
            <Link style={{textDecoration:"none"}} href={item.type==="Transaction" ? "/en/sales/transactions" : item.type==="Products" ? "/en/products/physical/product-list" :item.type==="Orders" ? "/en/sales/orders" :item.type==="Users" ? "/en/users/list-user" : "/en/sales/transactions"}>
          
            <CardBody className={item.bgColor}>
              <Media className="static-top-widget row">
                <div className="icons-widgets col-4">
                  <div className="align-self-center text-center">
                    {
                      item.icon==="Navigation" ?  <Navigation className="font-warning" />: item.icon==="Box" ? <Box className="font-secondary" /> : item.icon==="MessageSquare" ?<MessageSquare className="font-primary" /> :item.icon==="Users" ?<Users className="font-danger" />:""
                    }
                    
                     <item.icon  className={item.className}/> </div>


                </div>
                <Media body className="col-8">
                  <span className="m-0">{item.type}</span>
                  <h3 className="mb-0">
                     <CountUp className="counter" end={item.count} />
                    <small> This Month</small>
                  </h3>
                </Media>
              </Media>
            </CardBody>
            </Link>
          </Card>
        </Col>
      ))}
      <h4>Total </h4>
        {TopDashboardCardsData.map((item:any, i:any) => (
        <Col key={i} xl="3 xl-50" md="6">
          <Card className=" o-hidden widget-cards">
          <Link style={{textDecoration:"none"}} href={item.type==="Transaction" ? "/en/sales/transactions" : item.type==="Products" ? "/en/products/physical/product-list" :item.type==="Orders" ? "/en/sales/orders" :item.type==="Users" ? "/en/users/list-user" : "/en/sales/transactions"}>
            <CardBody className={item.bgColor}>
              <Media className="static-top-widget row">
                <div className="icons-widgets col-4">
                  <div className="align-self-center text-center">
                    {
                      item.icon==="Navigation" ?  <Navigation className="font-warning" />: item.icon==="Box" ? <Box className="font-secondary" /> : item.icon==="MessageSquare" ?<MessageSquare className="font-primary" /> :item.icon==="Users" ?<Users className="font-danger" />:""
                    }
                    
                     <item.icon  className={item.className}/> </div>


                </div>
                <Media body className="col-8">
                  <span className="m-0">{item.type}</span>
                  <h3 className="mb-0">
                     <CountUp className="counter" end={item.total} />
                    <small> Total</small>
                  </h3>
                </Media>
              </Media>
              
            </CardBody>
            </Link>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default TopDashboardCards;
