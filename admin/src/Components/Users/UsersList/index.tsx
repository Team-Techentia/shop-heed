import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
import Api from "@/Components/Api";
import { UserListData } from "@/Data/Users";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Container, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { getCookie } from "@/Components/Cookies";
import { ToastContainer, toast } from "react-toastify";

interface userData {
  Name: String,
  Email: String,
  ["Phone Number"]: String,
  Role: String,
  ["Last Login"]: String
}




const UserList = () => {
  const router = useRouter();
  const [allUser, setAllUser] = useState<userData[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false); 
  const token = getCookie()

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    const storeData: userData[] = [];
    const formatDate = (dateString: string): string => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };
    try {
      const res = await Api.getAllUser(token);

      const createPromise = res.data.data.map(async (item: any) => {
        const newObject: any = {
          Name: <div className="capitalized">{item.name}</div>,
          Email: item.email,
          ["Phone Number"]: item.phoneNumber,
          Role: <div className="capitalized">{item.role}</div>,
          ["Last Login"]: formatDate(item.lastLogin.slice(0, 10)),
          Actions: item._id
        }
        storeData.push(newObject);
      })
      await Promise.all(createPromise);
      setAllUser(storeData)
    } catch (error) {
      console.log(error);
    }

  }

  const openConfirmationModal = (id: string) => {
    setSelectedId(id);
    setConfirmDelete(true); 
  };

  const onCloseConfirmationModal = () => setConfirmDelete(false);




  const handleDeleteUser = async(id: any)=>{
 try {
            await Api.deleteUser(id, token);
            toast.success("User successfully deleted");
            fetchData(); 
        } catch (error) {
            console.error("Error deleting User:", error);
            toast.error("Failed to delete User.");
        }

  }

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDeleteUser(selectedId);
      onCloseConfirmationModal(); 
    }
  };


  return (
    <Fragment>
      <CommonBreadcrumb title="User List" parent="Users" />
      <Container fluid>
        <Card>
          <CardHeader>
            <h5>User Details</h5>
          </CardHeader>
          <CardBody>
            {/* <div className="btn-popup pull-right">
              <Button color="secondary" onClick={() => router.push("/users/create-user")}>
                Create User
              </Button>
            </div> */}


<Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                  <ModalHeader toggle={onCloseConfirmationModal}>
                    <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                  </ModalHeader>
                  <ModalBody>
                    Are you sure to want  delete this User?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleConfirmDelete}>Yes</Button>
                    <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
                  </ModalFooter>
                </Modal>

            <div className="clearfix"></div>
            <div id="batchDelete" className="category-table user-list order-table coupon-list-delete ">

              {allUser && <Datatable
                typeUse={"users"}
                myData={allUser}
                pageSize={30}
                pagination={true}
                handleDelete={openConfirmationModal}
                class="-striped -highlight"
              />}
            </div>
          </CardBody>
        </Card>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default UserList;
