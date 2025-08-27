import { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import Api from "@/Components/Api";
import { getCookie } from "@/Components/Cookies";


interface PaymentData {
  transactionId: string;
  paymentId: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

const SalesTransaction = () => {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [date, setDate] = useState<any>({
    start: "",
    end: "",
  })
  // const today = new Date().toISOString().split("T")[0];
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const token = getCookie();



  useEffect(() => {
    fetchData(status);
  }, [status ,date]);


  const handleDropdownOne = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
  };





  const fetchData = async (status: string) => {
    const storeData: any[] = [];
    try {
      const res = await Api.getAllPayment(token , status, date.start, date.end)
      console.log(res)
      setTotalAmount(res.data.totalAmount)
      // const res = await Api.getAllPayment(token, status);
      const createPromise = res.data.data.map(async (item: PaymentData) => {
        const newObject = {
          ["Order Id"]: item.transactionId,
          ["Payment Id"]: item.paymentId,
          Amount: <div>₹ {item.amount}</div>,
          Status: item.paymentStatus,
          Date: item.createdAt,
        };
        storeData.push(newObject);
      });

      await Promise.all(createPromise);
      setData(storeData);
    } catch (error) {
     return console.log(error);
    }
  };

  const handleDateChange = (e: any) => {
    
    const { name, value } = e.target
   
    setDate((prev: any) => ({ ...prev, [name]: value }))
  }
 
  return (
    <Fragment>
      <CommonBreadcrumb title="Transactions" parent="Sales" />


      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Transaction Details" />

              <CardBody>

                <Row className="align-items-center mt">
                  <Col sm="6" md="3" lg="2">
              <div className="mb-2">  <strong >   Status  </strong></div>
                    <Input
                      type="select"
                      name="status"
                      id="statusSelect"
                      value={status}
                      onChange={(e: any) => handleDropdownOne(e)}
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="null">All</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </Input>
                  </Col>
                  <Col sm="6" md="3" lg="2">
                  <div className="mb-2">  <strong >   From  </strong></div>
                    <Input
                      type="date"
                      name="start"
                      id="startDate"
                      value={date.start}
                      onChange={handleDateChange}
                      placeholder="Start Date"
                      
                    />
                  </Col>

                  <Col sm="6" md="3" lg="2">
                  <div className="mb-2">  <strong >   To  </strong></div>
                    <Input
                      type="date"
                      name="end"
                      id="endDate"
                      value={date.end}
                      onChange={handleDateChange}
                      placeholder="End Date"
                      min={date.start}
                    />
                  </Col>

                  <Col sm="6" md="3" lg="2">

                  <div>
                    
                  </div>
                  <div className="mb-2">  <strong >   Total  </strong></div>
                    <Input
                      type="text"
                      name="totalAmount"
                      id="totalAmount"
                      value={`₹ ${totalAmount}`}
                      readOnly
                      placeholder="Total Amount"
                      style={{maxWidth:"150px" , textAlign:"center"}}
                    />
                  </Col>
                </Row>

                <div id="batchDelete" className="transactions capitalized mt-3">
                  {data.length > 0 ? (
                    <Datatable
                      typeUse={"transaction"}
                      myData={data}
                      pageSize={30}
                      pagination={true}
                      class="-striped -highlight"
                    />
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SalesTransaction;

