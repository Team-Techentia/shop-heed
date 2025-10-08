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

interface SizeOption {
  value: string;
  label: string;
}

type SizeOptionsType = Record<string, SizeOption[]>;

interface VariantsData {
  _id?: string;
  image?: string[];
  size?: string;
  quantity?: number;
  sizeQuantities?: Record<string, number>;
  specificationArray?: Specification[];
  specificationSingleLine?: string[];
  category?: string;
  subCategory?: string[];
  shopType?: string[];
  price?: number;
  finalPrice?: number;
  sku?: string;
  brand?: string;
  title?: string;
  description?: string;
  color?: string;
  [key: string]: any;
}

const shopTypeData = [
  { value: "formal wear", item: "Formal Wear" },
  { value: "everyday wear", item: "EveryDay Wear" },
  { value: "designer wear", item: "Designer Wear" },
  { value: "street wear", item: "Street Wear" },
  { value: "trending", item: "Trending" },
   { value: "new", item: 'New' },
];

const ProductList = () => {
  // --- Constants ---
  const sizeOptions: SizeOptionsType = {
    shirts: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "xxl", label: "XXL" },
      { value: "xxxl", label: "XXXL" },
      { value: "xxxxl", label: "XXXXL" },
      { value: "xxxxxl", label: "XXXXXL" },
    ],
    pants: [
      { value: "28", label: "28" },
      { value: "30", label: "30" },
      { value: "32", label: "32" },
      { value: "34", label: "34" },
      { value: "36", label: "36" },
      { value: "38", label: "38" },
      { value: "40", label: "40" },
      { value: "42", label: "42" },
      { value: "44", label: "44" },
      { value: "46", label: "46" },
      { value: "48", label: "48" },
    ],
    oneSize: [{ value: "No-Size", label: "No Size" }],
  };

  const [productData, setProductData] = useState<Product[]>([]);
  const [sizeType, setSizeType] = useState<keyof SizeOptionsType>("shirts");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [subProductData, setSubProductData] = useState();
  const [categoryData, setCategoryData] = useState<category[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<subCategory[]>([]);
  const [variantsData, setVariantsData] = useState<VariantsData>({});
  const [comment, setComment] = useState<any>("");
  const [mainProductIdForDeleteComments, setMainProductIdForDeleteComments] = useState<any>("");
  const [specification, setSpecification] = useState({ question: "", answer: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [specificationArray, setSpecificationArray] = useState<Specification[]>([]);
  const [specificationArray1, setSpecificationArray1] = useState<string[]>([]);
  const [image, setImage] = useState<string[]>([]);
  const [specificationString, setSpecificationString] = useState<string>("");
  const [saveSubId, setSaveSubId] = useState("");

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
    // Reset form when closing
    setSelectedSizes([]);
    setSizeQuantities({});
    setSizeType("shirts");
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
    const storeData: any = [];
    try {
      const res = await Api.getCommentByProductId(id, token);
      const createPromise = res.data.data.comments.map(async (item: any) => {
        const newObject = {
          ID: item._id,
          Comments: item.text,
          Rating: item.rating,
          Delete: item._id,
        };
        storeData.push(newObject);
      });
      await Promise.all(createPromise);
      setComment(storeData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    const storeData: any = [];
    try {
      const res = await Api.getAllProductAdmin();
      console.log(res.data);
      const createPromise = res.data.data.map(async (item: any) => {
        if (item.products && item.products.length > 0) {
          const newObject = {
            Image: item.products[0].image?.[0] || "no",
            Title: item.products[0].title || "no",
            Variants: item.products.length || "no",
            Price: item.price ? <div>₹ {item.price}</div> : "no",
            "Selling Price": item.products[0].finalPrice ? (
              <div>₹ {item.products[0].finalPrice}</div>
            ) : (
              "no"
            ),
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
      handleSubProductDelete(selectedId);
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
          Size: item.size,
          SKU: item.sku || "No",
          "Product Id": item._id,
          Title: item.title,
          Actions: item._id,
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
      onCloseModal();
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
      const productData = res.data.data;
      
      setVariantsData(productData);
      setSpecificationArray(productData.specificationArray || []);
      setSpecificationArray1(productData.specificationSingleLine || []);
      setImage(productData.image || []);
      
      // Set up size quantities if they exist
      if (productData.sizeQuantities) {
        setSizeQuantities(productData.sizeQuantities);
        setSelectedSizes(Object.keys(productData.sizeQuantities));
      } else if (productData.size && productData.quantity) {
        // Legacy support: single size/quantity
        setSizeQuantities({ [productData.size]: productData.quantity });
        setSelectedSizes([productData.size]);
      }
      
      // Determine size type based on the sizes
      if (productData.sizeQuantities) {
        const sizes = Object.keys(productData.sizeQuantities);
        if (sizes.some(s => ["xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl", "xxxxxl"].includes(s.toLowerCase()))) {
          setSizeType("shirts");
        } else if (sizes.some(s => !isNaN(Number(s)))) {
          setSizeType("pants");
        } else {
          setSizeType("oneSize");
        }
      }
      
      fetchDataSubCategoryByCategory(productData.category);
      onOpenModal2();
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchDataCategory = async () => {
    try {
      const getData = await Api.getCategory();
      setCategoryData(getData.data.data);
    } catch (error) {
      return console.log(error);
    }
  };

  const fetchDataSubCategoryByCategory = async (name: any) => {
    try {
      const getData = await Api.getSubCategoryByCategoryName(name);
      setSubCategoryData(getData.data.data);
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
        sizeQuantities: sizeQuantities, // Include the new size quantities
      };
      
      await Api.updateSubProduct(saveSubId, payLoad, token);
      onCloseModal2();
      fetchData();
      return toast.success("Product Successfully updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }
  };

  const handleAddSpecification1 = () => {
    if (!specificationString) {
      toast.error("Please fill the field before adding.");
      return;
    }

    setSpecificationArray1((prevArray) => [...prevArray, specificationString]);
    setSpecificationString("");
  };

  const handleChangeShopType = async (value: any, id: any) => {
    try {
      await Api.updateMainProduct(id, { shopType: value }, token);
      fetchData();
      return toast.success("Shopping Type Successfully updated");
    } catch (error) {
      return console.log(error);
    }
  };

  const handleSizeChange = (sizeValue: string, checked: boolean) => {
    setSelectedSizes((prev) =>
      checked ? [...prev, sizeValue] : prev.filter((s) => s !== sizeValue)
    );

    if (!checked) {
      setSizeQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[sizeValue];
        return newQuantities;
      });
    } else {
      // Set default quantity of 1 when size is selected
      setSizeQuantities((prev) => ({
        ...prev,
        [sizeValue]: 1,
      }));
    }
  };

  const handleQuantityChange = (sizeValue: string, qty: number) => {
    if (qty < 0 || qty > 999) return;
    setSizeQuantities((prev) => ({
      ...prev,
      [sizeValue]: qty,
    }));
  };

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
        <ModalBody>Are you sure you want to delete this Product?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button color="secondary" onClick={onCloseConfirmationModal}>
            No
          </Button>
        </ModalFooter>
      </Modal>

      <ButtonGroup className=" pull-right order-model">
        <Modal isOpen={open} toggle={onCloseModal} className="model-model">
          <ModalHeader>
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
              <Button color="primary" onClick={onCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </ButtonGroup>

      <ButtonGroup className=" pull-right order-model">
        <Modal isOpen={open2} toggle={onCloseModal2} className="model-model" size="lg">
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
                          subCategory: [],
                        }));

                        fetchDataSubCategoryByCategory(e.target.value);
                      }}
                    >
                      <option className="text-capitalize">
                        {" "}
                        {variantsData?.category || "Select a category"}{" "}
                      </option>
                      {categoryData.map((data, index) => {
                        return (
                          <option key={index} value={data.value}>
                            {data.category}{" "}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
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
                              checked={variantsData?.subCategory?.includes(data.value)}
                              onChange={(e: any) => {
                                if (e.target.checked) {
                                  setVariantsData((prevData: any) => ({
                                    ...prevData,
                                    subCategory: [e.target.value],
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
                </Row>
              </FormGroup>

              <FormGroup className="mb-3">
                <Row>
                  <Col lg="3">
                    <Label className="fw-bold mb-0">Classification:</Label>
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
                              checked={
                                variantsData?.shopType &&
                                variantsData?.shopType.includes(data.value)
                              }
                              onChange={(e: any) => {
                                if (e.target.checked) {
                                  setVariantsData((prevData: any) => ({
                                    ...prevData,
                                    shopType: [...(prevData.shopType || []), e.target.value],
                                  }));
                                } else {
                                  setVariantsData((prevData: any) => ({
                                    ...prevData,
                                    shopType: (prevData.shopType || []).filter(
                                      (val: any) => val !== e.target.value
                                    ),
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
                </Row>
              </FormGroup>

              <FormGroup className="mb-3 ">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Selling Price:</Label>
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
              </FormGroup>

              <FormGroup className=" mb-3">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Product Specification :</Label>
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
              </FormGroup>

              {specificationArray &&
                specificationArray.map((data, index) => {
                  return (
                    <Row className="mb-3" key={index}>
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
              </FormGroup>

              <Row className="mb-3">
                {specificationArray1 &&
                  specificationArray1.map((data, index) => {
                    return (
                      <Col sm="7" xl="8" key={index}>
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
              </FormGroup>

              <FormGroup className=" mb-3 ">
                <Row>
                  <Col xl="3" sm="4">
                    <Label className="fw-bold">Add Description :</Label>
                  </Col>
                  <Col xl="8" sm="7" className=" description-sm">
                    <MDEditor
                      style={{ color: "black" }}
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
                          <DropdownItem
                            style={{ display: "flex" }}
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
                            <div style={{ position: "relative", top: "-2px" }}>
                              {" "}
                              {color.name}
                            </div>
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup className="mb-3">
                <Row>
                  <Col lg="3">
                    <Label className="fw-bold mb-0">Size Type:</Label>
                  </Col>
                  <Col lg="9">
                    <Input
                      type="select"
                      value={sizeType}
                      onChange={(e: any) => {
                        setSizeType(e.target.value);
                        setSelectedSizes([]);
                        setSizeQuantities({});
                      }}
                    >
                      <option value="shirts">Shirts/Tops (XS, S, M, L, XL, etc.)</option>
                      <option value="pants">Pants/Trousers (30, 32, 34, 36, etc.)</option>
                      <option value="oneSize">No Size</option>
                    </Input>
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup className="mb-3">
                <Row>
                  <Col lg="3">
                    <Label className="fw-bold mb-0">Select Sizes & Quantities:</Label>
                  </Col>
                  <Col lg="9">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "15px",
                      }}
                    >
                      {sizeOptions[sizeType]?.map((sizeOption) => (
                        <div
                          key={sizeOption.value}
                          style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            borderRadius: "5px",
                            backgroundColor: selectedSizes.includes(sizeOption.value)
                              ? "#f8f9fa"
                              : "white",
                          }}
                        >
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                checked={selectedSizes.includes(sizeOption.value)}
                                onChange={(e) =>
                                  handleSizeChange(sizeOption.value, e.target.checked)
                                }
                              />
                              {" "}
                              <strong>Size: {sizeOption.label}</strong>
                            </Label>
                          </FormGroup>

                          {selectedSizes.includes(sizeOption.value) && (
                            <div style={{ marginTop: "8px" }}>
                              <Label style={{ fontSize: "12px", marginBottom: "5px" }}>
                                Quantity:
                              </Label>
                              <InputGroup size="sm">
                                <Button
                                  size="sm"
                                  color="outline-secondary"
                                  onClick={() =>
                                    handleQuantityChange(
                                      sizeOption.value,
                                      Math.max(0, (sizeQuantities[sizeOption.value] || 0) - 1)
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <Input
                                  style={{ textAlign: "center" }}
                                  type="number"
                                  min="0"
                                  max="999"
                                  value={sizeQuantities[sizeOption.value] || 0}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      sizeOption.value,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                                <Button
                                  size="sm"
                                  color="outline-secondary"
                                  onClick={() =>
                                    handleQuantityChange(
                                      sizeOption.value,
                                      Math.min(999, (sizeQuantities[sizeOption.value] || 0) + 1)
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </InputGroup>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedSizes.length > 0 && (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "10px",
                          backgroundColor: "#e9ecef",
                          borderRadius: "5px",
                        }}
                      >
                        <strong>Selected Sizes Summary:</strong>
                        <div style={{ marginTop: "5px" }}>
                          {selectedSizes.map((size) => (
                            <span
                              key={size}
                              style={{
                                display: "inline-block",
                                margin: "2px 5px",
                                padding: "2px 8px",
                                backgroundColor: "#007bff",
                                color: "white",
                                borderRadius: "3px",
                                fontSize: "12px",
                              }}
                            >
                              {sizeOptions[sizeType].find((s) => s.value === size)?.label}:{" "}
                              {sizeQuantities[size] || 0}
                            </span>
                          ))}
                        </div>
                        <div style={{ marginTop: "5px", fontSize: "14px" }}>
                          <strong>
                            Total Quantity:{" "}
                            {Object.values(sizeQuantities).reduce(
                              (sum, qty) => sum + (qty || 0),
                              0
                            )}
                          </strong>
                        </div>
                      </div>
                    )}
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
                      image.map((img, index) => {
                        return (
                          <div key={index} style={{ position: "relative" }}>
                            <img
                              alt=""
                              src={
                                img
                                  ? img
                                  : `${ImagePath}/dashboard/user.png`
                              }
                              style={{ width: 150, height: 100 }}
                            />
                            <XCircle
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                cursor: "pointer",
                                backgroundColor: "white",
                                borderRadius: "50%",
                              }}
                              onClick={() => {
                                setImage((prevArray) =>
                                  prevArray.filter((_, i) => i !== index)
                                );
                              }}
                            />
                          </div>
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

      <ButtonGroup className=" pull-right order-model">
        <Modal isOpen={open3} toggle={onOpenModal3} className="model-model">
          <ModalBody>
            <Label className="fw-bold mb-0">Comments: </Label>
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