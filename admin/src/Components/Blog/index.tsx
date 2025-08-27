import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import DataTableCategory from "@/CommonComponents/DataTableCategory";
import Api from "@/Components/Api";
import { getCookie } from "@/Components/Cookies";
import { ProductCategoryData } from "@/Data/Product/Physical";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImagePath } from "@/Constants";
import MDEditor from "@uiw/react-md-editor";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap";
import { title } from "process";
// import { cookies } from "next/headers";
interface BlogData {
    Image: string
    Title: string;

}



const Blog = () => {
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [text, setText] = useState("");
    const [value, setValue] = useState("");
    const [fetchStoreData, setFetchStoreData] = useState<any>(null);
    const [data, setData] = useState<BlogData[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [image, setImage] = useState<string>("");
    const [selectedId, setSelectedId] = useState('')
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
   
      const onCloseConfirmationModal = () => setConfirmDelete(false);



    const handleEditorChange = (value: any) => {
        setValue(value); 
    };

    const token = getCookie()


    const createBlog = async () => {

        if (!text) {
            return toast.error("Title is required")
        }

        if (!image) {
            return toast.error("Select image")
        }
        try {
            const payLoad = { title: text, description: value.toLowerCase(), photo: image }
            const createData = await Api.createBlogs(payLoad, token)
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

    const fetchData = async () => {
        const storeBlog: BlogData[] = []
        try {

            const getData = await Api.get_All_Blog()
            const createPromise = getData.data.data.map(async (item: any) => {

                const newObject = {

                    Image: item.photo,
                    Title: item.title,
                    Actions:item._id
                }
                storeBlog.push(newObject)

            })
            await Promise.all(createPromise)
            setData(storeBlog)
            console.log(storeBlog);
        } catch (error) {
            return console.log(error);
        }
    }
    useEffect(() => {
        fetchData()
    }, []);



    const deleteBlog = async (id: any) => {
        try {
            await Api.Delete_Blog(id, token);
            toast.success("Blog successfully deleted");
            fetchData(); 
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog.");
        }
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            deleteBlog(selectedId);
          onCloseConfirmationModal(); 
        }
      };
    



    const handleEditBlog = async () => {
        if (!fetchStoreData) return;
        console.log(fetchStoreData)
        try {
            const { _id, title, description } = fetchStoreData;
            const payload = { title: title, description: description, photo: image };
            await Api.Update_Blog(_id, payload, token);
            toast.success("Blog updated successfully!");
            onCloseModal1();
            fetchData();
        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error("Failed to update blog.");
        }
    };



    const openPopUp = async (Id: any) => {
        setOpen1(true);
        setSelectedId(Id)
        try {
            const res = await Api.get_Blog_Id(Id);
            setFetchStoreData(res.data.data);
            setImage(res.data.data.photo);
            console.log(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };



    const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            e.preventDefault();
            const image = e.target.files && e.target.files[0];
            if (image) {
                setLoadingImage(true);
                const formData = new FormData()
                formData.append('image', image);
                const res = await Api.uploadSingleImage(formData)
                setImage(res.data.imageUrl)
            }
        } catch (error) {
            return toast.error("somthing went wrong")

        }
        finally {
            setLoadingImage(false)
        }
    };
    return (
        <Fragment>
            <CommonBreadcrumb title="Blogs" parent="Physical" />
            <Container fluid>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CommonCardHeader title="All Blog" />
                            <CardBody>
                                <div className="btn-popup pull-right">
                                    <Button className=" pull-right order-model" color="secondary" onClick={onOpenModal}>
                                        Add Blogs
                                    </Button>
                                    <Modal isOpen={open} toggle={onCloseModal} className="model-model">
                                        <ModalHeader toggle={onCloseModal}>
                                            <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                                                Add Blogs
                                            </h5>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <FormGroup>
                                                    <Label htmlFor="recipient-name" className="col-form-label">
                                                        Title:
                                                    </Label>
                                                    <Input onChange={(e) => {
                                                        setText(e.target.value)
                                                    }} type="text" />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label htmlFor="description" className="col-form-label">
                                                        Add Description:
                                                    </Label>
                                                    <MDEditor
                                                        preview="edit"
                                                        value={value}
                                                        onChange={handleEditorChange}
                                                        height={200}
                                                        textareaProps={{
                                                            id: "description",
                                                            placeholder: "Enter your description here...",
                                                        }}
                                                    />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label htmlFor="message-text" className="col-form-label">
                                                        Blog Image:
                                                    </Label>
                                                    <Input id="validationCustom02" type="file" accept="image/*" onChange={(e) => handleImgChange(e)} />
                                                    <img alt="" src={image ? image : `${ImagePath}/dashboard/user.png`} style={{ width: 100, height: 100 }} />

                                                </FormGroup>
                                            </Form>
                                        </ModalBody>
                                        <ModalFooter>


                                            {loading || loadingImage ? (
                                                <Spinner size="md" color="primary" />
                                            ) : (
                                                <Button color="secondary" onClick={createBlog}>
                                                    Save
                                                </Button>
                                            )}

                                            <Button color="primary" onClick={onCloseModal}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </Modal>


                                    {/* edit blog section */}


                                    {
                                        fetchStoreData !== null &&


                                        <Modal isOpen={open1} toggle={onCloseModal1} className="model-model">
                                            <ModalHeader toggle={onCloseModal1}>
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                                                    Add Blogs
                                                </h5>
                                            </ModalHeader>
                                            <ModalBody>
                                                <Form>
                                                    <FormGroup>
                                                        <Label htmlFor="recipient-name" className="col-form-label">
                                                            Title:
                                                        </Label>
                                                        <Input value={fetchStoreData.title} onChange={(e) => {
                                                            setFetchStoreData({ ...fetchStoreData, title: e.target.value })
                                                        }} type="text" />
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <Label htmlFor="description" className="col-form-label">
                                                            Add Description:
                                                        </Label>
                                                        <MDEditor
                                                            preview="edit"
                                                            value={fetchStoreData.description}
                                                            onChange={(e: any) => {
                                                                setFetchStoreData({ ...fetchStoreData, description: e })
                                                            }}
                                                            height={200}
                                                            textareaProps={{
                                                                id: "description",
                                                                placeholder: "Enter your description here...",
                                                            }}
                                                        />
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <Label htmlFor="message-text" className="col-form-label">
                                                            Blog Image:
                                                        </Label>
                                                        <Input id="validationCustom02" type="file" accept="image/*" onChange={(e) => handleImgChange(e)} />
                                                        <img alt="" src={image ? image : `${ImagePath}/dashboard/user.png`} style={{ width: 100, height: 100 }} />

                                                    </FormGroup>
                                                </Form>
                                            </ModalBody>
                                            <ModalFooter>
                                                {loading || loadingImage ? (
                                                    <Spinner size="md" color="primary" />
                                                ) : (
                                                    <Button color="primary" onClick={handleEditBlog}>
                                                        Update
                                                    </Button>
                                                )}
                                                <Button color="secondary" onClick={onCloseModal1}>
                                                    Close
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                    }
                                </div>

                                <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                  <ModalHeader toggle={onCloseConfirmationModal}>
                    <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                  </ModalHeader>
                  <ModalBody>
                    Are you sure to want  delete this Blog?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleConfirmDelete}>Yes</Button>
                    <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
                  </ModalFooter>
                </Modal>



                                <div className="clearfix"></div>
                                <div id="basicScenario" className="product-physical">

                                    {data && data.length > 0 ? (
                                      <Datatable
                                      typeUse={"blogOrder"}
                                      myData={data}
                                      pageSize={30}
                                      pagination={true}
                                      openPopUp={openPopUp}
                                      handleDelete={openConfirmationModal}
                                      class="-striped -highlight"
                                  />
                                    ) : (
                                        "Loading...."
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </Fragment>
    );
};

export default Blog;
