import { Col, Form, FormGroup, Input, Label, Row, InputGroup, InputGroupText, Dropdown, Button, DropdownToggle, DropdownItem, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import MDEditor from "@uiw/react-md-editor";
import { ImagePath } from "@/Constants";
import { useState, SetStateAction, useEffect } from "react";
import Api from "@/Components/Api";
import { getCookie } from "@/Components/Cookies";
import { Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import convertToJPEG from "@/Components/imageConvertor";
import { XCircle } from "react-feather";

export const colorData = [
  { name: "Red", code: "#FF0000" }, { name: "Orange", code: "#FFA500" }, { name: "Yellow", code: "#FFFF00" }, 
  { name: "Green", code: "#008000" }, { name: "Blue", code: "#0000FF" }, { name: "Purple", code: "#800080" }, 
  { name: "Pink", code: "#FFC0CB" }, { name: "Brown", code: "#A52A2A" }, { name: "Black", code: "#000000" }, 
  { name: "White", code: "#FFFFFF" }, { name: "Gray", code: "#808080" }, { name: "Beige", code: "#F5F5DC" }, 
  { name: "Turquoise", code: "#40E0D0" }, { name: "Cyan", code: "#00FFFF" }, { name: "Magenta", code: "#FF00FF" }, 
  { name: "Lavender", code: "#E6E6FA" }, { name: "Indigo", code: "#4B0082" }, { name: "Maroon", code: "#800000" }, 
  { name: "Olive", code: "#808000" }, { name: "Teal", code: "#008080" }, { name: "Navy", code: "#000080" }, 
  { name: "Violet", code: "#EE82EE" }, { name: "Silver", code: "#C0C0C0" }, { name: "Gold", code: "#FFD700" }, 
  { name: "Charcoal", code: "#36454F" }, { name: "Coral", code: "#FF7F50" }, { name: "Crimson", code: "#DC143C" }, 
  { name: "Emerald", code: "#50C878" }, { name: "Ivory", code: "#FFFFF0" }, { name: "Khaki", code: "#F0E68C" }, 
  { name: "Mint", code: "#98FF98" }, { name: "Peach", code: "#FFE5B4" }, { name: "Plum", code: "#DDA0DD" }, 
  { name: "Rose", code: "#FF007F" }, { name: "Sapphire", code: "#0F52BA" }, { name: "Tan", code: "#D2B48C" }, 
  { name: "Aquamarine", code: "#7FFFD4" }, { name: "Azure", code: "#007FFF" }, { name: "Burgundy", code: "#800020" }, 
  { name: "Champagne", code: "#F7E7CE" }, { name: "Copper", code: "#B87333" }, { name: "Jade", code: "#00A86B" }, 
  { name: "Lime", code: "#BFFF00" }, { name: "Mustard", code: "#FFDB58" }, { name: "Periwinkle", code: "#CCCCFF" }, 
  { name: "Ruby", code: "#E0115F" }, { name: "Salmon", code: "#FA8072" }, { name: "Scarlet", code: "#FF2400" }, 
  { name: "Slate", code: "#708090" }, { name: "Tangerine", code: "#F28500" }, { name: "Topaz", code: "#FFC87C" }, 
  { name: "Ultramarine", code: "#3F00FF" }, { name: "Vermilion", code: "#E34234" }
];

const shopTypeData = [
  { value: "formal wear", item: 'Formal Wear' }, { value: "everyday wear", item: 'EveryDay Wear' }, 
  { value: "designer wear", item: 'Designer Wear' }, { value: "street wear", item: 'Street Wear' }, 
  { value: "trending", item: 'Trending' }, { value: "new", item: 'New' }
];

// Different size options based on product type
const sizeOptions = {
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
 
  oneSize: [
    { value: "No-size", label: " " }
  ]
};

interface category { category: string; value: string; }
interface subCategory { category: string; subCategory: string; value: string; }
type Specification = { question: string; answer: string; };

// Enhanced variant interface with individual size quantities
interface VariantWithSizes {
  title: string;
  color: string;
  description: string;
  image: string[];
  sku: string;
  sizeQuantities: { [size: string]: number }; // Each size has its own quantity
}

const ProductCodeAndPrice = () => {
  const [value, setValue] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeQuantities, setSizeQuantities] = useState<{ [size: string]: number }>({});
  const [image, setImage] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState("");
  const [variants, setVariants] = useState<VariantWithSizes[]>([]);
  const [subCategory, setSubCategory] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<category[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<subCategory[]>([]);
  const [specification, setSpecification] = useState({ question: "", answer: "" });
  const [specificationArray, setSpecificationArray] = useState<Specification[]>([]);
  const [specificationArray1, setSpecificationArray1] = useState<string[]>([]);
  const [specificationString, setSpecificationString] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopType, setShopType] = useState<any[]>([]);
  const [sizeType, setSizeType] = useState<keyof typeof sizeOptions>("shirts");
  const [usedSkus, setUsedSkus] = useState<Set<string>>(new Set());
  
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const token = getCookie();

  const onChange = (e: string | undefined) => {
    if (e && e.length > 3000) {
      return;
    }
    if (e !== undefined) {
      setValue(e);
    }
  };

  const handleInputChangeFinalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value > 100000) {
      return;
    }
    setFinalPrice(e.target.value);
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
        const convertedImage = await convertToJPEG(file) as Blob;
        const formData = new FormData();
        formData.append("image", convertedImage, 'image.jpg');
        const res = await Api.uploadSingleImage(formData);
        updatedImages.push(res.data.imageUrl);
      }
      
      setImage(prevImages => [...prevImages, ...updatedImages]);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleValidSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!category) {
      return toast.error("Category is required");
    }
    if (!subCategory.length) {
      return toast.error("Sub Category is required");
    }
    if (!price) {
      return toast.error("Price is required");
    }
    if (!finalPrice) {
      return toast.error("Selling price is required");
    }
    if (!brand) {
      return toast.error("Brand is required");
    }
    if (variants.length === 0) {
      return toast.error("At least one variant is required");
    }

    // Convert variants to the format expected by the API
    const processedVariants = variants.flatMap(variant => 
      Object.entries(variant.sizeQuantities)
        .filter(([size, quantity]) => quantity > 0)
        .map(([size, quantity]) => ({
          title: variant.title,
          description: variant.description,
          color: variant.color,
          size: size,
          image: variant.image,
          quantity: quantity,
          sku: `${variant.sku}-${size}` // Unique SKU for each size
        }))
    );

    const payLoad = {
      brand, 
      category, 
      shopType, 
      finalPrice, 
      variants: processedVariants, 
      type: category, 
      subCategory: subCategory, 
      specificationArray, 
      price, 
      specificationSingleLine: specificationArray1
    };

    try {
      const res = await Api.createProduct(payLoad, token);
      console.log(res);
      resetForm();
      return toast.success("Product created successfully");
    } catch (error: any) {
      console.log(error);
      return toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleAddVariants = () => {
    if (!title) {
      return toast.error("Please enter product title");
    }
    if (!value) {
      return toast.error("Please enter product description");
    }
    if (!sku) {
      return toast.error("Please enter product SKU");
    }
    if (usedSkus.has(sku)) {
      return toast.error("SKU already exists. Please use a different SKU");
    }
    if (image.length < 1) {
      return toast.error("Please select at least one image");
    }
    if (selectedSizes.length === 0) {
      return toast.error("Please select at least one size");
    }
    if (Object.keys(sizeQuantities).length === 0 || 
        Object.values(sizeQuantities).every(q => q === 0)) {
      return toast.error("Please set quantity for at least one size");
    }

    // Filter size quantities to only include selected sizes with quantities > 0
    const filteredSizeQuantities = Object.fromEntries(
      Object.entries(sizeQuantities).filter(([size, quantity]) => 
        selectedSizes.includes(size) && quantity > 0
      )
    );

    const newVariant: VariantWithSizes = {
      title,
      description: value,
      color: color || "No Color", // Allow variants without color
      image,
      sku,
      sizeQuantities: filteredSizeQuantities
    };

    setVariants([...variants, newVariant]);
    setUsedSkus(prev => new Set([...Array.from(prev), sku]));
    
    // Reset variant form
    setImage([]);
    setSelectedSizes([]);
    setSizeQuantities({});
    setColor("");
    setTitle("");
    setSku("");
    setValue("");
  };

  const removeVariant = (index: number) => {
    const removedVariant = variants[index];
    setUsedSkus(prev => {
      const newSet = new Set(prev);
      newSet.delete(removedVariant.sku);
      return newSet;
    });
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes(prev => [...prev, size]);
      setSizeQuantities(prev => ({ ...prev, [size]: 1 }));
    } else {
      setSelectedSizes(prev => prev.filter(s => s !== size));
      setSizeQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[size];
        return newQuantities;
      });
    }
  };

  const handleQuantityChange = (size: string, quantity: number) => {
    if (quantity < 0 || quantity > 999) return;
    setSizeQuantities(prev => ({ ...prev, [size]: quantity }));
  };

  const fetchDataCategory = async () => {
    try {
      const getData = await Api.getCategory();
      setCategoryData(getData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataSubCategoryByCategory = async (name: any) => {
    try {
      const getData = await Api.getSubCategoryByCategoryName(name);
      setSubCategoryData(getData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddSpecification = () => {
    if (!specification.question) {
      return toast.error("Please enter product specification name");
    }
    if (!specification.answer) {
      return toast.error("Please enter product specification value");
    }

    setSpecificationArray([...specificationArray, { question: specification.question, answer: specification.answer }]);
    setSpecification({ question: "", answer: "" });
  };

  const handleBulletPoints = () => {
    if (!specificationString) {
      toast.error("Please enter a valid product specification bullet point.");
      return;
    }

    setSpecificationArray1([...specificationArray1, specificationString]);
    setSpecificationString("");
  };

  const resetForm = () => {
    setValue("");
    setSku("");
    setTitle("");
    setBrand("");
    setPrice("");
    setCategory("");
    setSubCategory([]);
    setFinalPrice("");
    setVariants([]);
    setSpecificationArray([]);
    setSpecification({ question: "", answer: "" });
    setSpecificationString('');
    setSpecificationArray1([]);
    setShopType([]);
    setImage([]);
    setSelectedSizes([]);
    setSizeQuantities({});
    setColor("");
    setUsedSkus(new Set());
  };

  return (
    <>
      <Form onSubmit={handleValidSubmit} className="form-label-center">
        {/* Category Selection */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Category:</Label>
            </Col>
            <Col lg="9">
              <Input
                onClick={fetchDataCategory}
                type="select"
                name="category"
                value={category}
                onChange={(e: any) => {
                  setSubCategory([]);
                  fetchDataSubCategoryByCategory(e.target.value);
                  setCategory(e.target.value);
                }}
              >
                <option value="" disabled>Select Category</option>
                {categoryData.map((data, index) => (
                  <option key={index} value={data.value} className="text-capitalize">
                    {data.category}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
        </FormGroup>

        {/* SubCategory Selection */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">SubCategory:</Label>
            </Col>
            <Col lg="9">
              {subCategoryData.map((data, index) => (
                <FormGroup check inline key={index}>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="subcategory"
                      value={data.value}
                      checked={subCategory.includes(data.value)}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          setSubCategory([e.target.value]);
                        }
                      }}
                    />
                    {" "}{data.subCategory}
                  </Label>
                </FormGroup>
              ))}
            </Col>
          </Row>
        </FormGroup>

        {/* Classification */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Classification:</Label>
            </Col>
            <Col lg="9">
              {shopTypeData.map((data, index) => (
                <FormGroup check inline key={index}>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="shoppingType"
                      value={data.value}
                      checked={shopType.includes(data.value)}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          setShopType([...shopType, e.target.value]);
                        } else {
                          setShopType(shopType.filter((val) => val !== e.target.value));
                        }
                      }}
                    />
                    {" "}{data.item}
                  </Label>
                </FormGroup>
              ))}
            </Col>
          </Row>
        </FormGroup>

        {/* MRP */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">MRP:</Label>
            </Col>
            <Col lg="9">
              <Input
                onChange={(e: any) => {
                  if (e.target.value > 100000) return;
                  setPrice(e.target.value);
                }}
                value={price}
                min="1"
                max="100000"
                name="price"
                type="number"
                required
              />
            </Col>
          </Row>
        </FormGroup>

        {/* Selling Price */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Selling Price:</Label>
            </Col>
            <Col lg="9">
              <Input
                onChange={handleInputChangeFinalPrice}
                value={finalPrice}
                name="finalPrice"
                type="number"
                required
              />
            </Col>
          </Row>
        </FormGroup>

        {/* Brand Name */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Brand Name:</Label>
            </Col>
            <Col lg="9">
              <Input
                onChange={(e: any) => setBrand(e.target.value)}
                value={brand}
                name="brand"
                type="text"
                required
                maxLength={50}
              />
            </Col>
          </Row>
        </FormGroup>

        {/* Product Specifications */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Product Specification:</Label>
            </Col>
            <Col lg="9">
              <div style={{ display: "flex", gap: "10px" }}>
                <Input
                  placeholder="Regular Fit"
                  onChange={(e: any) => setSpecification({ ...specification, question: e.target.value })}
                  value={specification.question}
                  type="text"
                  maxLength={100}
                />
                <Input
                  onChange={(e: any) => setSpecification({ ...specification, answer: e.target.value })}
                  maxLength={250}
                  placeholder="Long Sleeve"
                  value={specification.answer}
                  type="text"
                />
              </div>
            </Col>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div className="offset-xl-7 offset-sm-4 mt-3">
                <Button onClick={handleAddSpecification} style={{ color: "white", backgroundColor: "green" }}>
                  Add
                </Button>
                <span>
                  <Button
                    onClick={() => {
                      setSpecificationArray([]);
                      setSpecification({ question: "", answer: "" });
                    }}
                    type="button"
                    color="primary"
                  >
                    Discard
                  </Button>
                </span>
              </div>
            </div>
          </Row>
        </FormGroup>

        {/* Display Added Specifications */}
        {specificationArray.map((data, index) => (
          <Row className="mb-3" key={index}>
            <Col xl="3" sm="4">
              <Label className="fw-bold mb-0">Question:</Label>
            </Col>
            <Col sm="7" xl="8">
              {data.question}
              <XCircle
                style={{ position: "relative", top: "5px", left: "20px", cursor: "pointer" }}
                onClick={() => setSpecificationArray(prevArray => prevArray.filter((_, i) => i !== index))}
              />
            </Col>
            <Col xl="3" sm="4">
              <Label className="fw-bold mb-0">Answer:</Label>
            </Col>
            <Col sm="7" xl="8">
              {data.answer}
            </Col>
          </Row>
        ))}

        {/* Bullet Point Specifications */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Key Feature:</Label>
            </Col>
            <Col lg="9">
              <Input
                placeholder="Composition of materials specified."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecificationString(e.target.value)}
                value={specificationString}
                type="text"
                maxLength={250}
              />
            </Col>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div className="offset-xl-7 offset-sm-4 mt-3">
                <Button style={{ marginRight: "5px" }} onClick={handleBulletPoints} type="button" color="secondary">
                  Add
                </Button>
                <span>
                  <Button
                    onClick={() => {
                      setSpecificationArray1([]);
                      setSpecificationString("");
                    }}
                    type="button"
                    color="primary"
                  >
                    Discard
                  </Button>
                </span>
              </div>
            </div>
          </Row>
        </FormGroup>

        {/* Display Bullet Points */}
        {specificationArray1.map((data, index) => (
          <Row className="mb-3" key={index}>
            <Col sm="7" xl="8">
              {data}
              <XCircle
                style={{ position: "relative", top: "5px", left: "20px", cursor: "pointer" }}
                onClick={() => setSpecificationArray1(prevArray => prevArray.filter((_, i) => i !== index))}
              />
            </Col>
          </Row>
        ))}

        {/* Display Added Variants */}
        <div style={{ marginTop: "20px" }}>
          {variants.map((variant, index) => (
            <div className="offset-xl-3" key={index}>
              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Product Title:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {variant.title}
                </Col>
                <Col sm="2" xl="1">
                  <XCircle
                    onClick={() => removeVariant(index)}
                    style={{ position: "relative", top: "5px", left: "20px", cursor: "pointer" }}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Product Details:</Label>
                </Col>
                <Col sm="7" xl="8">
                  <div dangerouslySetInnerHTML={{ __html: variant.description }} />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Product SKU:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {variant.sku}
                </Col>
              </Row>

              {variant.color !== "No Color" && (
                <Row className="mb-3">
                  <Col xl="3" sm="4">
                    <Label className="fw-bold mb-0">Color:</Label>
                  </Col>
                  <Col sm="7" xl="8">
                    <div style={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: variant.color,
                      borderRadius: "50px",
                      border: "1px solid"
                    }}></div>
                  </Col>
                </Row>
              )}

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Size & Quantities:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {Object.entries(variant.sizeQuantities).map(([size, quantity]) => (
                    <span key={size} style={{ marginRight: "15px" }}>
                      {size}: {quantity}
                    </span>
                  ))}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Images:</Label>
                </Col>
                <Col style={{ gap: "20px", display: "flex", flexWrap: "wrap" }} sm="7" xl="8">
                  {variant.image.map((img, idx) => (
                    <img
                      alt=""
                      key={idx}
                      src={img || `${ImagePath}/dashboard/user.png`}
                      style={{ width: 150, height: 100 }}
                    />
                  ))}
                </Col>
              </Row>
              <hr />
            </div>
          ))}
        </div>

        <hr />

        {/* Product Variant Form */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Product Title:</Label>
            </Col>
            <Col lg="9">
              <Input
                onChange={(e: any) => setTitle(e.target.value)}
                value={title}
                type="text"
                maxLength={200}
              />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold">Product Details:</Label>
            </Col>
            <Col lg="9" className="description-sm">
              <MDEditor preview="edit" value={value} onChange={(e: any) => onChange(e)} />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Product SKU:</Label>
            </Col>
            <Col lg="9">
              <Input
                onChange={(e: any) => setSku(e.target.value)}
                value={sku}
                type="text"
                maxLength={50}
                placeholder="Enter unique SKU"
              />
              {usedSkus.has(sku) && sku && (
                <small className="text-danger">This SKU is already used</small>
              )}
            </Col>
          </Row>
        </FormGroup>

        {/* Color Selection (Optional) */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Color (Optional):</Label>
            </Col>
            <Col lg="9">
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                  {color ? (
                    <>
                      <span style={{
                        backgroundColor: color,
                        height: '20px',
                        width: '20px',
                        display: 'inline-block',
                        borderRadius: '50%',
                        marginRight: '8px',
                        marginLeft: "-6px"
                      }}></span>
                      {colorData.find(c => c.code === color)?.name}
                    </>
                  ) : (
                    'Select a color (Optional)'
                  )}
                </DropdownToggle>
                <DropdownMenu style={{ height: "50vh", overflow: "auto" }}>
                  <DropdownItem onClick={() => setColor("")}>
                    No Color
                  </DropdownItem>
                  {colorData.map(colorItem => (
                    <DropdownItem
                      style={{ display: "flex" }}
                      key={colorItem.code}
                      onClick={() => setColor(colorItem.code)}
                    >
                      <span style={{
                        backgroundColor: colorItem.code,
                        height: '20px',
                        width: '20px',
                        display: 'inline-block',
                        borderRadius: '50%',
                        marginRight: '8px'
                      }}></span>
                      <div style={{ position: "relative", top: "-2px" }}>{colorItem.name}</div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </FormGroup>

        {/* Size Type Selection */}
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

        {/* Size and Quantity Selection */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Select Sizes & Quantities:</Label>
            </Col>
            <Col lg="9">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                {sizeOptions[sizeType].map((sizeOption) => (
                  <div key={sizeOption.value} style={{ 
                    border: "1px solid #ddd", 
                    padding: "10px", 
                    borderRadius: "5px",
                    backgroundColor: selectedSizes.includes(sizeOption.value) ? "#f8f9fa" : "white"
                  }}>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={selectedSizes.includes(sizeOption.value)}
                          onChange={(e) => handleSizeChange(sizeOption.value, e.target.checked)}
                        />
                        {" "}<strong>Size: {sizeOption.label}</strong>
                      </Label>
                    </FormGroup>
                    
                    {selectedSizes.includes(sizeOption.value) && (
                      <div style={{ marginTop: "8px" }}>
                        <Label style={{ fontSize: "12px", marginBottom: "5px" }}>Quantity:</Label>
                        <InputGroup size="sm">
                          <Button
                            size="sm"
                            color="outline-secondary"
                            onClick={() => handleQuantityChange(
                              sizeOption.value, 
                              Math.max(0, (sizeQuantities[sizeOption.value] || 0) - 1)
                            )}
                          >
                            -
                          </Button>
                          <Input
                            style={{ textAlign: "center" }}
                            type="number"
                            min="0"
                            max="999"
                            value={sizeQuantities[sizeOption.value] || 0}
                            onChange={(e) => handleQuantityChange(
                              sizeOption.value, 
                              parseInt(e.target.value) || 0
                            )}
                          />
                          <Button
                            size="sm"
                            color="outline-secondary"
                            onClick={() => handleQuantityChange(
                              sizeOption.value, 
                              Math.min(999, (sizeQuantities[sizeOption.value] || 0) + 1)
                            )}
                          >
                            +
                          </Button>
                        </InputGroup>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Size Summary */}
              {selectedSizes.length > 0 && (
                <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#e9ecef", borderRadius: "5px" }}>
                  <strong>Selected Sizes Summary:</strong>
                  <div style={{ marginTop: "5px" }}>
                    {selectedSizes.map(size => (
                      <span key={size} style={{ 
                        display: "inline-block", 
                        margin: "2px 5px", 
                        padding: "2px 8px", 
                        backgroundColor: "#007bff", 
                        color: "white", 
                        borderRadius: "3px",
                        fontSize: "12px"
                      }}>
                        {sizeOptions[sizeType].find(s => s.value === size)?.label}: {sizeQuantities[size] || 0}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: "5px", fontSize: "14px" }}>
                    <strong>Total Quantity: {Object.values(sizeQuantities).reduce((sum, qty) => sum + (qty || 0), 0)}</strong>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>

        {/* Image Upload */}
        <Col className="offset-xl-3 offset-sm-4 mb-3 image-file">
          <ul className="file-upload-product">
            <div className="box-input-file">
              <Input
                accept="image/*"
                multiple
                className="upload"
                type="file"
                onChange={handleImgChange}
              />
              Upload Photos
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px", flexWrap: "wrap" }}>
              {image.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    alt=""
                    src={img || `${ImagePath}/dashboard/user.png`}
                    style={{ width: 150, height: 100 }}
                  />
                  <XCircle
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      borderRadius: "50%"
                    }}
                    onClick={() => setImage(prevArray => prevArray.filter((_, i) => i !== index))}
                  />
                </div>
              ))}
            </div>
          </ul>
        </Col>

        {/* Add Variant Button */}
        <div className="offset-xl-3 offset-sm-4 mb-3">
          <Button onClick={handleAddVariants} type="button" color="primary">
            {variants.length >= 1 ? "Add More Variants" : "Add Variant"}
          </Button>
        </div>

        {/* Form Actions */}
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div>
            <Button style={{ marginRight: "7px" }} type="submit" color="success">
              Create Product
            </Button>
            <span>
              <Button onClick={resetForm} type="button" color="secondary">
                Reset Form
              </Button>
            </span>
          </div>
        </div>
      </Form>

      <Toaster position="top-center" reverseOrder={false} />
      <ToastContainer />
    </>
  );
};

export default ProductCodeAndPrice;