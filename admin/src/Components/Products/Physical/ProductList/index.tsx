import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "@/Components/Cookies";
import { ImagePath } from "@/Constants";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  FormGroup,
  Input,
  Label,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import Api from "../../../../Components/Api/index";
import "./index.css";
import { toast, Toaster } from "react-hot-toast";
import MDEditor from "@uiw/react-md-editor";
import { colorData } from "../AddProduct/ProductCodeAndPrice";
import convertToJPEG from "@/Components/imageConvertor";
import { XCircle } from "react-feather";
interface Product {
  title: string;
  _id: string;
  price: number;
  discount: number;
  variants: { image: string }[];
}
interface category {
  category: string;
  value: string;
}
interface subCategory {
  category: string;
  subCategory: string;
  value: string;
}
type Specification = {
  question: string;
  answer: string;
};
// const shopTypeData = [{value:"formal-wear" ,item:'Formal Wear' } ,{value:"everyday-wear" ,item:'EveryDay Wear' } ,{value:"designer-wear" ,item:'Designer Wear' }  ,{value:"street-wear" ,item:'Street Wear' } ,{value:"trending" ,item:'Trending' }]
const shopTypeData = [{value:"formal wear" ,item:'Formal Wear' } ,{value:"everyday wear" ,item:'EveryDay Wear' } ,{value:"designer wear" ,item:'Designer Wear' }  ,{value:"street wear" ,item:'Street Wear' } ,{value:"trending" ,item:'Trending' }]




// interface variants {

