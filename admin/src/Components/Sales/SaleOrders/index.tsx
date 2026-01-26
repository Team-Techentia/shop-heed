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
  ["Order Date"]: string;
  ["Name"]: JSX.Element | string;
  ["SKU"]: string;
  ["Amount"]: JSX.Element | number;
  ["Payment Status"]: JSX.Element | string;
  ["Order Status"]: JSX.Element | string;
  Actions: string;
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
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState<string>('null');
  const [invoiceGenerating, setInvoiceGenerating] = useState<string>('');

  const token = getCookie();
  const router = useRouter();

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchData('null', 'null');
  }, []);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
  };

  const handleDropdownOne = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    console.log('Payment Status changed to:', selectedStatus);
    setStatus(selectedStatus);
    fetchData(selectedStatus, orderStatus);
  };

  const handleDropdownOne1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrderStatus = e.target.value;
    console.log('Order Status changed to:', selectedOrderStatus);
    setOrderStatus(selectedOrderStatus);
    fetchData(status, selectedOrderStatus);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getNextInvoiceNumber = (): string => {
    try {
      const currentYear = new Date().getFullYear();
      const storageKey = `lastInvoiceNumber_${currentYear}`;

      const lastNumber = parseInt(localStorage.getItem(storageKey) ?? '0', 10);
      const nextNumber = lastNumber + 1;

      const invoiceNumber = `${currentYear}SH${String(nextNumber).padStart(4, '0')}`;
      localStorage.setItem(storageKey, nextNumber.toString());

      return invoiceNumber;
    } catch (error) {
      console.error("Error generating invoice number:", error);
      const currentYear = new Date().getFullYear();
      return `${currentYear}SH0001`;
    }
  };

  const generateInvoice = async (orderId: string) => {
    try {
      if (orderDataById?.orderStatus?.toLowerCase() !== 'confirmed' && orderDataById?.orderStatus?.toLowerCase() !== 'processed') {
        toast.error("Invoice can only be generated for orders with 'Confirmed' status!");
        return;
      }

      setInvoiceGenerating(orderId);

      const res = await Api.getOrderByIdAdmin(orderId, token);
      const orderData = res.data.data;

      if (!orderData) {
        toast.error("Order data not found");
        return;
      }

      const doc = new jsPDF();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text('Tax Invoice', 20, 20);

      doc.setLineWidth(0.3);
      doc.line(20, 24, 190, 24);

      const invoiceNumber = await getNextInvoiceNumber();
      const packetId = `PACID${orderData.orderId.slice(-6)}`;
      const orderNumber = orderData.orderId;
      const invoiceDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const orderDate = formatDate(orderData.createdAt);

      const customer = orderData.customerDetails;
      const isDelhi = customer.state.toLowerCase() === 'delhi';

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text('GSTIN Number: 07BGUPB9136M1ZR', 110, 35);
      doc.text(`Invoice Number: ${invoiceNumber}`, 110, 41);
      doc.text(`Order Id: ${orderNumber}`, 110, 53);
      doc.text(`Invoice Date: ${invoiceDate}`, 110, 59);
      doc.text(`Order Date: ${orderDate}`, 110, 65);
      doc.text(`Nature of Transaction: ${isDelhi ? 'Intra-State' : 'Inter-State'}`, 110, 71);

      doc.text(`Place of Supply: ${customer.state}`, 110, 77);
      doc.text(`Nature of Supply: Goods`, 110, 83);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text('Bill From:', 20, 35);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text('BRANDS.IN', 20, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text('A-39, West Patel Nagar, New Delhi-110008', 20, 48);
      doc.text('New delhi, delhi-110008', 20, 54);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text('Ship From:', 20, 65);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text('BRANDS.IN', 20, 72);
      doc.text('A-39, West Patel Nagar, New Delhi-110008', 20, 78);
      doc.text('New delhi, delhi-110008', 20, 84);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text('Bill To / Ship To:', 20, 95);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${customer.first_name} ${customer.last_name}`, 20, 102);

      const addressText = `${customer.address}`;
      const addressLines = doc.splitTextToSize(addressText, 80);
      let addressY = 108;
      addressLines.forEach((line: string) => {
        doc.text(line, 20, addressY);
        addressY += 5;
      });

      doc.text(`${customer.city}, ${customer.state}`, 20, addressY);
      addressY += 6;
      doc.text(`${customer.country} - ${customer.pincode}`, 20, addressY);
      addressY += 6;
      doc.setFontSize(9);

      let yPos = 142;
      doc.setFillColor(245, 245, 245);
      doc.rect(10, yPos - 6, 190, 9, 'F');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(0, 0, 0);

      doc.text('Qty', 12, yPos);
      doc.text('Gross', 50, yPos);
      doc.text('Taxable', 87, yPos);
      doc.text('CGST', 110, yPos);
      doc.text('SGST/', 130, yPos);
      doc.text('IGST', 150, yPos);
      doc.text('Total Amount', 175, yPos);

      doc.setFontSize(6.5);
      doc.text('Amount', 50, yPos + 3);
      doc.text('Amount', 87, yPos + 3);
      doc.text('UGST', 130, yPos + 3);

      yPos += 12;

      let totalGross = 0;
      let totalTaxable = 0;
      let totalCGST = 0;
      let totalSGST = 0;
      let totalIGST = 0;
      let grandTotal = 0;

      if (orderData.items && orderData.items.length > 0) {
        orderData.items.forEach((item: any, index: number) => {
          const productTitle = item.title || 'Product';
          const truncatedTitle = productTitle.length > 65 ? productTitle.substring(0, 65) + '...' : productTitle;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text(truncatedTitle, 12, yPos);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.text(`(${(item.size || 'N/A').toString().toUpperCase()}) - SKU: ${item.sku || 'N/A'}`, 12, yPos + 4);

          yPos += 9;

          const grossAmount = item.totalPrice || item.finalPrice || 0;

          let taxableAmount = 0;
          let cgst = 0;
          let sgst = 0;
          let igst = 0;

          if (isDelhi) {
            if (grossAmount <= 2500) {
              taxableAmount = Number(((grossAmount * 100) / 105).toFixed(2));
              const totalGst = Number((grossAmount - taxableAmount).toFixed(2));
              cgst = Number((totalGst / 2).toFixed(2));
              sgst = Number((totalGst / 2).toFixed(2));
              igst = 0;
            } else {
              taxableAmount = Number(((grossAmount * 100) / 112).toFixed(2));
              const totalGst = Number((grossAmount - taxableAmount).toFixed(2));
              cgst = Number((totalGst / 2).toFixed(2));
              sgst = Number((totalGst / 2).toFixed(2));
              igst = 0;
            }
          } else {
            if (grossAmount <= 2500) {
              taxableAmount = Number(((grossAmount * 100) / 105).toFixed(2));
              igst = Number((grossAmount - taxableAmount).toFixed(2));
              cgst = 0;
              sgst = 0;
            } else {
              taxableAmount = Number(((grossAmount * 100) / 112).toFixed(2));
              igst = Number((grossAmount - taxableAmount).toFixed(2));
              cgst = 0;
              sgst = 0;
            }
          }

          totalGross += grossAmount;
          totalTaxable += taxableAmount;
          totalCGST += cgst;
          totalSGST += sgst;
          totalIGST += igst;
          grandTotal += grossAmount;

          doc.setFontSize(8);
          doc.text(item.quantity.toString(), 13, yPos);
          doc.text(`Rs ${grossAmount}`, 50, yPos);
          doc.text(`Rs ${taxableAmount}`, 87, yPos);
          doc.text(cgst > 0 ? `Rs ${cgst}` : '', 113, yPos);
          doc.text(sgst > 0 ? `Rs ${sgst}` : '', 133, yPos);
          doc.text(igst > 0 ? `Rs ${igst}` : '', 150, yPos);
          doc.text(`Rs ${grossAmount}`, 177, yPos);

          yPos += 8;
        });
      }

      doc.setLineWidth(0.3);
      doc.line(10, yPos, 200, yPos);

      yPos += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text('TOTAL', 12, yPos);
      doc.text(`Rs ${totalGross}`, 50, yPos);
      doc.text(`Rs ${totalTaxable}`, 87, yPos);
      if (totalCGST > 0) doc.text(`Rs ${totalCGST}`, 113, yPos);
      if (totalSGST > 0) doc.text(`Rs ${totalSGST}`, 133, yPos);
      if (totalIGST > 0) doc.text(`Rs ${totalIGST}`, 150, yPos);
      doc.text(`Rs ${grandTotal}`, 177, yPos);

      yPos += 4;
      doc.line(10, yPos, 200, yPos);

      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text('BRANDS.IN', 20, yPos);

      yPos += 25;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text('DECLARATION', 20, yPos);

      yPos += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text('The goods sold as part of this shipment are intended for end-user consumption and are not for retail sale', 20, yPos);

      yPos += 10;
      doc.setFontSize(7);
      doc.text('Reg Address: BRANDS.IN, A-39, WEST PATEL NAGAR, New delhi, DELHI-110008', 20, yPos);
      
      yPos += 11;
      doc.setFontSize(7);
      doc.text('This is a computer generated bill, does not require any physical signature.', 20, yPos);
      const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      doc.text(`Purchase made on ${currentDate}`, 150, yPos);

      yPos += 12;
      doc.setFontSize(6.5);
      doc.text('If you have any questions, feel free to call customer care at +91-7703933743 or use Contact Us section in our Website,', 20, yPos);
      yPos += 3;
      doc.text('or log on to www.shopheed.com/contactus', 20, yPos);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text('HEED', 188, yPos);

      const customerName = `${customer.first_name}_${customer.last_name}`.replace(/\s+/g, '_');
      const fileName = `Tax_Invoice_${invoiceNumber}_${customerName}.pdf`;

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
    try {
      console.log("Calling API with:", { selectedStatus, selectedOrderStatus, token: !!token });

      const res = await Api.getOrdersByAdmin(token, selectedStatus, selectedOrderStatus);
      console.log("API Response:", res.data);

      if (!res.data || !res.data.data || !Array.isArray(res.data.data)) {
        console.log("No data found in response:", res.data);
        setData([]);
        return;
      }

      const createPromise = res.data.data.map(async (order: any) => {
        if (!order.items || order.items.length === 0) {
          console.log("Skipping order with no items:", order._id);
          return null;
        }

        const productList = order.items.map((item: any) =>
          `${item.title || 'N/A'} (${item.size || 'N/A'}) x${item.quantity}`
        ).join(", ");

        const skuList = order.items.map((item: any) => item.sku || 'N/A').join(", ");

        const newObject: OrderData = {
          ["Order Date"]: formatDate(order.createdAt),
          ["Name"]: <div className="break-words">{productList}</div>,
          ["SKU"]: skuList,
          ["Amount"]: <div>₹ {order.totalAmount}</div>,
          ["Payment Status"]: order.status === "pending" ? (
            <Badge className="capitalized" color="warning">Pending</Badge>
          ) : order.status === "paid" ? (
            <Badge color="success">Paid</Badge>
          ) : order.status === "failed" ? (
            <Badge color="danger">Failed</Badge>
          ) : (
            <Badge color="secondary" className="capitalized">{order.status}</Badge>
          ),
          ["Order Status"]: <div className="capitalized">{order.orderStatus}</div>,
          Actions: order._id,
        };

        return newObject;
      });

      const results = await Promise.all(createPromise);
      const filteredResults = results.filter((item) => item !== null);

      console.log("Processed data:", filteredResults);
      setData(filteredResults);
    } catch (error: any) {
      console.error("API Error:", error);
      if (error?.response?.data?.message === "Order not found") {
        setData([]);
        return;
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

      let standardizedStatus = res.data.data.orderStatus;
      if (standardizedStatus === "Processed" || standardizedStatus === "processing") {
        standardizedStatus = "Confirmed";
      } else if (standardizedStatus === "shipping") {
        standardizedStatus = "Shipped";
      }

      setValue("orderStatus", standardizedStatus);
      setValue("forwardAwb", res.data.data.forwardAwb || "");
      setValue("reverseAwb", res.data.data.reverseAwb || "");
      setOrderStatus(standardizedStatus);

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
      itemId: orderDataById.items[0]._id,
      forwardAwb: data.forwardAwb,
      reverseAwb: data.reverseAwb,
    };
    console.log(updatedData);

    try {
      await Api.updateOrder(orderDataById._id, updatedData, token);
      onCloseModal();
      fetchData(status, orderStatus);
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Failed to update order data", error);
      toast.error("Failed to update order");
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
              {orderDataById !== null && (
                <ButtonGroup className="pull-right order-model">
                  <Modal isOpen={open} toggle={onCloseModal} className="model-model" size="lg">
                    <ModalHeader toggle={onCloseModal}>
                      <h5 className="modal-title f-w-600" id="exampleModalLabel2">Order Details</h5>
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="">
                          <Col lg="6" sm="12" xs="12">
                            <h3>Product Details</h3>
                            <div className="form-group col-md-12 col-sm-12 col-xs-12">
                              {orderDataById.items && orderDataById.items.map((item: any, idx: number) => (
                                <div key={idx} className="mb-3 pb-3 border-bottom">
                                  <h5><strong>Product {idx + 1}</strong></h5>
                                  <div className="field-label"><strong>Title:</strong> {item.title || 'N/A'}</div>
                                  <div className="field-label"><strong>Size:</strong> <span style={{ textTransform: "uppercase" }}>{item.size || 'N/A'}</span></div>
                                  <div className="field-label"><strong>SKU:</strong> {item.sku || 'N/A'}</div>
                                  <div className="field-label"><strong>Price:</strong> ₹{item.finalPrice || 0}</div>
                                  <div className="field-label"><strong>Quantity:</strong> {item.quantity}</div>
                                  <div className="field-label"><strong>Total:</strong> ₹{item.totalPrice || 0}</div>
                                </div>
                              ))}

                              <Row style={{ gap: " 13px 0px" }}>
                                <Col lg="4" md="4" sm="2">
                                  <h5>Total Quantity </h5>
                                  <div className="field-label">{orderDataById.totalQuantity}</div>
                                </Col>

                                <Col lg="4" md="4" sm="6">
                                  <h5>Total Amount </h5>
                                  <div className="field-label">₹ {orderDataById.totalAmount}</div>
                                </Col>
                                <Col lg="4" md="4" sm="6">
                                  <h5>Payment Method </h5>
                                  <div className="field-label text-capital">{orderDataById.paymentMethod || 'N/A'}</div>
                                </Col>

                                <Col lg="4" md="4" sm="6">
                                  <h5>Order Status </h5>
                                  <div className="field-label text-capital">{orderDataById.orderStatus}</div>
                                </Col>
                                <Col lg="4" md="4" sm="6">
                                  <h5>Order Date </h5>
                                  <div className="field-label">{formatDate(orderDataById.createdAt)}</div>
                                </Col>
                                {orderDataById.orderId && (
                                  <Col lg="4" md="4" sm="6">
                                    <h5>Order Id </h5>
                                    <div className="field-label">{orderDataById.orderId}</div>
                                  </Col>
                                )}

                                {orderDataById.paymentDetails && orderDataById.paymentDetails.orderId && (
                                  <Col lg="4" md="4" sm="6">
                                    <h5>Razorpay Order Id </h5>
                                    <div className="field-label">{orderDataById.paymentDetails.orderId}</div>
                                  </Col>
                                )}

                                {orderDataById.paymentDetails && orderDataById.paymentDetails.paymentStatus && (
                                  <Col lg="4" md="4" sm="6">
                                    <h5>Payment Status </h5>
                                    <div className="field-label">{orderDataById.paymentDetails.paymentStatus}</div>
                                  </Col>
                                )}

                                {orderDataById.paymentDetails && orderDataById.paymentDetails.paymentId && (
                                  <Col lg="4" md="4" sm="6">
                                    <h5>Payment Id </h5>
                                    <div className="field-label">{orderDataById.paymentDetails.paymentId}</div>
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </Col>
                          <Col lg="4" md="4" sm="6">
                            <h5>Forward AWB</h5>
                            <div className="field-label">{orderDataById.forwardAwb || "N/A"}</div>
                          </Col>
                          <Col lg="4" md="4" sm="6">
                            <h5>Reverse AWB</h5>
                            <div className="field-label">{orderDataById.reverseAwb || "N/A"}</div>
                          </Col>

                          <Col lg="6" sm="12" xs="12">
                            <h3>Address Details</h3>
                            <div className="row check-out">
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">First Name</div>
                                <input disabled type="text" className={`${errors.first_name ? "error_border" : ""} input-input`} {...register("first_name", { required: true })} />
                                <span className="error-message">{errors.first_name && "First name is required"}</span>
                              </div>
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">Last Name</div>
                                <input disabled type="text" className={`${errors.last_name ? "error_border" : ""} input-input`} {...register("last_name", { required: true })} />
                                <span className="error-message">{errors.last_name && "Last name is required"}</span>
                              </div>
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">Phone</div>
                                <input disabled type="text" className={`${errors.phone ? "error_border" : ""} input-input`} {...register("phone", { pattern: /\d+/ })} />
                                <span className="error-message">{errors.phone && "Please enter a valid phone number."}</span>
                              </div>
                              <div className="form-group col-md-6 col-sm-6 col-xs-12">
                                <div className="field-label">Email Address</div>
                                <input disabled className={`${errors.email ? "error_border" : ""} input-input`} type="text" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
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
                                <input disabled className={`${errors.address ? "error_border" : ""} input-input`} type="text" {...register("address", { required: true, })} placeholder="Street address" />
                                <span className="error-message">{errors.address && "Please write your address."}</span>
                              </div>
                              <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                <div className="field-label">Order Status</div>
                                <select className="input-input" {...register("orderStatus", { required: true })} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Returned">Returned</option>
                                  <option value="Return Processed">Return Processed</option>
                                  <option value="Cancelled">Cancelled</option>

                                  <option value="refunded">Refunded</option>

                                </select>
                                <span className="error-message">{errors.orderStatus && "Order status is required"}</span>
                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                  <div className="field-label">Forward AWB Number</div>
                                  <input
                                    type="text"
                                    className="input-input"
                                    {...register("forwardAwb")}
                                    placeholder="Enter Forward AWB Number"
                                  />
                                </div>

                                <div className="form-group col-md-12 col-sm-6 col-xs-12">
                                  <div className="field-label">Reverse AWB Number</div>
                                  <input
                                    type="text"
                                    className="input-input"
                                    {...register("reverseAwb")}
                                    placeholder="Enter Reverse AWB Number"
                                  />
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <ModalFooter>
                          <Button color="secondary" type="submit">Save</Button>
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
                </ButtonGroup>
              )}

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
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
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