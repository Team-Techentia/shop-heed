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
  Invoicing: any;
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
  const [orderDataById, setOrderDataById] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderAction, setOrderAction] = useState("");
  const [selectedId, setSelectedId] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState<string>('');
  const token = getCookie();
  const router = useRouter()
  useEffect(() => {
    fetchData(status, orderStatus);
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
    setStatus(selectedStatus);
    fetchData(selectedStatus, orderStatus);
  };
  const handleDropdownOne1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrderStatus = e.target.value;
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

  const fetchData = async (selectedStatus: string, selectedOrderStatus: string) => {
    const storeData: OrderData[] = [];
    try {

      const res = await Api.getOrdersByAdmin(token, selectedStatus, selectedOrderStatus);

      const createPromise = res.data.data.map(async (item: any) => {
        const orderId = item.paymentDetails?.orderId || item._id;

        const newObject: OrderData = {
          Image: item.product.image[0],
          ["Order Id"]: orderId,
          SKU: item.product.sku || "No",
          ["Payment Status"]: item.status === "pending" ? (
            <Badge className="capitalized" color="secondary">{item.status}</Badge>
          ) : item.status === "paid" ? (
            <Badge color="success">Paid</Badge>
          ) : (
            <div className="capitalized">{item.status}</div>
          ),
          ["Payment Method"]: item.paymentMethod.replaceAll(" ", "") === "cod" ? (
            <Badge color="secondary">Cash On Delivery</Badge>
          ) : (
            <Badge className="capitalized" color="success">{item.paymentMethod}</Badge>
          ),
          ["Order Status"]: <div className="capitalized">{item.orderStatus}</div>,
          Date: formatDate(item.orderDate.slice(0, 10)),
          ["Total"]: <div>₹ {item.totalAmount}</div>,
          ["Invoicing"]: item.inVoiceLink || "Generate Invoice",
          Actions: item._id,
        };

        storeData.push(newObject);
      });

      await Promise.all(createPromise);
      setData(storeData);
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === "Order not found") {
          setData([])
        }
      }

      console.error(error);
    }
  };

  const handleStatusChange = async (orderId: any, newStatus: any) => {
    try {
      await Api.updateOrderStatus({ id: orderId, status: newStatus }, token);
      toast.success("Order status updated successfully!");
      fetchData(status, orderStatus); // Refresh data after update
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
      title: orderDataById.product.title, finalPrice: orderDataById.product.finalPrice,
      totalQuantity: orderDataById.totalQuantity, totalAmount: orderDataById.totalAmount,
      paymentMethod: orderDataById.paymentMethod, orderId: orderDataById.paymentDetails && orderDataById.paymentDetails.orderId || orderDataById._id
    };
    console.log(updatedData)

    try {
      await Api.updateOrder(orderDataById._id, updatedData, token);
      onCloseModal();
      fetchData(status, orderStatus);
      setOrderStatus('')
    } catch (error) {
      console.error("Failed to update order data", error);
    }
  };



  const handleGenerateInvoicing = async (id: any) => {
    try {
      const res = await Api.generateInvoicing(token, id);
      
      const pdfUrl = res.data.url;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      fetchData(status, orderStatus);
    } catch (error) {
      console.error(error);
    }
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
                              <div className="field-label"> {orderDataById.product.title} </div>
                              <h5> <strong>Size</strong> </h5>
                              <div style={{textTransform:"uppercase"}}  className="field-label"> {orderDataById.product.size} </div>
                              <h5> <strong>SKU</strong> </h5>
                              <div className="field-label"> {orderDataById.product.sku || "No"} </div>
                              <h5> <strong> Product Id </strong></h5>
                              <div className="field-label"> {orderDataById.product.productId} </div>
                              <h5>  <strong>Variants Id</strong> </h5>
                              <div className="field-label"> {orderDataById.product._id} </div>
                              <div className="field-label"> {orderDataById.product.title} </div>

                              <div className="field-label"> <img style={{ height: "150px" }} src={orderDataById.product.image[0]} alt="" /></div>

                              <Row style={{ gap: " 13px 0px" }}>
                                <Col lg="4" md="4" sm="2">
                                  <h5>Price </h5>
                                  <div className="field-label"> ₹ {orderDataById.product.finalPrice} </div>
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
                                  <div className="field-label  text-capital "      >  {orderDataById.paymentMethod} </div>
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

                                {/* <div className="form-group  ">
                                  <div className="field-label"> <strong>Order Action</strong> </div>
                                  <select onChange={(e) => {
                                    setOrderAction(e.target.value)
                                  }} name="wc_order_action " className="input-input mt-1">
                                    <option value="">Choose an action...</option>
                                    <option value="send_order_details">Email invoice / order details to customer</option>
                                    <option value="send_order_details_admin">Resend new order notification</option>
                                    <option value="regenerate_download_permissions">Regenerate download permissions</option>
                                  </select>
                                </div> */}

                                {/* <Button color="secondary" onClick={() => generateInvoice(orderDataById)}>Generate Invoice</Button> */}

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
                                  // onChange={(item) => {
                                  //   setSelectedCountry(item);
                                  //   setSelectedState(null);
                                  //   setSelectedCity(null);
                                  // }}
                                />
                              </div>
                              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                <div className="field-label">State</div>
                                <Select
                                  options={selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []}
                                  getOptionLabel={(options) => options["name"]}
                                  getOptionValue={(options) => options["name"]}
                                  value={selectedState}
                                  // onChange={(item) => {
                                  //   setSelectedState(item);
                                  //   setSelectedCity(null);
                                  // }}
                                />
                              </div>
                              <div className="form-group col-md-12 col-sm-12 col-xs-12">
                                <div className="field-label">City</div>
                                <Select
                                  options={selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []}
                                  getOptionLabel={(options) => options["name"]}
                                  getOptionValue={(options) => options["name"]}
                                  value={selectedCity}
                                  // onChange={(item) => setSelectedCity(item)}
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
                          <Button color="primary" onClick={onCloseModal}>Close</Button>
                        </ModalFooter>
                      </Form>
                    </ModalBody>
                  </Modal>
                </ButtonGroup> : ""
              }
              <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                <ModalHeader toggle={onCloseConfirmationModal}>
                  <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                </ModalHeader>
                <ModalBody>
                  Are you sure to want  delete this Order?
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={handleConfirmDelete}>Yes</Button>
                  <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
                </ModalFooter>
              </Modal>
              <CommonCardHeader title="Manage Order" />

              <CardBody className="order-datatable">


                <Row>
                  <Col className="mb-2" sm="6" md="3" lg="3">
                    Payment Status
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

                      <option value="" disabled>Select Payment Status</option>
                      <option value="null">All</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </Input>
                  </Col>

                  <Col sm="6" md="3" lg="3">
                    Order Status
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
                      <option value="" disabled>Select Order Status</option>
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
                </Row>


                {data && data.length > 0 ? (
                  <Datatable
                    handleStatusChange={handleStatusChange}
                    handleGenerateInvoicing={handleGenerateInvoicing}
                    typeUse={"manaegOrder"}
                    myData={data}
                    pageSize={30}
                    pagination={true}
                    openPopUp={openPopUp}
                    handleDelete={openConfirmationModal}
                    class="-striped -highlight"
                  />
                ) : (
                  "Data Not Found"
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default SalesOrders;

