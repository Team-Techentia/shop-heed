import { Fragment, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Button } from "reactstrap";
import GeneralCouponForm from "./GeneralCouponForm";
import RestrictionForm from "./RestrictionCouponForm";
import UsageForm from "./UsageCouponForm";
import Api from "@/Components/Api";
import { PromocodeType } from "@/Types";
import { getCookie } from "@/Components/Cookies";
import { DEFAULT_PROMOCODE_FORM } from "@/Constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CouponTabs = () => {
  const [formData, setFormData] = useState<PromocodeType>(DEFAULT_PROMOCODE_FORM);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const token = getCookie();
  const router = useRouter();

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = [];

    // General validation
    if (!formData.name?.trim()) errors.push("Name is required");
    if (!formData.code?.trim()) errors.push("Code is required");
    if (!formData.discountType) errors.push("Discount type is required");
    if (!formData.discountValue || formData.discountValue <= 0) errors.push("Discount value must be greater than 0");

    // Date validation
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.push("End date must be after start date");
    }

    // Restriction validation
    if (formData.minimumSpend && formData.minimumSpend < 0) {
      errors.push("Minimum spend cannot be negative");
    }

    // Usage validation
    if (formData.perCustomer && formData.perCustomer <= 0) {
      errors.push("Per customer limit must be greater than 0");
    }
    if (formData.perLimit && formData.perLimit <= 0) {
      errors.push("Per limit must be greater than 0");
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        toast.error("Authentication required. Please login.");
        return;
      }

      const response = await Api.createPromocode(formData, token);

      if (response.data.success) {
        toast.success("Promocode created successfully!");
        router.push("/en/coupons/list-coupons")
        // Reset form
        setFormData(DEFAULT_PROMOCODE_FORM);
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating promocode:", error);
      toast.error("Error creating promocode: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <TabPanel>
          <div className="tab-pane fade active show">
            <GeneralCouponForm
              formData={formData}
              onChange={handleFormDataChange}
            />
            <RestrictionForm
              formData={formData}
              onChange={handleFormDataChange}
            />
            <UsageForm
              formData={formData}
              onChange={handleFormDataChange}
            />
          </div>
        </TabPanel>
      </Tabs>

      <div className="pull-right">
        <Button
          color="primary"
          onClick={handleSave}
          disabled={loading}
          style={{ minWidth: '100px' }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </Fragment>
  );
}

export default CouponTabs;