import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import DataTableCategory from "@/CommonComponents/DataTableCategory";
import Api from "@/Components/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductCategoryData } from "@/Data/Product/Physical";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "@/Components/Cookies";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Datatable from "@/CommonComponents/DataTable";

type SubCategory = {
  category: string;
  "Sub Category": string;
  image: string;
  Actions: string;
};

interface category {
  category: string;
  value: string;
  _id: string;
}

const SubCategory = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('')
  const [open2, setOpen2] = useState(false);
  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [text1, setText1] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subCategory, setSubCategory] = useState<any[]>([]);
  const [category, setCategory] = useState<category[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | any>(null);
  const token = getCookie()

  const onOpenModal = () => {
    setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
    // Reset form when closing
    setText('');
    setText1('');
    setValue('');
    setSelectedImage(null);
    setImagePreview('');
  };

  const onCloseModal2 = () => {
    setOpen2(false);
    setEditSelectedImage(null);
    setEditImagePreview('');
  };

  const onOpenModal2 = () => {
    setOpen2(true);
  };

  const openConfirmationModal = (id: string) => {
    setSelectedId(id);
    setConfirmDelete(true);
  };

  const onCloseConfirmationModal = () => setConfirmDelete(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await Api.uploadSingleImage(formData);
      return response.data.imageUrl || response.data.url || response.data.path;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const openPopUp = async (id: string) => {
    setOpen2(true);
    setSelectedId(id)
    try {
      const res = await Api.getSubCategoryById(id, token);
      setSelectedSubCategory(res.data.data);
      if (res.data.data.image) {
        setEditImagePreview(res.data.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subCreateCategory = async () => {
    if (!text) {
      toast.error("Category is required");
      return;
    }
    if (!value) {
      toast.error("Value is required");
      return;
    }
    if (!text1) {
      toast.error("Sub category is required");
      return;
    }
    if (!selectedImage) {
      toast.error("Image is required");
      return;
    }

    setIsUploading(true);
    try {
      // Upload image first
      const imageUrl = await uploadImage(selectedImage);

      const payLoad = {
        category: text,
        subCategory: text1,
        value: value.toLowerCase(),
        image: imageUrl
      };

      const createData = await Api.createsubCategory(payLoad, token);
      toast.success("Sub Category created successfully!");
      onCloseModal();
      fetchData();
      fetchData1();
    } catch (error) {
      toast.error("Failed to create sub category");
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchData1 = async () => {
    const StoreSubCategory: any[] = [];
    try {
      const getData = await Api.getsubCategory();

      const createPromise = getData.data.data.map(async (item: any) => {
        const newObject = {
          category: item.category,
          ["Sub Category"]: item.subCategory,
          Image: item.image || '',
          Actions: item._id,
        };
        StoreSubCategory.push(newObject);
      });

      await Promise.all(createPromise);
      setSubCategory(StoreSubCategory);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const Data = await Api.getCategory();
      setCategory(Data.data.data);
    } catch (error) {
      return console.log(error);
    }
  };

  useEffect(() => {
    fetchData1();
    fetchData()
  }, []);

  const deleteSubCategory = async (id: string) => {
    try {
      await Api.deteletSubCategory(id, token);
      toast.success("Sub Category successfully deleted");
      fetchData1();
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteSubCategory(selectedId);
      onCloseConfirmationModal();
    }
  };

  const handleEditSubCategory = async () => {
    if (!selectedSubCategory || !selectedId) return;

    setIsUploading(true);
    try {
      let imageUrl = selectedSubCategory.image;

      // If a new image is selected, upload it
      if (editSelectedImage) {
        imageUrl = await uploadImage(editSelectedImage);
      }

      const { category, subCategory, value }: any = selectedSubCategory;
      const payload = { category, subCategory, value, image: imageUrl };

      await Api.editSubcategory(selectedId, payload, token);
      toast.success("Sub Category updated successfully!");
      onCloseModal2();
      fetchData1();
    } catch (error) {
      console.error("Error updating sub-category:", error);
      toast.error("Failed to update sub-category.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Fragment>
      <CommonBreadcrumb title="Sub Category" parent="Physical" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Product Sub Category" />
              <CardBody>
                <ButtonGroup className=" pull-right">
                  <Button style={{ marginBottom: "30px" }} color="primary" onClick={onOpenModal}>
                    Add Sub Category
                  </Button>

                  {/* Add Sub Category Modal */}
                  <Modal isOpen={open} toggle={onCloseModal} size="md">
                    <ModalHeader toggle={onCloseModal}>
                      <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                        Add Product Sub Category
                      </h5>
                    </ModalHeader>
                    <ModalBody>
                      <Form>
                        <FormGroup>
                          <Label htmlFor="recipient-name" className="col-form-label">
                            Category Name:
                          </Label>
                          <Input
                            type="select"
                            name="color"
                            id="validationCustom03"
                            value={text}
                            onChange={(e) => {
                              setText(e.target.value);
                            }}
                          >
                            <option>Select Category </option>
                            {category &&
                              category.map((data) => (
                                <option key={data.category} value={data.value}>
                                  {data.category}
                                </option>
                              ))}
                          </Input>
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="recipient-name" className="col-form-label">
                            Sub Category Name:
                          </Label>
                          <Input
                            onChange={(e) => {
                              const value = e.target.value
                              setText1(value);
                              const lower = value.toLowerCase().replaceAll(" ", "-")
                              setValue(lower)
                            }}
                            value={text1}
                            type="text"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="message-text" className="col-form-label">
                            Sub Category Image: <span style={{ color: 'red' }}>*</span>
                          </Label>
                          <Input
                            id="validationCustom02"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <div className="mt-2">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                              />
                            </div>
                          )}
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={subCreateCategory}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Save'}
                      </Button>
                      <Button color="primary" onClick={onCloseModal}>
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </ButtonGroup>

                {/* Edit Sub Category Modal */}
                {selectedSubCategory && (
                  <Modal isOpen={open2} toggle={onOpenModal2} size="md">
                    <ModalHeader toggle={onCloseModal2}>
                      <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                        Edit Sub Category Details
                      </h5>
                    </ModalHeader>
                    <ModalBody>
                      <Form>
                        <FormGroup>
                          <Label htmlFor="edit-category-name">Category Name:</Label>
                          <Input
                            type="select"
                            id="edit-category-name"
                            value={selectedSubCategory.category}
                            onChange={(e) => setSelectedSubCategory({ ...selectedSubCategory, category: e.target.value })}
                          >
                            <option>Select Category</option>
                            {category.map((data) => (
                              <option key={data._id} value={data.value}>
                                {data.category}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="edit-sub-category-name">Sub Category:</Label>
                          <Input
                            id="edit-sub-category-name"
                            type="text"
                            value={selectedSubCategory.subCategory}
                            onChange={(e) => {
                              const value = e.target.value
                              const lower = value.toLowerCase().replaceAll(" ", "-")
                              setSelectedSubCategory({ ...selectedSubCategory, subCategory: value, value: lower })
                            }}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="edit-image">Sub Category Image:</Label>
                          <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                          />
                          {(editImagePreview || selectedSubCategory.image) && (
                            <div className="mt-2">
                              <img
                                src={editImagePreview || selectedSubCategory.image}
                                alt="Current Image"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                              />
                              {editImagePreview && <p className="text-muted mt-1">New image selected</p>}
                            </div>
                          )}
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        onClick={handleEditSubCategory}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Updating...' : 'Update'}
                      </Button>
                      <Button color="primary" onClick={onCloseModal2}>
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                )}

                {/* Delete Confirmation Modal */}
                <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                  <ModalHeader toggle={onCloseConfirmationModal}>
                    <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                  </ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete this Sub Category?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleConfirmDelete}>Yes</Button>
                    <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
                  </ModalFooter>
                </Modal>

                <div className="clearfix"></div>
                <div id="basicScenario" className="product-physical capitalized">
                  {/* <Datatable
                    typeUse={"subCategory"}
                    myData={subCategory}
                    multiSelectOption={false}
                    pageSize={10}
                    pagination={true}
                    handleDelete={openConfirmationModal}
                    openPopUp={openPopUp}
                    class="-striped -highlight"
                  /> */}
                  < Datatable
                    typeUse={"subCategory"}
                    myData={subCategory}
                    openPopUp={openPopUp}
                    multiSelectOption={false}
                    pageSize={10}
                    pagination={true}
                    class="-striped -highlight"
                    handleDelete={openConfirmationModal}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment >
  );
};

export default SubCategory;