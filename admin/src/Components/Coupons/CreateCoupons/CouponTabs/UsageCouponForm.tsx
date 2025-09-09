import { PromocodeType } from "@/Types";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

interface FormProps {
  formData: PromocodeType;
  onChange: (x: string, y: any) => void;
}

const UsageForm = ({ formData, onChange }: FormProps) => {
  const handleInputChange = (field: string, value: string) => {
    // Allow empty string
    if (value === '') {
      onChange(field, null);
      return;
    }

    // Only allow numeric values
    if (!/^\d+$/.test(value)) {
      return; // Don't update if not a valid number
    }

    const numericValue = parseInt(value, 10);
    onChange(field, numericValue);
  };

  return (
    <div className="needs-validation">
      <style jsx>{`
        /* Hide number input spinners */
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>

      <h4>Usage Limits</h4>

      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Per Limit</Label>
          </Col>
          <Col md="7">
            <Input
              id="perLimit"
              type="number"
              className="no-spinner"
              value={formData.perLimit || ''}
              onChange={(e) => handleInputChange('perLimit', e.target.value)}
              min="1"
              placeholder="Leave empty for unlimited uses"
              onWheel={(e) => (e.target as HTMLInputElement).blur()} />
            <small className="text-muted">
              Maximum number of times this promocode can be used in total. Leave empty for unlimited uses.
            </small>
          </Col>
        </Row>
      </FormGroup>

      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Per Customer</Label>
          </Col>
          <Col md="7">
            <Input
              id="perCustomer"
              type="number"
              className="no-spinner"
              value={formData.perCustomer || ''}
              onChange={(e) => handleInputChange('perCustomer', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault();
                }
              }}
              min="1"
              placeholder="Leave empty for unlimited uses per customer"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
            />
            <small className="text-muted">
              Maximum number of times each customer can use this promocode. Leave empty for unlimited uses per customer.
            </small>
          </Col>
        </Row>
      </FormGroup>
    </div>
  );
};

export default UsageForm;