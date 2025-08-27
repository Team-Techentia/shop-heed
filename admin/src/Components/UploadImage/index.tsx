import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import DataTableCategory from "@/CommonComponents/DataTableCategory";
import Api from "@/Components/Api";
import { getCookie } from "@/Components/Cookies";
import { Fragment, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImagePath } from "@/Constants";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { set } from "react-hook-form";

interface Image {
    image: string;
}
interface category {
    category: string;
    _id: string;
}
const UploadImage = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [productName, SetProductName] = useState("");
    const [category, setCategory] = useState<category[]>([]);
    const [images, setImages] = useState<Image[]>([]);

    const onOpenModal = () => {
        setOpen(true);
    };
    const onCloseModal = () => {
        setOpen(false);
    };

    const token = getCookie()


    const UploadImage = async () => {
      
    }

    const fetchData = async () => {
        try {

            const getData = await Api.getCategory()
            setCategory(getData.data.data)
            console.log(getData);
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
        e.preventDefault();
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            const newImages = fileArray.map((file) => {
                return {
                    image: URL.createObjectURL(file),
                };
            });

            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };
    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };



    return (
        <Fragment>
            <CommonBreadcrumb title="Image Upload" parent="" />
            <Container fluid>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CommonCardHeader title="Product Category" />
                            <CardBody>
                                <div className="btn-popup pull-right">
                                    <Button color="primary" onClick={onOpenModal}>
                                        Upload Image
                                    </Button>
                                    <Modal isOpen={open} toggle={onCloseModal}>
                                        <ModalHeader toggle={onCloseModal}>
                                            <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                                                Add  Product Images
                                            </h5>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form>


                                                <FormGroup>
                                                    <Label htmlFor="recipient-name" className="col-form-label">
                                                        Product  Image name
                                                    </Label>
                                                    <Input onChange={(e) => {
                                                        SetProductName(e.target.value)
                                                    }} type="text" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label htmlFor="message-text" className="col-form-label">
                                                        Product Image Upload:
                                                    </Label>
                                                    <Input
                                                        id="validationCustom02"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple 
                                                        onChange={(e) => handleImgChange(e)}
                                                    />

                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                                                        {images &&
                                                            images.map((data, index) => (
                                                                <div key={index} style={{ position: "relative", display: "inline-block" }}>
                                                                    <img
                                                                        alt={`Uploaded ${index}`}
                                                                        src={data.image}
                                                                        style={{ width: 100, height: 100, objectFit: "cover" }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index)}
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: 0,
                                                                            right: 0,
                                                                            backgroundColor: "red",
                                                                            color: "white",
                                                                            border: "none",
                                                                            borderRadius: "50%",
                                                                            width: "20px",
                                                                            height: "20px",
                                                                            cursor: "pointer",
                                                                            textAlign: "center",
                                                                            lineHeight: "18px",
                                                                        }}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </FormGroup>
                                            </Form>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={UploadImage}>
                                                Save
                                            </Button>
                                            <Button color="secondary" onClick={onCloseModal}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                                <div className="clearfix"></div>
                                <div id="basicScenario" className="product-physical">

                                    {category && <DataTableCategory myData={category} multiSelectOption={false} pageSize={10} pagination={true} class="-striped -highlight" deleteFunction={deleteCategory} />}                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </Fragment>
    );
};

export default UploadImage;
