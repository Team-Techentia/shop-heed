import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import Api from "@/Components/Api";
import { ToastContainer, toast } from "react-toastify";
import { Fragment, useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Card, CardBody, Col, Container, Form, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { getCookie } from "@/Components/Cookies";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import jsPDF from 'jspdf';
import { useRouter } from "next/navigation";

interface OrderData {
  ["Order Id"]: string;
  SKU: string;
  Image: string;
  ["Payment Status"]: JSX.Element | string;
  ["Payment Method"]: JSX.Element;
  ["Order Status"]: any;
  Date: string;
  ["Total"]: any;
  Actions: any,
}

const SalesOrders = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderDataById, setOrderDataById] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [orderStatus, setOrderStatus] = useState('null');
  const [orderAction, setOrderAction] = useState("");
  const [selectedId, setSelectedId] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState<string>('null');
  const [invoiceGenerating, setInvoiceGenerating] = useState<string>('');
  const token = getCookie();
  const router = useRouter()

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchData('null', 'null');
  }, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };

  const openConfirmationModal = (id: string) => {
    setSelectedId(id);
    setConfirmDelete(true);
  };

  const onCloseConfirmationModal = () => setConfirmDelete(false);

  const handleDropdownOne = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    console.log('Payment Status changed to:', selectedStatus);
    setStatus(selectedStatus);
    fetchData(selectedStatus, orderStatus);
  };

  const handleDropdownOne1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrderStatus = e.target.value;
    console.log('Order Status changed to:', selectedOrderStatus);
    setOrderStatus(selectedOrderStatus)
    fetchData(status, selectedOrderStatus);
  };

  const handleDeleteOrder = async (id: any) => {
    try {
      await Api.deleteOrder(id, token);
      toast.success("Order successfully deleted");
      fetchData(status, orderStatus);
      return;
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  }

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDeleteOrder(selectedId);
      onCloseConfirmationModal();
    }
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Invoice Generation Logic
  const generateInvoice = async (orderId: string) => {
    try {
      setInvoiceGenerating(orderId);
      
      // Fetch order details for the invoice
      const res = await Api.getOrderByIdAdmin(orderId, token);
      const orderData = res.data.data;
      
      if (!orderData) {
        toast.error("Order data not found");
        return;
      }

      // Create new PDF document
      const doc = new jsPDF();
      
      // Add some styling
      doc.setFont("helvetica");
      
      // Company/Store Information Header
      doc.setFontSize(24);
      doc.setTextColor(51, 51, 51);
      doc.text('INVOICE', 20, 25);
      
      // Add a line under the title
      doc.setLineWidth(0.5);
      doc.line(20, 30, 190, 30);
      
      // Company Details
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Your Company Name', 20, 45);
      doc.text('123 Business Street', 20, 55);
      doc.text('Business City, State 12345', 20, 65);
      doc.text('Phone: +91 9876543210', 20, 75);
      doc.text('Email: sales@yourcompany.com', 20, 85);
      doc.text('GST: 07AAACH7409R1Z5', 20, 95);
      
      // Invoice Details (Right side)
      const invoiceNumber = orderData.paymentDetails?.orderId || orderData._id.slice(-8);
      const invoiceDate = new Date().toLocaleDateString('en-IN');
      const orderDate = formatDate(orderData.orderDate.slice(0, 10));
      
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(12);
      doc.text(`Invoice No: #${invoiceNumber}`, 140, 45);
      doc.text(`Invoice Date: ${invoiceDate}`, 140, 55);
      doc.text(`Order Date: ${orderDate}`, 140, 65);
      doc.text(`Payment Status: ${orderData.status}`, 140, 75);
      doc.text(`Order Status: ${orderData.orderStatus}`, 140, 85);
      
      // Customer Information
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Bill To:', 20, 115);
      
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const customer = orderData.customerDetails;
      doc.text(`${customer.first_name} ${customer.last_name}`, 20, 127);
      doc.text(`${customer.address}`, 20, 137);
      doc.text(`${customer.city}, ${customer.state}`, 20, 147);
      doc.text(`${customer.country} - ${customer.pincode}`, 20, 157);
      doc.text(`Phone: ${customer.phone}`, 20, 167);
      doc.text(`Email: ${customer.email}`, 20, 177);
      
      // Table Headers Background
      doc.setFillColor(245, 245, 245);
      doc.rect(20, 190, 170, 12, 'F');
      
      // Table Headers
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      doc.setFont("helvetica", "bold");
      doc.text('Product', 25, 198);
      doc.text('SKU', 80, 198);
      doc.text('Size', 110, 198);
      doc.text('Qty', 130, 198);
      doc.text('Price (₹)', 145, 198);
      doc.text('Total (₹)', 170, 198);
      
      // Product Details
      let yPosition = 210;
      const product = orderData.product;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      
      // Truncate product title if too long
      const productTitle = product?.title || 'N/A';
      const truncatedTitle = productTitle.length > 20 ? productTitle.substring(0, 20) + '...' : productTitle;
      
      doc.text(truncatedTitle, 25, yPosition);
      doc.text(product?.sku || 'No SKU', 80, yPosition);
      doc.text((product?.size || 'N/A').toString().toUpperCase(), 110, yPosition);
      doc.text(orderData.totalQuantity.toString(), 135, yPosition);
      doc.text((product?.finalPrice || 0).toString(), 150, yPosition);
      doc.text(orderData.totalAmount.toString(), 175, yPosition);
      
      // Add line after product
      yPosition += 10;
      doc.setLineWidth(0.2);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, 190, yPosition);
      
      // Summary Section
      yPosition += 20;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      
      // Calculate values (you can modify these based on your business logic)
      const subtotal = orderData.totalAmount;
      const taxRate = 0; // Set tax rate as needed
      const taxAmount = Math.round(subtotal * taxRate);
      const shippingCharges = 0; // Set shipping charges as needed
      const totalAmount = subtotal + taxAmount + shippingCharges;
      
      doc.text('Subtotal:', 130, yPosition);
      doc.text(`₹ ${subtotal}`, 170, yPosition);
      
      yPosition += 12;
      doc.text(`Tax (${taxRate * 100}%):`, 130, yPosition);
      doc.text(`₹ ${taxAmount}`, 170, yPosition);
      
      yPosition += 12;
      doc.text('Shipping:', 130, yPosition);
      doc.text(`₹ ${shippingCharges}`, 170, yPosition);
      
      // Total Amount with background
      yPosition += 15;
      doc.setFillColor(51, 51, 51);
      doc.rect(125, yPosition - 8, 65, 15, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text('Total Amount:', 130, yPosition);
      doc.text(`₹ ${totalAmount}`, 170, yPosition);
      
      // Payment Information
      yPosition += 25;
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);
      doc.setFont("helvetica", "bold");
      doc.text('Payment Information:', 20, yPosition);
      
      yPosition += 12;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(`Payment Method: ${orderData.paymentMethod || 'N/A'}`, 20, yPosition);
      
      if (orderData.paymentDetails?.paymentId) {
        yPosition += 10;
        doc.text(`Payment ID: ${orderData.paymentDetails.paymentId}`, 20, yPosition);
      }
      
      if (orderData.paymentDetails?.razorpayOrderId) {
        yPosition += 10;
        doc.text(`Razorpay Order ID: ${orderData.paymentDetails.razorpayOrderId}`, 20, yPosition);
      }
      
      // Notes section
      yPosition += 20;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Notes:', 20, yPosition);
      yPosition += 8;
      doc.text('• This is a computer-generated invoice and does not require a signature.', 20, yPosition);
      yPosition += 6;
      doc.text('• Please retain this invoice for your records.', 20, yPosition);
      yPosition += 6;
      doc.text('• For any queries regarding this invoice, please contact our support team.', 20, yPosition);
      
      // Footer
      yPosition += 20;
      doc.setLineWidth(0.5);
      doc.setDrawColor(51, 51, 51);
      doc.line(20, yPosition, 190, yPosition);
      
      yPosition += 12;
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      doc.setFont("helvetica", "bold");
      doc.text('Thank you for your business!', 20, yPosition);
      
      yPosition += 8;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text('For support: support@yourcompany.com | +91 9876543210', 20, yPosition);
      
      // Save the PDF with a meaningful filename
      const customerName = `${customer.first_name}_${customer.last_name}`.replace(/\s+/g, '_');
      const fileName = `Invoice_${invoiceNumber}_${customerName}_${new Date().getTime()}.pdf`;
      
      doc.save(fileName);
      
      toast.success("Invoice generated and downloaded successfully!");
      
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setInvoiceGenerating('');
    }
  };

  const fetchData = async (selectedStatus: string, selectedOrderStatus: string) => {
    setLoading(true);
    const storeData: OrderData[] = [];
    try {
      console.log('Calling API with:', { selectedStatus, selectedOrderStatus, token: !!token });
      
      const res = await Api.getOrdersByAdmin(token, selectedStatus, selectedOrderStatus);
      console.log('API Response:', res.data);
      
      if (!res.data || !res.data.data || !Array.isArray(res.data.data)) {
        console.log('No data found in response:', res.data);
        setData([]);
        return;
      }

      const createPromise = res.data.data.map(async (item: any) => {
        if (!item.product) {
          console.log('Skipping item with null product:', item._id);
          return null;
        }

        const orderId:string = "shopheed_001";

        const newObject: OrderData = {
          Image: item.product.image && item.product.image.length > 0 ? item.product.image[0] : '',
          ["Order Id"]: orderId,
          SKU: item.product.sku || "No",
          ["Payment Status"]: item.status === "pending" ? (
            <Badge className="capitalized" color="secondary">{item.status}</Badge>
          ) : item.status === "paid" ? (
            <Badge color="success">Paid</Badge>
          ) : (
            <div className="capitalized">{item.status}</div>
          ),
          ["Payment Method"]: item.paymentMethod?.replaceAll(" ", "") === "cod" ? (
            <Badge color="secondary">Cash On Delivery</Badge>
          ) : (
            <Badge className="capitalized" color="success">{item.paymentMethod || 'N/A'}</Badge>
          ),
          ["Order Status"]: <div className="capitalized">{item.orderStatus}</div>,
          Date: formatDate(item.orderDate.slice(0, 10)),
          ["Total"]: <div>₹ {item.totalAmount}</div>,
          Actions: item._id,
        };

        return newObject;
      });

      const results = await Promise.all(createPromise);
      const filteredResults = results.filter(item => item !== null);
      
      console.log('Processed data:', filteredResults);
      setData(filteredResults);
      
    } catch (error) {
      console.error('API Error:', error);
      if (error && error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === "Order not found") {
          setData([]);
          return;
        }
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: any, newStatus: any) => {
    try {
      await Api.updateOrderStatus({ id: orderId, status: newStatus }, token);
      toast.success("Order status updated successfully!");
      fetchData(status, orderStatus);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status!");
    }
  };

  const openPopUp = async (Id: any) => {
    setOpen(true);
    try {
      const res = await Api.getOrderByIdAdmin(Id, token);
      const customerDetails = res.data.data.customerDetails;
      setOrderDataById(res.data.data);
      setValue("first_name", customerDetails.first_name);
      setValue("last_name", customerDetails.last_name);
      setValue("phone", customerDetails.phone);
      setValue("email", customerDetails.email);
      setValue("address", customerDetails.address);
      setValue("pincode", customerDetails.pincode);
      setValue("orderStatus", res.data.data.orderStatus);
      setValue("weight", res.data.data.weight * 1000 || "");
      setValue("length", res.data.data.length || "");
      setValue("height", res.data.data.height || "");
      setValue("breadth", res.data.data.breadth || "");
      setOrderStatus(res.data.data.orderStatus)
      
      const country = Country.getAllCountries().find(country => country.name === customerDetails.country);
      const state = State.getStatesOfCountry(country?.isoCode ?? '').find(state => state.name === customerDetails.state);
      const city = City.getCitiesOfState(state?.countryCode ?? '', state?.isoCode ?? '').find(city => city.name === customerDetails.city);

      setSelectedCountry(country ?? null);
      setSelectedState(state ?? null);
      setSelectedCity(city ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: any) => {
    const updatedData = {
      ...data,
      country: selectedCountry?.name,
      state: selectedState?.name,
      city: selectedCity?.name,
      title: orderDataById.product.title, 
      finalPrice: orderDataById.product.finalPrice,
      totalQuantity: orderDataById.totalQuantity, 
      totalAmount: orderDataById.totalAmount,
      paymentMethod: orderDataById.paymentMethod, 
      orderId: orderDataById.paymentDetails && orderDataById.paymentDetails.orderId || orderDataById._id
    };
    console.log(updatedData)

    try {
      await Api.updateOrder(orderDataById._id, updatedData, token);
      onCloseModal();
      fetchData(status, orderStatus);
      setOrderStatus('null')
    } catch (error) {
      console.error("Failed to update order data", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="mt-2">Loading orders...</div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-4">
          <div className="alert alert-info">
            <h5>No Orders Found</h5>
            <p>There are currently no orders matching the selected criteria.</p>
          </div>
        </div>
      );
    }

    return (
      <Datatable
        handleStatusChange={handleStatusChange}
        typeUse={"manaegOrder"}
        myData={data}
        pageSize={30}
        pagination={true}
        openPopUp={openPopUp}
        handleDelete={openConfirmationModal}
        generateInvoice={generateInvoice}
        invoiceGenerating={invoiceGenerating}
        class="-striped -highlight"
      />
    );
  };

  return (
    <Fragment>
      <CommonBreadcrumb title="Orders" parent="Sales" />

      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              {
                orderDataById !== null ? <ButtonGroup className=" pull-right order-model">
                  <Modal isOpen={open} toggle={onCloseModal} className="model-model">
                    <ModalHeader toggle={onCloseModal}>
                      <h5 className="modal-title f-w-600" id="exampleModalLabel2">Order Details</h5>
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="">
                          <Col lg="6" sm="12" xs="12">
                            <h3>Product Details</h3>
                            <div className="form-group col-md-12 col-sm-12 col-xs-12">
                              <h5> <strong>Title</strong> </h5>
                              <div className="field-label"> {orderDataById.product?.title || 'N/A'} </div>
                              <h5> <strong>Size</strong> </h5>
                              <div style={{textTransform:"uppercase"}}  className="field-label"> {orderDataById.product?.size || 'N/A'} </div>
                              <h5> <strong>SKU</strong> </h5>
                              <div className="field-label"> {orderDataById.product?.sku || "No"} </div>
                              <h5> <strong> Product Id </strong></h5>
                              <div className="field-label"> {orderDataById.product?.productId || 'N/A'} </div>
                              <h5>  <strong>Variants Id</strong> </h5>
                              <div className="field-label"> {orderDataById.product?._id || 'N/A'} </div>

                              {orderDataById.product?.image && orderDataById.product.image.length > 0 && (
                                <div className="field-label"> 
                                  <img style={{ height: "150px" }} src={orderDataById.product.image[0]} alt="" />
                                </div>
                              )}

                              <Row style={{ gap: " 13px 0px" }}>
                                <Col lg="4" md="4" sm="2">
                                  <h5>Price </h5>
                                  <div className="field-label"> ₹ {orderDataById.product?.finalPrice || 0} </div>
                                </Col>

                                <Col lg="4" md="4" sm="6">
                                  <h5>Quantity </h5>
                                  <div className="field-label">  {orderDataById.totalQuantity} </div>
                                </Col>
                                <Col lg="4" md="4" sm="6">
                                  <h5>Total Amount </h5>
                                  <div className="field-label"> ₹ {orderDataById.totalAmount} </div>
                                </Col>
                                <Col lg="4" md="4" sm="6">
                                  <h5>Payment Method </h5>
                                  <div className="field-label  text-capital ">{orderDataById.paymentMethod || 'N/A'}</div>
                                </Col>

                                <Col lg="4" md="4" sm="6">
                                  <h5>Order Status </h5>
                                  <div className="field-label text-capital  ">  {orderDataById.orderStatus} </div>
                                </Col>
                                <Col lg="4" md="4" sm="6">
                                  <h5>Order Date </h5>
                                  <div className="field-label" >   {formatDate(orderDataById.orderDate.slice(0, 10))} </div>
                                </Col>
                                {
                                  orderDataById.paymentDetails && orderDataById.paymentDetails.orderId && <Col lg="4" md="4" sm="6">
                                    <h5>Order Id </h5>
                                    <div className="field-label">  {orderDataById.paymentDetails.orderId} </div>
                                  </Col>
                                }

                                {
                                  orderDataById.paymentDetails && orderDataById.paymentDetails.paymentStatus && <Col lg="4" md="4" sm="6">
                                    <h5>Payment Status </h5>
                                    <div className="field-label">  {orderDataById.paymentDetails.paymentStatus} </div>
                                  </Col>
                                }

                                {
                                  orderDataById.paymentDetails && orderDataById.paymentDetails.paymentId && <Col lg="4" md="4" sm="6">
                                    <h5>Payment Id </h5>
                                    <div className="field-label">  {orderDataById.paymentDetails.paymentId} </div>
                                  </Col>
                                }
                              </Row>
                            </div>
                          </Col>
                          <Col lg="6" sm="12" xs="12">
                            <h3>Address Details</h3>
                            <div className="row check-out">
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">First Name</div>
                                <input disabled type="text" className={`${errors.first_name ? "error_border" : ""} input-input`}  {...register("first_name", { required: true })} />
                                <span className="error-message">{errors.first_name && "First name is required"}</span>
                              </div>
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">Last Name</div>
                                <input disabled type="text" className={`${errors.last_name ? "error_border" : ""} input-input`}  {...register("last_name", { required: true })} />
                                <span className="error-message">{errors.last_name && "Last name is required"}</span>
                              </div>
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">Phone</div>
                                <input disabled type="text" className={`${errors.phone ? "error_border" : ""} input-input`} {...register("phone", { pattern: /\d+/ })} />
                                <span className="error-message">{errors.phone && "Please enter a valid phone number."}</span>
                              </div>
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">Email Address</div>
                                <input disabled className={`${errors.email ? "error_border" : ""} input-input`} type="text"  {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
                                <span className="error-message">{errors.email && "Please enter a proper email address."}</span>
                              </div>
                              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                <div className="field-label">Country</div>
                                <Select
                                  options={Country.getAllCountries()}
                                  getOptionLabel={(options) => options["name"]}
                                  getOptionValue={(options) => options["name"]}
                                  value={selectedCountry}
                                  isDisabled={true}
                                />
                              </div>
                              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                <div className="field-label">State</div>
                                <Select
                                  options={selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []}
                                  getOptionLabel={(options) => options["name"]}
                                  getOptionValue={(options) => options["name"]}
                                  value={selectedState}
                                  isDisabled={true}
                                />
                              </div>
                              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                <div className="field-label">City</div>
                                <Select
                                  options={selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []}
                                  getOptionLabel={(options) => options["name"]}
                                  getOptionValue={(options) => options["name"]}
                                  value={selectedCity}
                                  isDisabled={true}
                                />
                              </div>
                              <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                <div className="field-label">Postal Code</div>
                                <input disabled type="text" className={`${errors.pincode ? "error_border" : ""} input-input`} {...register("pincode", { pattern: /\d+/ })} />
                                <span className="error-message">{errors.pincode && "Required integer"}</span>
                              </div>
                              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                <div className="field-label">Address</div>
                                <input disabled className={`${errors.address ? "error_border" : ""} input-input`} type="text"  {...register("address", { required: true, })} placeholder="Street address" />
                                <span className="error-message">{errors.address && "Please write your address."}</span>
                              </div>
                              <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                <div className="field-label">Order Status</div>
                                <select className="input-input"   {...register("orderStatus", { required: true })} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                  <option value="new-order">New Order</option>
                                  <option value="pending-payment">Pending Payment</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipping">Shipping</option>
                                  <option value="on-hold">On Hold</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                  <option value="refunded">Refunded</option>
                                  <option value="failed">Failed</option>
                                  <option value="draft">Draft</option>
                                </select>
                                <span className="error-message">{errors.orderStatus && "Order status is required"}</span>

                                {orderStatus === 'shipping' && (
                                  <>
                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                      <div className="field-label">Weight in gram</div>
                                      <input
                                        type="number"
                                        className={`${errors.weight ? "error_border" : ""} input-input`}
                                        {...register("weight", { required: true })}
                                      />
                                      <span className="error-message">
                                        {errors.weight && "Weight is required"}
                                      </span>
                                    </div>
                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                      <div className="field-label">Length in cm</div>
                                      <input
                                        type="number"
                                        className={`${errors.length ? "error_border" : ""} input-input`}
                                        {...register("length", { required: true })}
                                      />
                                      <span className="error-message">
                                        {errors.length && "Length is required"}
                                      </span>
                                    </div>

                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                      <div className="field-label">Height in cm</div>
                                      <input
                                        type="number"
                                        className={`${errors.height ? "error_border" : ""} input-input`}
                                        {...register("height", { required: true })}
                                      />
                                      <span className="error-message">
                                        {errors.height && "Height is required"}
                                      </span>
                                    </div>
                                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                      <div className="field-label">Breadth in cm</div>
                                      <input
                                        type="number"
                                        className={`${errors.breadth ? "error_border" : ""} input-input`}
                                        {...register("breadth", { required: true })}
                                      />
                                      <span className="error-message">
                                        {errors.breadth && "Breadth is required"}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <ModalFooter>
                          <Button color="secondary" type="submit">Save</Button>
                          {/* Generate Invoice Button in Modal */}
                          <Button 
                            color="info" 
                            type="button" 
                            onClick={() => generateInvoice(orderDataById._id)}
                            disabled={invoiceGenerating === orderDataById._id}
                            className="me-2"
                          >
                            {invoiceGenerating === orderDataById._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Generating Invoice...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-file-pdf-o me-2"></i>
                                Generate Invoice
                              </>
                            )}
                          </Button>
                          <Button color="primary" onClick={onCloseModal}>Close</Button>
                        </ModalFooter>
                      </Form>
                    </ModalBody>
                  </Modal>
                </ButtonGroup> : ""
              }
              
              {/* Delete Confirmation Modal */}
              <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                <ModalHeader toggle={onCloseConfirmationModal}>
                  <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                </ModalHeader>
                <ModalBody>
                  Are you sure you want to delete this Order?
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={handleConfirmDelete}>Yes, Delete</Button>
                  <Button color="secondary" onClick={onCloseConfirmationModal}>Cancel</Button>
                </ModalFooter>
              </Modal>

              <CommonCardHeader title="Manage Order" />

              <CardBody className="order-datatable">
                <Row>
                  <Col className="mb-2" sm="6" md="3" lg="3">
                    <label>Payment Status</label>
                    <Input
                      className="mt-2"
                      type="select"
                      name="status"
                      id="statusSelect"
                      value={status}
                      onChange={(e: any) => {
                        handleDropdownOne(e)
                      }}
                    >
                      <option value="null">All</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </Input>
                  </Col>

                  <Col className="mb-2" sm="6" md="3" lg="3">
                    <label>Order Status</label>
                    <Input
                      className="mt-2"
                      type="select"
                      name="orderStatus"
                      id="orderStatusSelect"
                      value={orderStatus}
                      onChange={(e: any) => {
                        handleDropdownOne1(e)
                      }}
                    >
                      <option value="null">All</option>
                      <option value="new-order">New Order</option>
                      <option value="pending-payment">Pending Payment</option>
                      <option value="processing">Processing</option>
                      <option value="shipping">Shipping</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                      <option value="draft">Draft</option>
                    </Input>
                  </Col>
                  
                  <Col className="mb-2" sm="6" md="3" lg="3">
                    <label>&nbsp;</label>
                    <div className="mt-2">
                      <Button 
                        color="success" 
                        onClick={() => fetchData(status, orderStatus)}
                        className="me-2"
                      >
                        <i className="fa fa-refresh me-2"></i>
                        Refresh
                      </Button>
                      <Button 
                        color="primary" 
                        onClick={() => {
                          setStatus('null');
                          setOrderStatus('null');
                          fetchData('null', 'null');
                        }}
                      >
                        <i className="fa fa-filter me-2"></i>
                        Clear Filters
                      </Button>
                    </div>
                  </Col>
                </Row>

                {/* Order Data Table */}
                {renderContent()}
                
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Fragment>
  );
};

export default SalesOrders;