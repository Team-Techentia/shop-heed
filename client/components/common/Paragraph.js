import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "reactstrap";

const Paragraph = ({
  title,
  inner,
  line,
  hrClass,
  titleData,
  titleDisData,
  headingStyle,
  fontsize,
}) => {
  const titleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);
  return (
    <>
      <div className={title}>
        <h2
          ref={titleRef}
          style={{
            fontSize: fontsize || "28px",   // 👈 yahan control
            ...headingStyle                // 👈 agar extra styles pass ho
          }}
          className={`title-inner1 ${isVisible ? "visible" : ""} ${inner}`}
        >
          {titleData}
        </h2>

        {line ? (
          <div className="line"></div>
        ) : hrClass ? (
          <hr role="tournament6"></hr>
        ) : (
          ""
        )}
      </div>

      {titleDisData && (
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <div className="product-para">
                <p className="text-center ">{titleDisData}</p>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Paragraph;
