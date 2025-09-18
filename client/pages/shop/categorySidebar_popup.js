import React from "react";
import { Container, Row } from "reactstrap";
import CatogeryPopupSidebar from "./common/catogeryPopupSidebar";
import HeaderOne from "../../components/headers/header-one";
import MasterFooter from "../../components/footers/common/MasterFooter";
import Paragraph from "../../components/common/Paragraph";

const CategorySidebar_popup = ({ product, banner, subCategory }) => {
  console.log("subCategory", subCategory);

  return (
    <>
      <HeaderOne noTopBar={false} logoName={"logo.png"} topClass="top-header" />

      {banner && banner.src && (
        <img
          style={{ width: "100%", maxHeight: "83vh", objectFit: "cover" }}
          src={banner.src}
        />
      )}

      <section
        style={{ marginBottom: "50px" }}
        className="section-b-space ratio_asos bg-grey"
      >
        <div className="collection-wrapper">
          <Container>
            <div
              className="collection-gap"
              style={{ position: "relative", top: "-19px" }}
            >
              <Paragraph
                title="title1 "
                inner=""
                hrClass={false}
                titleData={subCategory ? subCategory == "new" ? "Our Top Shelf Pick" : subCategory.replaceAll("-", " ") : false}
              />

            </div>

            <Row className="margin-default">
              <CatogeryPopupSidebar
                product={product}

              />
            </Row>
          </Container>
        </div>
      </section>
      <MasterFooter
        footerClass={`footer-light`}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
        logoName={"logo.png"}
      />
    </>
  );
};

export default CategorySidebar_popup;
