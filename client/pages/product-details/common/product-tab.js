import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import MarkdownRenderer from "../../../components/MarkDown";

const ProductTab = ({ item }) => {
  const [activeTab, setActiveTab] = useState("2");

  return (
    <section className="tab-product m-0">
      <Container>
        <Row>
          <Col sm="12" lg="12">
            <Row className="product-page-main m-0">
              <Nav tabs className="nav-material">
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                <NavLink
                    className={activeTab === "2" ? "active" : ""}
                    onClick={() => setActiveTab("2")}
                  > Description
                    
                  </NavLink>
               
                </NavItem>
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                <NavLink
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => setActiveTab("1")}
                  >
                   Details
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="nav-material">
                <TabPane tabId="1">
                <p className="mb-0 pb-0">
                    <table style={{ borderCollapse: "collapse" }}>
                      <tbody>
                        {item &&
                          item.specificationArray &&
                          item.specificationArray.map((data, index) => {
                            return (
                              <tr style={{ border: "none" }}>
                                <td style={{ border: "none", padding: "8px" }}>
                                  {" "}
                                  <b>{data.question}</b>{" "}
                                </td>
                                <td style={{ border: "none", padding: "8px" }}>
                                  {data.answer}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </p>
                </TabPane>
                <TabPane tabId="2">
               <p className="mb-0 pb-0">
                    {<MarkdownRenderer markdown={item.description} />}
                  </p>
                </TabPane>
              </TabContent>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductTab;
