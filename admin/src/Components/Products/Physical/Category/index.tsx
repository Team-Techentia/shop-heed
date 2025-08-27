import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import DataTableCategory from "@/CommonComponents/DataTableCategory";
import Api from "@/Components/Api";
import { getCookie } from "@/Components/Cookies";
import { ProductCategoryData } from "@/Data/Product/Physical";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImagePath } from "@/Constants";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import Datatable from "@/CommonComponents/DataTable";
// import { cookies } from "next/headers";
interface Category {
  Category: string;
  Image: string;
}
const Category = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<Category[]>([]);
  const [image, setImage] = useState<string>("");
  const [open1, setOpen1] = useState(false);
  const [fetchStoreData, setFetchStoreData] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const onOpenModal = () => {
    setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
  };

  const onOpenModal1 = () => {
    setOpen1(true);
  };
  const onCloseModal1 = () => {
    setOpen1(false);
  };


  const openConfirmationModal = (id: string) => {
    setSelectedId(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteCategory(selectedId);
      onCloseConfirmationModal();
    }
  };


  const onCloseConfirmationModal = () => setConfirmDelete(false);

  const token = getCookie()


  const createCategory = async () => {

    if (!text) {
      toast.error("Category Name is required");
      return;
    }
    if (!value) {
      toast.error("Category Value is required");
      return;
    }
    if (!image) {
      return toast.error("Select image")
    }
    try {
      const payLoad = { category: text, value: value.toLowerCase(), image }
      const createData = await Api.createcategory(payLoad, token)
      if (
        createData
      ) {
        onCloseModal();
        fetchData();
        setImage("")
        return
      }
      fetchData();
    } catch (error) {
      return console.log(error);
    }
  }
  const openPopUp = async (Id: any) => {
    setOpen1(true);
    setSelectedId(Id)
    try {
      const res = await Api.getCategoryById(Id, token);
      setFetchStoreData(res.data.data)
      setImage(res.data.data.image)
      console.log(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handlEdit = async () => {
    if (!fetchStoreData) return;
    try {
      const { _id, category, value } = fetchStoreData;
      const payload = { category, value, image };

      await Api.editCategory(_id, payload, token);
      toast.success("Category updated successfully");
      fetchData();
      onCloseModal1();
    } catch (error) {
      console.error("Error updating Category:", error);
      toast.error("Failed to update category.");
    }
  };

  const fetchData = async () => {
    const storeCategory: Category[] = []

    try {
      const getData = await Api.getCategory()
      const createPromise = getData.data.data.map(async (item: any) => {

        const newObject = {
          Image: item.image,
          Category: item.category,
          Actions: item._id
        }
        storeCategory.push(newObject);
      })
      await Promise.all(createPromise)
      setCategory(storeCategory)
    } catch (error) {
      return console.log(error);
    }

  }
  useEffect(() => {
    fetchData()
  }, []);

  const deleteCategory = async (id: any) => {
    try {
      await Api.deteletCategory(id, token)
      toast.success("Category successfully deleted")
      return fetchData()
    } catch (error) {
      return console.log(error);
    }
  }




  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      const image = e.target.files && e.target.files[0];
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await Api.uploadSingleImage(formData);
        console.log("Uploaded Image URL:", res.data.imageUrl);
        setImage(res.data.imageUrl);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  return (
    <Fragment>
      <CommonBreadcrumb title="Category" parent="Physical" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Product Category" />
              <CardBody>
                <div className="btn-popup pull-right">
                  <Button color="primary" onClick={() => {
                    setImage("")
                    setText("")
                    setValue("")
                    onOpenModal()
                  }}>
                    Add Category
                  </Button>
                  <Modal isOpen={open} toggle={onCloseModal}>
                    <ModalHeader toggle={onCloseModal}>
                      <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                        Add Product Category
                      </h5>
                    </ModalHeader>
                    <ModalBody>
                      <Form>
                        <FormGroup>
                          <Label htmlFor="recipient-name" className="col-form-label">
                            Category Name:
                          </Label>
                          <Input onChange={(e) => {
                            const value = e.target.value
                            setText(value)
                           const lower =  value.toLowerCase().replaceAll(" ","-")
                            setValue(lower)
                          }} type="text" />
                        </FormGroup>

                        {/* <FormGroup>
                          <Label htmlFor="recipient-name" className="col-form-label">
                            Category Value:
                          </Label>
                          <Input onChange={(e) => {
                            setValue(e.target.value)
                          }} type="text" />
                        </FormGroup> */}

                        <FormGroup>
                          <Label htmlFor="message-text" className="col-form-label">
                            Category Image:
                          </Label>
                          <Input id="validationCustom02" type="file" accept="image/*" onChange={(e) => handleImgChange(e)} />
                          <img alt="" src={image ? image : `${ImagePath}/dashboard/user.png`} style={{ width: 100, height: 100 }} />

                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={createCategory}>
                        Save
                      </Button>
                      <Button color="primary" onClick={onCloseModal}>
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
                <div className="clearfix"></div>
                <div id="basicScenario" className="product-physical">

                  {category && < Datatable
                    typeUse={"category"}
                    myData={category}
                    openPopUp={openPopUp}
                    multiSelectOption={false}
                    pageSize={30}
                    pagination={true}
                    class="-striped -highlight"
                    handleDelete={openConfirmationModal}
                    editFunction={handlEdit} />}
                </div>
              </CardBody>


              {fetchStoreData !== null &&
                <>
                  <div className="btn-popup pull-right">
                    <Modal isOpen={open1} toggle={onOpenModal1}>
                      <ModalHeader toggle={onCloseModal1}>
                        <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                          Category Details
                        </h5>
                      </ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label htmlFor="recipient-name" className="col-form-label">
                              Category Name:
                            </Label>
                            <Input
                              value={fetchStoreData.category || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                
                                const lower =  value.toLowerCase().replaceAll(" ","-")
                                setFetchStoreData({ ...fetchStoreData, category: value ,value:lower });
                              }}
                              type="text"
                            />
                          </FormGroup>

                          {/* <FormGroup>
                            <Label htmlFor="recipient-name" className="col-form-label">
                              Category Value:
                            </Label>
                            <Input value={fetchStoreData.value || ''}
                              onChange={(e) => {
                                setFetchStoreData({ ...fetchStoreData, value: e.target.value })
                              }}
                              type="text" />
                          </FormGroup> */}

                          <FormGroup>
                            <Label htmlFor="message-text" className="col-form-label">
                              Category Image:
                            </Label>
                            <Input id="validationCustom02" type="file" accept="image/*" onChange={(e) => handleImgChange(e)} />
                            <img alt="" src={image ? image : `${ImagePath}/dashboard/user.png`} style={{ width: 100, height: 100 }} />


                          </FormGroup>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="secondary" onClick={handlEdit}>
                          Update
                        </Button>
                        <Button color="primary" onClick={onCloseModal1}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </>
              }

              <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                <ModalHeader toggle={onCloseConfirmationModal}>
                  <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                </ModalHeader>
                <ModalBody>
                  Are you sure you want to delete this Category?
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={handleConfirmDelete}>Yes</Button>
                  <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
                </ModalFooter>
              </Modal>

            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default Category;