// }
const ProductList = () => {

  const [productData, setProductData] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [subProductData, setSubProductData] = useState();
  const [categoryData, setCategoryData] = useState<category[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<subCategory[]>([]);
  const [variantsData, setVariantsData] = useState<any>({});
  const [comment, setComment] = useState<any>("")
  const [mainProductIdForDeleteComments, setMainProductIdForDeleteComments] = useState<any>("")
  const [specification, setSpecification] = useState({
    question: "",
    answer: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [specificationArray, setSpecificationArray] = useState<Specification[]>(
    []
  );
  const [specificationArray1, setSpecificationArray1] = useState<string[]>([]);
  const [image, setImage] = useState<string[]>([]);
  const [specificationString, setSpecificationString] = useState<string>("");
  const [saveSubId, setSaveSubId] = useState("");
  const [shopType, setShopType] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const onCloseModal = () => {
    setOpen(false);
  };
  const onOpenModal = () => {
    setOpen(true);
  };
  const onCloseModal2 = () => {
    setOpen2(false);
  };
  const onOpenModal2 = () => {
    setOpen2(true);
  };

  const onCloseModal3 = () => {
    setOpen3(false);
  };
  const onOpenModal3 = () => {
    setOpen3(true);
  };

  const openConfirmationModal = (id: string) => {
    setSelectedId(id);

    setConfirmDelete(true);
  };

  const onCloseConfirmationModal = () => setConfirmDelete(false);


  const openCommentPopUp = async (id: any) => {
    setMainProductIdForDeleteComments(id);
    getComments(id);
    onOpenModal3();
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const token = getCookie();



  const getComments = async (id: any) => {
    const storeData: any = []
    try {
      const res = await Api.getCommentByProductId(id, token);
      const createPromise = res.data.data.comments.map(async (item: any) => {
        const newObject = {
          ID: item._id,
          Comments: item.text,
          Rating: item.rating,
          Delete: item._id,
        }
        storeData.push(newObject)
      })
      await Promise.all(createPromise);
      setComment(storeData)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchData = async () => {
    const storeData: any = [];
    try {
      const res = await Api.getAllProductAdmin();
      console.log(res.data);
      const createPromise = res.data.data.map(async (item: any) => {

        if (item.products && item.products.length > 0) {
          const newObject = {
            Image: item.products[0].image?.[0] || "no",
            "Product Id": item._id || "no",
            Title: item.products[0].title || "no",
            Variants: item.products.length || "no",
            Price: item.price ? <div>₹ {item.price}</div> : "no",
            "Selling Price": item.products[0].finalPrice ? <div>₹ {item.products[0].finalPrice}</div> : "no",
            Comment: item._id || "no",
            Actions: item._id || "no",
          };
          storeData.push(newObject);
        }
        
      });
      await Promise.all(createPromise);
      setProductData(storeData);
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async (id: any) => {
    try {
      await Api.deleteProduct(id, token);
      fetchData();
      return toast.success("Product Successfully deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleSubProductDelete(selectedId)
      onCloseConfirmationModal();
    }
  };

  const handleDeleteComment = async (commentId: any) => {
    try {
      await Api.deleteReview(mainProductIdForDeleteComments, commentId, token);

      getComments(mainProductIdForDeleteComments);
      return toast.success("Comment Successfully deleted");
    } catch (error) {
      console.log(error);
    }
  };




  const fetchDataSubProduct = async (id: any) => {
    const storeData: any = [];
    try {
      const res = await Api.getProductAdminById(id, token);
      const createPromise = res.data.data.products.map(async (item: any) => {
        const newObject = {
          Image: item.image[0],
          Size:item.size,
          SKU:item.sku || "No",
          "Product Id": item._id,
          Title: item.title,
          Actions: item._id
        };
        storeData.push(newObject);
      });
      await Promise.all(createPromise);
      setSubProductData(storeData);
    } catch (error) {
      return console.log(error);
    }
  };

  const openPopUp = async (id: any) => {
    fetchDataSubProduct(id);
    onOpenModal();
  };


  const handleSubProductDelete = async (id: any) => {
    try {
      await Api.deleteSubProduct(id, { isDeleted: true }, token);
      fetchDataSubProduct(id);
      onCloseModal()
      return toast.success("Product Successfully deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const openPopUp2 = async (id: any) => {
    setSaveSubId(id);

    try {
      const res = await Api.get_Product_By_Id(id);
      console.log(res);
      setVariantsData(res.data.data);
      setSpecificationArray(res.data.data.specificationArray);
      setSpecificationArray1(res.data.data.specificationSingleLine);
      setImage(res.data.data.image);
      fetchDataSubCategoryByCategory(res.data.data.category)
      onOpenModal2();
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchDataCategory = async () => {
    try {
      const getData = await Api.getCategory();
      setCategoryData(getData.data.data);
      console.log(getData);
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchDataSubCategoryByCategory = async (name: any) => {
    try {
      const getData = await Api.getSubCategoryByCategoryName(name);
      setSubCategoryData(getData.data.data);
      console.log(getData);
    } catch (error) {
      return console.log(error);
    }
  };

  const handleAddSpecification = () => {
    if (!specification.question) {
      return toast.error("Please select question");
    } else if (!specification.answer) {
      return toast.error("Please select answer");
    }

    setSpecificationArray([
      ...specificationArray,
      { question: specification.question, answer: specification.answer },
    ]);
    setSpecification({ question: "", answer: "" });
  };

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const newFiles = e.target.files;
      if (!newFiles || newFiles.length === 0) {
        alert("Please select images to upload.");
        return;
      }

      const updatedImages: string[] = [];
      for (const file of Array.from(newFiles)) {
        const convertedImage = (await convertToJPEG(file)) as Blob;

        const formData = new FormData();
        formData.append("image", convertedImage, "image.jpg");

        const res = await Api.uploadSingleImage(formData);
        updatedImages.push(res.data.imageUrl);
      }

      setImage((prevImages) => [...prevImages, ...updatedImages]);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleValidSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payLoad = {
        ...variantsData,
        specificationArray: specificationArray,
        specificationSingleLine: specificationArray1,
        image: image,
      };
      await Api.updateSubProduct(saveSubId, payLoad, token);
      return toast.success("Product Successfully updated");
    } catch (error) {
      console.log(error);
    }
  };



  const handleAddSpecification1 = () => {
    if (!specificationString) {
      toast.error("Please fill the field before adding.");
      return;
    }

    // Update the existing state directly
    setSpecificationArray1((prevArray) => [...prevArray, specificationString]);
    setSpecificationString(""); // Clear the input field
  };

  const handleChangeShopType = async (value: any, id: any) => {
    try {
      await Api.updateMainProduct(id, { shopType: value }, token)
      fetchData()
      return toast.success("Shopping Type Successfully updated");
    } catch (error) {
      return console.log(error)
    }
  }

  return (
    <>
      {productData && productData.length >= 1 ? (
        <Fragment>
          <CommonBreadcrumb title="Product List" parent="Physical" />
          <Container fluid>
            <Row className="products-admin ratio_asos">
              {productData && (
                <Datatable
                  typeUse={"product-list"}
                  myData={productData}
                  pageSize={30}
                  pagination={true}
                  handleDelete={handleDelete}
                  openPopUp={openPopUp}
                  openCommentPopUp={openCommentPopUp}
                  handleChangeShopType={handleChangeShopType}
                  class="-striped -highlight"
                />
              )}
            </Row>
          </Container>
          <Toaster position="top-center" reverseOrder={false} />
        </Fragment>
      ) : null}


      <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
        <ModalHeader toggle={onCloseConfirmationModal}>
          <h5 className="modal-title f-w-600">Confirm Deletion</h5>
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this Product?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>Yes</Button>
          <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
        </ModalFooter>
      </Modal>





      <ButtonGroup className=" pull-right order-model">
        <Modal isOpen={open} toggle={onCloseModal} className="model-model">
          <ModalHeader >
            <h5 className="modal-title f-w-600" id="exampleModalLabel2">
              Varieties Details{" "}
            </h5>
          </ModalHeader>
          <ModalBody>
            {subProductData && (
              <Datatable
                typeUse={"product-list"}
                myData={subProductData}
                pageSize={30}
                pagination={true}
                handleDelete={openConfirmationModal}
                openPopUp={openPopUp2}
                class="-striped -highlight"
              />
            )}

            <ModalFooter>
              {/* <Button color="primary" type="submit">Save</Button> */}
              <Button color="primary" onClick={onCloseModal} >
                Close
              </Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </ButtonGroup>

      <ButtonGroup className=" pull-right order-model">
        <Modal isOpen={open2} toggle={onCloseModal2} className="model-model">
          <ModalHeader toggle={onCloseModal2}>
            <h5 className="modal-title f-w-600" id="exampleModalLabel2">
              Edit Varieties (Product){" "}
            </h5>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleValidSubmit} className=" form-label-center">
              <FormGroup className="mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Category :</Label>
                  </Col>
                  <Col sm="7" xl="8">
                    <Input
                      onClick={() => {
                        fetchDataCategory();
                      }}
                      type="select"
                      name="category"
                      id="validationCustom03"
                      value={variantsData?.category || ""}
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          category: e.target.value,
                          subCategory:[]
                        }));

                        fetchDataSubCategoryByCategory(e.target.value);
                      }}
                    >
                      <option className="text-capitalize" >
                        {" "}
                        {variantsData?.category || "Select a category"}{" "}
                      </option>
                      {categoryData.map((data, index) => {
                        console.log(data);
                        return (
                          <option value={data.value}    >{data.category} </option>
                        );
                      })}
                    </Input>
                  </Col>
                  <div className="valid-feedback">Looks good!</div>
                </Row>
              </FormGroup>



              <FormGroup className="mb-3">
                <Row>
                  <Col lg="3">
                    <Label className="fw-bold mb-0">SubCategory:</Label>
                  </Col>
                  <Col lg="9">
                    {subCategoryData.map((data, index) => {
                      return (
                        <FormGroup check inline key={index}>
                          <Label check>
                            <Input
                              type="checkbox"
                              name="subcategory"
                              value={data.value}
                              checked={variantsData?.subCategory.includes(data.value)}
                              onChange={(e: any) => {
                                if (e.target.checked) {
                                  setVariantsData((prevData: any) => ({
                                    ...prevData,
                                    subCategory: [ e.target.value],
                                  }));

                                } 
                              }}
                            />{" "}
                            {data.subCategory}
                          </Label>
                        </FormGroup>
                      );
                    })}
                  </Col>
                  <div className="valid-feedback">Looks good!</div>
                </Row>
              </FormGroup>


              <FormGroup className="mb-3">
  <Row>
    <Col lg="3">
      <Label className="fw-bold mb-0">Classification:
      </Label>
    </Col>
    <Col lg="9">
      
      {shopTypeData.map((data, index) => {
        return (
          <FormGroup check inline key={index}>
            <Label check>
              <Input
                type="checkbox"
                name="shoppingType"
                value={data.value}
                checked={ variantsData?.shopType && variantsData?.shopType.includes(data.value)}

                onChange={(e: any) => {
                  if (e.target.checked) {
                    setVariantsData((prevData: any) => ({
                      ...prevData,
                      shopType: [...prevData.shopType ,  e.target.value],
                    }));

                  } else {
                    setVariantsData((prevData: any) => ({
                      ...prevData,
                      shopType: prevData.shopType.filter((val: any) => val !== e.target.value),
                    }));
                  
                  }
                }}
                
      
              />{" "}
              {data.item}
            </Label>
          </FormGroup>
        );
      })}
    </Col>
    <div className="valid-feedback">Looks good!</div>
  </Row>
</FormGroup>


              <FormGroup className="mb-3 ">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0"> MRP :</Label>
                  </Col>
                  <Col sm="7" xl="8">
                    <Input
                      value={variantsData?.price}
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          price: e.target.value,
                        }));
                      }}
                      className="mb-0"
                      min="1"
                      max="10000000"
                      name="price"
                      id="validationCustom02"
                      type="number"
                      required
                    />
                  </Col>
                  <div className="valid-feedback">Looks good!</div>
                </Row>
              </FormGroup>

              <FormGroup className="mb-3 ">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Selling Price: :</Label>
                  </Col>
                  <Col sm="7" xl="8">
                    <Input
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          finalPrice: e.target.value,
                        }));
                      }}
                      value={variantsData.finalPrice}
                      className="mb-0"
                      name="discount"
                      id="validationCustom02"
                      type="number"
                    />
                  </Col>
                  <div className="valid-feedback">Looks good!</div>
                </Row>
              </FormGroup>

              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Product SKU :</Label>
                  </Col>
                  <Col xl="8" sm="7">
                    <Input
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          sku: e.target.value,
                        }));
                      }}
                      value={variantsData.sku}
                      name="product_name"
                      id="validationCustom01"
                      type="text"
                      required
                    />
                  </Col>
                </Row>
                <div className="valid-feedback">Looks good!</div>
              </FormGroup>

              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Brand Name :</Label>
                  </Col>
                  <Col xl="8" sm="7">
                    <Input
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          brand: e.target.value,
                        }));
                      }}
                      value={variantsData.brand}
                      name="product_name"
                      id="validationCustom01"
                      type="text"
                      required
                    />
                  </Col>
                </Row>
                <div className="valid-feedback">Looks good!</div>
              </FormGroup>

              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">
                      Product Specification :
                    </Label>
                  </Col>
                  <Col xl="4" sm="4">
                    <Input
                      placeholder="Question"
                      onChange={(e: any) => {
                        setSpecification({
                          ...specification,
                          question: e.target.value,
                        });
                      }}
                      value={specification.question}
                      name="product_name"
                      id="validationCustom01"
                      type="text"
                    />
                  </Col>
                  <Col xl="4" sm="4">
                    <Input
                      onChange={(e: any) => {
                        setSpecification({
                          ...specification,
                          answer: e.target.value,
                        });
                      }}
                      placeholder="Answer"
                      value={specification.answer}
                      name="product_name"
                      id="validationCustom01"
                      type="text"
                    />
                  </Col>

                  <div className="offset-xl-7 offset-sm-4 mt-3">
                    <Button
                      onClick={() => {
                        handleAddSpecification();
                      }}
                      type="button"
                      color="primary"
                    >
                      Add Specification
                    </Button>
                    <Button
                      onClick={() => {
                        setSpecificationArray([]);
                        setSpecification({ question: "", answer: "" });
                      }}
                      type="button"
                      color="light"
                    >
                      Discard
                    </Button>
                  </div>
                </Row>
                <div className="valid-feedback">Looks good!</div>
              </FormGroup>

              {specificationArray &&
                specificationArray.map((data, index) => {
                  return (
                    <>
                      <Row className="mb-3">
                        <Col xl="3" sm="4">
                          <Label className="fw-bold mb-0">Question :</Label>
                        </Col>
                        <Col sm="7" xl="8">
                          {data.question}{" "}
                          <XCircle
                            style={{
                              position: "relative",
                              top: "5px",
                              left: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSpecificationArray((prevArray) =>
                                prevArray.filter((_, i) => i !== index)
                              );
                            }}
                          />
                        </Col>

                        <Col xl="3" sm="4">
                          <Label className="fw-bold mb-0">Answer :</Label>
                        </Col>
                        <Col sm="7" xl="8">
                          {data.answer}
                        </Col>
                      </Row>
                    </>
                  );
                })}

              <FormGroup className="mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">
                      Product SingleLine Specification :
                    </Label>
                  </Col>
                  <Col xl="8" sm="8">
                    <Input
                      placeholder="Product Specification"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSpecificationString(e.target.value);
                      }}
                      value={specificationString}
                      name="product_name"
                      id="validationCustom01"
                      type="text"
                    />
                  </Col>

                  <div className="offset-xl-7 offset-sm-4 mt-3">
                    <Button
                      // onClick={() => {
                      //   setSpecificationArray1([
                      //     ...specificationArray1,
                      //     specificationString,
                      //   ]);
                      //   setSpecificationString("");
                      // }}



                      onClick={handleAddSpecification1}
                      type="button"
                      color="primary"
                    >
                      Add
                    </Button>
                    <Button
                      onClick={() => {
                        setSpecificationArray1([]);
                        setSpecificationString("");
                      }}
                      type="button"
                      color="light"
                    >
                      Discard
                    </Button>
                  </div>
                </Row>
                <div className="valid-feedback">Looks good!</div>
              </FormGroup>
              <Row className="mb-3">
                {specificationArray1 &&
                  specificationArray1.map((data, index) => {
                    return (
                      <>
                        <Col sm="7" xl="8">
                          {data}{" "}
                          <XCircle
                            style={{
                              position: "relative",
                              top: "5px",
                              left: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setSpecificationArray1((prevArray) =>
                                prevArray.filter((_, i) => i !== index)
                              );
                            }}
                          />
                        </Col>
                      </>
                    );
                  })}
              </Row>
              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Product Title :</Label>
                  </Col>
                  <Col xl="8" sm="7">
                    <Input
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          title: e.target.value,
                        }));
                      }}
                      value={variantsData.title}
                      name="product_name"
                      id="validationCustom01"
                      type="text"
                    />
                  </Col>
                </Row>
                <div className="valid-feedback">Looks good!</div>
              </FormGroup>

              <FormGroup className=" mb-3 ">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold">Add Description :</Label>
                  </Col>
                  <Col xl="8" sm="7" className=" description-sm">
                    <MDEditor style={{ color: "black" }}
                      preview="edit"
                      value={variantsData.description}
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          description: e,
                        }));
                      }}
                    />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup className="mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Color :</Label>
                  </Col>
                  <Col sm="7" xl="8">
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle caret>
                        {variantsData.color ? (
                          <>
                            <span
                              style={{
                                backgroundColor: variantsData.color,
                                height: "20px",
                                width: "20px",
                                display: "inline-block",
                                borderRadius: "50%",
                                marginRight: "8px",
                              }}
                            ></span>
                            {
                              colorData.find(
                                (c) => c.code === variantsData.color
                              )?.name
                            }
                          </>
                        ) : (
                          "Select a color"
                        )}
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ height: "50vh", overflow: "auto" }}
                      >
                        {colorData.map((color) => (
                          <DropdownItem style={{display:"flex"}}
                            key={color.code}
                            onClick={() => {
                              setVariantsData((prevData: any) => ({
                                ...prevData,
                                color: color.code,
                              }));
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: color.code,
                                height: "20px",
                                width: "20px",
                                display: "inline-block",
                                borderRadius: "50%",
                                marginRight: "8px",
                              }}
                            ></span>
                            <div style={{position:"relative" , top:"-2px"}}> {color.name}</div>
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                  <div className="valid-feedback">Looks good!</div>
                </Row>
              </FormGroup>

              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className=" fw-bold mb-0">Total Products :</Label>
                  </Col>

                  <Col sm="7" xl="8">
                    {" "}
                    <fieldset className="qty-box ms-0">
                      <InputGroup className="bootstrap-touchspin">
                        <div className="input-group-prepend">
                          <Button
                            color="primary"
                            className=" btn-square bootstrap-touchspin-down"
                            onClick={() => {
                              if (variantsData.quantity > 0) {
                                setVariantsData((pre: any) => ({
                                  ...pre,
                                  quantity: variantsData.quantity - 1,
                                }));
                              } else {
                                return null;
                              }
                            }}
                          >
                            <i className="fa fa-minus"></i>
                          </Button>
                        </div>

                        <Input
                          className="touchspin mx-1"
                          style={{ width: "100px", maxWidth: "50px" }}
                          type="text"
                          value={variantsData.quantity}
                          onChange={(e: any) => {
                            setVariantsData((prevData: any) => ({
                              ...prevData,
                              quantity: e.target.value,
                            }));
                          }}
                        />

                        <div className="input-group-append ms-0">
                          <Button
                            color="primary"
                            className="btn-square bootstrap-touchspin-up"
                            onClick={() => {
                              if (variantsData.quantity < 25) {
                                setVariantsData((pre: any) => ({
                                  ...pre,
                                  quantity: variantsData.quantity + 1,
                                }));
                              } else {
                                return null;
                              }
                            }}
                          >
                            <i className="fa fa-plus"></i>
                          </Button>
                        </div>
                      </InputGroup>
                    </fieldset>{" "}
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Select Size :</Label>
                  </Col>
                  <Col xl="1" sm="7">
                    <Input
                      value={variantsData.size}
                      type="select"
                      name="color"
                      id="validationCustom03"
                      onChange={(e: any) => {
                        setVariantsData((prevData: any) => ({
                          ...prevData,
                          size: e.target.value,
                        }));
                      }}
                    >
                      <option value="">Select a size</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
                    </Input>
                  </Col>
                </Row>
              </FormGroup>

              <Col className="offset-xl-3 offset-sm-4 mb-3 image-file">
                <ul className="file-upload-product">
                  <div className="box-input-file">
                    <Input
                      accept="image/*"
                      multiple
                      className="upload"
                      type="file"
                      onChange={(e: any) => handleImgChange(e)}
                    />
                    Upload Photos
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {image.length >= 1 &&
                      image.map((image, index) => {
                        return (
                          <>
                            {" "}
                            <img
                              alt=""
                              src={
                                image
                                  ? image
                                  : `${ImagePath}/dashboard/user.png`
                              }
                              style={{ width: 150, height: 100 }}
                            />
                            <XCircle
                              style={{
                                position: "relative",
                                top: "5px",
                                right: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setImage((prevArray) =>
                                  prevArray.filter((_, i) => i !== index)
                                );
                              }}
                            />{" "}
                          </>
                        );
                      })}
                  </div>
                </ul>
              </Col>

              <ModalFooter>
                <div className="offset-xl-9 offset-sm-4">
                  <Button type="submit" color="secondary">
                    Update
                  </Button>
                  <Button color="primary ms-2" onClick={onCloseModal2}>
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          </ModalBody>
        </Modal>
      </ButtonGroup>


      {/* comments section */}
      <ButtonGroup className=" pull-right order-model">
        <Modal isOpen={open3} toggle={onOpenModal3} className="model-model">

          <ModalBody>

            <Label className="fw-bold mb-0">Comments:</Label>

            {comment && (
              <Datatable
                typeUse={"product-list"}
                myData={comment}
                pageSize={30}
                pagination={true}
                handleDeleteComment={handleDeleteComment}
                openCommentPopUp={openCommentPopUp}
                class="-striped -highlight"
              />
            )}


            <ModalFooter>
              <div className="offset-xl-9 offset-sm-4">
                <Button color="secondary ms-2" onClick={onCloseModal3}>
                  Cancel
                </Button>
              </div>
            </ModalFooter>


          </ModalBody>




        </Modal>
      </ButtonGroup>



    </>
  );
};

export default ProductList;
