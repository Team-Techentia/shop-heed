import { PromocodeType } from "@/Types";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormProps {
  formData: PromocodeType;
  onChange: (x: string, y: any) => void;
}

const GeneralCouponForm = ({ formData, onChange }: FormProps) => {
  const handleInputChange = (field: string, value: any) => {
    onChange(field, value);
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    onChange(field, checked);
  };

  const handleSelectChange = (field: string, value: any) => {
    onChange(field, value);
  };

  const handleStartDate = (date: Date | null) => {
    onChange("startDate", date ? date.toISOString() : null);
  };

  const handleEndDate = (date: Date | null) => {
    onChange("endDate", date ? date.toISOString() : null);
  };
  
  return (
    <div className="needs-validation">
      <h4>General</h4>
      <Row>
        <Col sm="12">
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>* Name</Label>
              </Col>
              <Col md="7">
                <Input
                  id="promocodeName"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange("name", e.target.value || null)}
                  placeholder="Enter promocode name"
                  required
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>* Code</Label>
              </Col>
              <Col md="7">
                <Input
                  id="promocodeCode"
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) =>
                    handleInputChange("code", e.target.value ? e.target.value.toUpperCase() : null)
                  }
                  placeholder="Enter promocode (e.g., SAVE20)"
                  required
                />
              </Col>
              <div className="valid-feedback">
                Please Provide a Valid Coupon Code.
              </div>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Start Date</Label>
              </Col>
              <Col md="7">
                <DatePicker
                  selected={
                    formData.startDate ? new Date(formData.startDate) : null
                  }
                  onChange={handleStartDate}
                  dateFormat="MMM dd, yyyy"
                  minDate={new Date()}
                  className="form-control"
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>End Date</Label>
              </Col>
              <Col md="7">
                <DatePicker
                  selected={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={handleEndDate}
                  dateFormat="MMM dd, yyyy"
                  minDate={
                    formData.startDate ? new Date(formData.startDate) : new Date()
                  }
                  className="form-control"
                />
              </Col>
            </Row>
          </FormGroup>
          
          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Free Shipping</Label>
              </Col>
              <Col md="7">
                <Label className="d-block">
                  <Input
                    className="checkbox_animated"
                    id="freeShipping"
                    type="checkbox"
                    checked={formData.freeShipping || false}
                    onChange={(e) => handleCheckboxChange('freeShipping', e.target.checked)}
                  />
                  Allow Free Shipping
                </Label>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>* Discount Type</Label>
              </Col>
              <Col md="7">
                <select
                  className="form-select"
                  value={formData.discountType || ''}
                  onChange={(e) => handleSelectChange('discountType', e.target.value || null)}
                  required
                >
                  <option value="">--Select--</option>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>* Discount Value</Label>
              </Col>
              <Col md="7">
                <Input
                  type="number"
                  value={formData.discountValue || ''}
                  onChange={(e) => handleInputChange('discountValue', e.target.value ? parseFloat(e.target.value) : null)}
                  min="0"
                  step={formData.discountType === 'percent' ? "1" : "0.01"}
                  max={formData.discountType === 'percent' ? "100" : undefined}
                  placeholder={formData.discountType === 'percent' ? "Enter percentage (e.g., 20)" : "Enter amount (e.g., 10.00)"}
                  required
                />
                {formData.discountType === 'percent' && (
                  <small className="text-muted">Enter percentage value (0-100)</small>
                )}
                {formData.discountType === 'fixed' && (
                  <small className="text-muted">Enter fixed discount amount</small>
                )}
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col xl="3" md="4">
                <Label>Status</Label>
              </Col>
              <Col md="7">
                <Label className="d-block">
                  <Input
                    className="checkbox_animated"
                    id="promocodeStatus"
                    type="checkbox"
                    checked={formData.status || false}
                    onChange={(e) => handleCheckboxChange('status', e.target.checked)}
                  />
                  Enable the Promocode
                </Label>
              </Col>
            </Row>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralCouponForm;