import {Container } from "reactstrap";

const MasterBanner = ({ img}) => {
  return (
    <div>
      <div>
        <Container>
                  <img src={img.src} />
        </Container>
      </div>
    </div>
  );
};

export default MasterBanner;
