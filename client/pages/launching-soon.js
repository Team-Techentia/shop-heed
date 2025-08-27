import { Button, Container, Row } from 'reactstrap';
import CommonLayout from '../components/shop/common-layout';

const LanuchingSoonPage = () => {
  const buttonStyle = {
    background: "#010101",
    color: "#FFFFFF",
    fontWeight: 400,
    border: "1px solid black",
    padding: "10px 20px",
    width: "80%",
    maxWidth: "300px",
    fontSize: "16px",
    borderRadius: "10px"
  };

  return (
    <CommonLayout parent="Home" title="Launching Soon Page">
      <section
        className="section-b-space blog-page ratio2_3"
        style={{ padding: 0, margin: 0, position: "relative", paddingBottom: "50px" }}
      >
        <Container fluid>
          <Row style={{ margin: "0 auto", position: "relative" }}>
            <img
              src="assets/images/launching_soon.jpg"
              alt="Launching Soon"
              style={{ width: "100%", height: "auto" }}
            />
            <div
              style={{
                position: "absolute",
                top: "77%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Button style={buttonStyle}>BE THE FIRST TO KNOW</Button>
            </div>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .footer-spacing {
          margin-top: 50px;
        }

        @media (max-width: 768px) {
          .footer-spacing {
            margin-top: 30px;
          }
          .position-launching-button button {
            font-size: 14px;
            width: 90%;
          }
        }

        @media (min-width: 769px) and (max-width: 1200px) {
          .footer-spacing {
            margin-top: 40px;
          }
          .position-launching-button button {
            width: 60%;
          }
        }
      `}</style>
    </CommonLayout>
  );
};

export default LanuchingSoonPage;
