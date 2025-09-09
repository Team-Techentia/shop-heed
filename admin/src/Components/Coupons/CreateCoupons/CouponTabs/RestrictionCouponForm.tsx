import Api from "@/Components/Api";
import { PromocodeType } from "@/Types";
import { useState, useEffect } from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

interface FromProps {
  formData: PromocodeType;
  onChange: (x: string, y: any) => void;
}

const RestrictionForm = ({ formData, onChange }: FromProps) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await Api.getCategory();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field: string, value: number | null) => {
    onChange(field, value);
  };

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    let updatedCategories = [...(formData.categories || [])];
    if (checked) {
      if (!updatedCategories.includes(categoryValue)) {
        updatedCategories.push(categoryValue);
      }
    } else {
      updatedCategories = updatedCategories.filter(cat => cat !== categoryValue);
    }
    onChange('categories', updatedCategories.length > 0 ? updatedCategories : null);
  };

  return (
    <div className="needs-validation">
      <h4>Restriction</h4>

      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Categories</Label>
          </Col>
          <Col md="7">
            {loadingCategories ? (
              <div>Loading categories...</div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                {categories.length === 0 ? (
                  <div className="text-muted">No categories found</div>
                ) : (
                  categories.map((category: any) => (
                    <Label key={category._id} className="d-block mb-2">
                      <Input
                        type="checkbox"
                        checked={formData.categories?.includes(category.value || category.category) || false}
                        onChange={(e) =>
                          handleCategoryChange(category.value || category.category, e.target.checked)
                        }
                        className="me-2"
                      />
                      {category.category || category.value}
                    </Label>
                  ))
                )}
              </div>
            )}
            <small className="text-muted">
              Leave empty to apply to all categories. Select specific categories to restrict the promocode.
            </small>
          </Col>
        </Row>
      </FormGroup>

      <FormGroup>
        <Row>
          <Col xl="3" md="4">
            <Label>Minimum Spend</Label>
          </Col>
          <Col md="7">
            <Input
              id="minimumSpend"
              type="number"
              value={formData.minimumSpend || ''}
              onChange={(e) => handleInputChange('minimumSpend', e.target.value ? parseFloat(e.target.value) : null)}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <small className="text-muted">
              Minimum cart total required to use this promocode. Leave empty for no minimum.
            </small>
          </Col>
        </Row>
      </FormGroup>
    </div>
  );
};

export default RestrictionForm;