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
  { name: "Red", code: "#FF0000" },
  { name: "Orange", code: "#FFA500" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Green", code: "#008000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Purple", code: "#800080" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Brown", code: "#A52A2A" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Gray", code: "#808080" },
  { name: "Beige", code: "#F5F5DC" },
  { name: "Turquoise", code: "#40E0D0" },
  { name: "Cyan", code: "#00FFFF" },
  { name: "Magenta", code: "#FF00FF" },
  { name: "Lavender", code: "#E6E6FA" },
  { name: "Indigo", code: "#4B0082" },
  { name: "Maroon", code: "#800000" },
  { name: "Olive", code: "#808000" },
  { name: "Teal", code: "#008080" },
  { name: "Navy", code: "#000080" },
  { name: "Violet", code: "#EE82EE" },
  { name: "Silver", code: "#C0C0C0" },
  { name: "Gold", code: "#FFD700" },
  { name: "Charcoal", code: "#36454F" },
  { name: "Coral", code: "#FF7F50" },
  { name: "Crimson", code: "#DC143C" },
  { name: "Emerald", code: "#50C878" },
  { name: "Ivory", code: "#FFFFF0" },
  { name: "Khaki", code: "#F0E68C" },
  { name: "Mint", code: "#98FF98" },
  { name: "Peach", code: "#FFE5B4" },
  { name: "Plum", code: "#DDA0DD" },
  { name: "Rose", code: "#FF007F" },
  { name: "Sapphire", code: "#0F52BA" },
  { name: "Tan", code: "#D2B48C" }, { name: "Aquamarine", code: "#7FFFD4" },
  { name: "Azure", code: "#007FFF" },
  { name: "Burgundy", code: "#800020" },
  { name: "Champagne", code: "#F7E7CE" },
  { name: "Copper", code: "#B87333" },
  { name: "Jade", code: "#00A86B" },
  { name: "Lime", code: "#BFFF00" },
  { name: "Mustard", code: "#FFDB58" },
  { name: "Periwinkle", code: "#CCCCFF" },
  { name: "Ruby", code: "#E0115F" },
  { name: "Salmon", code: "#FA8072" },
  { name: "Scarlet", code: "#FF2400" },
  { name: "Slate", code: "#708090" },
  { name: "Tangerine", code: "#F28500" },
  { name: "Topaz", code: "#FFC87C" },
  { name: "Ultramarine", code: "#3F00FF" },
  { name: "Vermilion", code: "#E34234" }
];
const shopTypeData = [{value:"formal wear" ,item:'Formal Wear' } ,{value:"everyday wear" ,item:'EveryDay Wear' } ,{value:"designer wear" ,item:'Designer Wear' }  ,{value:"street wear" ,item:'Street Wear' } ,{value:"trending" ,item:'Trending' }]
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
type SpecificationOneLine = {
  input: string;

};


const ProductCodeAndPrice = () => {
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<any[]>([]);
  const [image, setImage] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState("")
  const [variants, setVariants] = useState<{ title: string; color: string, description: string; size: string; image: string[]; quantity: number; sku:string }[]>([]);
  const [subCategory, setSubCategory] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<category[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<subCategory[]>([]);
  const [specification, setSpecification] = useState({ question: "", answer: "" })
  const [specificationArray, setSpecificationArray] = useState<Specification[]>([]);
  const [specificationArray1, setSpecificationArray1] = useState<string[]>([]);
  const [specificationString, setSpecificationString] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopType, setShopType] = useState<any[]>([]);




  const toggle = () => setDropdownOpen(!dropdownOpen);
  const token = getCookie()

  const onChange = (e: string | undefined) => {
    if (e && e.length > 3000) {
      return;
    }
    if (e !== undefined) {
      setValue(e);
    }
  }
  const IncrementItem = () => {
    if (quantity < 25) {
      setQuantity(quantity + 1);
    } else {
      return null;
    }
  };
  const DecreaseItem = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    } else {
      return null;
    }
  };





  const handleChange = (event: any) => {
    setQuantity(event.target.value);
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
      console.log(updatedImages)
      setImage(prevImages => [...prevImages, ...updatedImages]);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };




  const handleValidSubmit = async (e: any) => {
    e.preventDefault();


    if (!category) {
      return toast.error("Category is required")
    }
    if (!subCategory.length) {
      return toast.error("Sub Category is required")
    }
    if (!price) {
      return toast.error("Price is required")
    }

    if (!finalPrice) {
      return toast.error("Selling price is required")
    }
    if (!brand) {
      return toast.error("Brand is required")
    }

    if (variants.length === 0) {
      return toast.error("Variants is required")
    }

    const payLoad = {
      brand, category, shopType, finalPrice, variants, type: category, subCategory: subCategory, specificationArray, price, specificationSingleLine: specificationArray1
    }

    try {

      const res = await Api.createProduct(payLoad, token)
      console.log(res)
      setValue("")
      setSku("")
      setTitle("")
      setBrand("")
      setPrice("")
      setCategory("")
      setSubCategory([])
      setFinalPrice("")
      setVariants([])
      setSpecificationArray([])
      setSpecification({ question: "", answer: "" })
      setSpecificationString('')
      setSpecificationArray1([])
      setShopType([])
      return toast.success("Product created successfully")

    } catch (error) {
      console.log(error)
      return toast.error(error?.data?.message)
    }

  };

  const handleAddVariants = () => {
   
 

    if (!title) {
      return toast.error("Please select title")
    }
    if (!value) {
      return toast.error("Please select description")
    }
    if (!color) {
      return toast.error("Please select color")
    }
    if (quantity === 0) {
      return toast.error("Please select quantity")
    }
    if (!size) {
      return toast.error("Please select size")
    }
    if (image.length < 1) {
      return toast.error("Please select image")
    }
    if (size && quantity) {
      let multipleVarientSize = size.map((item) => {
        return {
          title,
          description: value,
          color,
          size: item,
          image,
          quantity,sku
        }
      });
      setVariants([...variants, ...multipleVarientSize]);
      setImage([])
      setSize([]);
      setColor("");
      setTitle("")
      setSku("")
      setValue("")

      setQuantity(0)
    }
  };

  const fetchDataCategory = async () => {
    try {

      const getData = await Api.getCategory()
      setCategoryData(getData.data.data)
      console.log(getData);
    } catch (error) {
      return console.log(error);
    }
  }



  const fetchDataSubCategoryByCategory = async (name: any) => {
    try {

      const getData = await Api.getSubCategoryByCategoryName(name)
      setSubCategoryData(getData.data.data)
      console.log(getData);
    } catch (error) {
      return console.log(error);
    }
  }

  const handleAddSpecification = () => {
    if (!specification.question) {
      return toast.error("Please select product specification name")
    } else if (!specification.answer) {
      return toast.error("Please select product specification value")
    }

    setSpecificationArray([...specificationArray, { question: specification.question, answer: specification.answer }])
    setSpecification({ question: "", answer: "" })
  }


  const handleBulletPoints = () => {
    if (!specificationString) {
      toast.error("Please enter a valid product specification bullet point.");
      return;
    }

    setSpecificationArray1([...specificationArray1, specificationString]);
    setSpecificationString("");
  }
  const removeVariant = (index: any) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSize((prevSizes) => [...prevSizes, value]);
    } else {
      setSize((prevSizes) => prevSizes.filter((item) => item !== value));
    }
  };


  return (
    <>
      <Form onSubmit={handleValidSubmit} className=" form-label-center">
        <FormGroup className="mb-3">
          <Row>
            <Col lg="3"   >
              <Label className="fw-bold mb-0">Category:</Label>
            </Col>
            <Col lg="9">
              <Input
                onClick={() => {
                  fetchDataCategory()
                }} type="select" name="category" id="validationCustom03" value={category} onChange={(e: any) => {
                  setSubCategory([])
                  fetchDataSubCategoryByCategory(e.target.value)
                  setCategory(e.target.value)
                }} >
                <option value="" disabled selected={!category} >Select  Category</option>
                {
                  categoryData.map((data, index) => {
            
                    return (
                      <option value={data.value} className="text-capitalize" > {data.category} </option>
                    )
                  })
                }
              </Input>
            </Col>
            <div className="valid-feedback">Looks good!</div>
          </Row>
        </FormGroup>
        {/* <FormGroup className="mb-3">
          <Row>
            <Col lg="3"  >
              <Label className="fw-bold mb-0">SubCategory:</Label>
            </Col>
            <Col lg="9" >
              <Input onClick={() => {
                fetchDataSubCategoryByCategory(category)
              }} type="select" name="subcategory" id="validationCustom03" value={subCategory} onChange={(e: any) => {
                setSubCategory(e.target.value)
              }} >
                <option value="" disabled  >Select  Sub category</option>
                {
                  subCategoryData.map((data, index) => {
                    console.log(data);
                    return (
                      <option value={data.value} >{data.subCategory}</option>
                    )
                  })
                }
              </Input>
            </Col>
            <div className="valid-feedback">Looks good!</div>
          </Row>
        </FormGroup> */}



        <FormGroup className="mb-3">
  <Row>
    <Col lg="3">
      <Label className="fw-bold mb-0">SubCategory:</Label>
    </Col>
    <Col lg="9">
      {/* Render checkboxes instead of a single select dropdown */}
      {subCategoryData.map((data, index) => {
        return (
          <FormGroup check inline key={index}>
            <Label check>
              <Input
                type="checkbox"
                name="subcategory"
                value={data.value}
                checked={subCategory.includes(data.value)}
                onChange={(e: any) => {
                  if (e.target.checked) {
                    setSubCategory([ e.target.value]);
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
                checked={shopType.includes(data.value)}
                onChange={(e: any) => {
                  if (e.target.checked) {
                    setShopType([...shopType, e.target.value]);
                  } else {
                    setShopType(shopType.filter((val) => val !== e.target.value));
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
            <Col lg="3" >
              <Label className="fw-bold mb-0"> MRP :</Label>
            </Col>
            <Col lg="9" >
              <Input onChange={(e: any) => {
                if (e.target.value > 100000) {
                  return;
                }
                setPrice(e.target.value)
              }} value={price} className="mb-0" min="1"
                max="10000000" name="price" id="validationCustom02" type="number" required />
            </Col>
            <div className="valid-feedback">Looks good!</div>
          </Row>
        </FormGroup>

        <FormGroup className="mb-3 ">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Selling Price:</Label>
            </Col>
            <Col lg="9">
              <Input onChange={handleInputChangeFinalPrice} value={finalPrice} className="mb-0"
                name="finalPrice" id="validationCustom02" type="number" />
            </Col>
            <div className="valid-feedback">Looks good!</div>
          </Row>
        </FormGroup>

        <FormGroup className=" mb-3">
          <Row>
            <Col lg="3" >
              <Label className="fw-bold mb-0">Brand Name:</Label>
            </Col>
            <Col lg="9" >
              <Input onChange={(e: any) => {
                setBrand(e.target.value)
              }} value={brand} name="product_name" id="validationCustom01" type="text" required maxLength={50} />
            </Col>
          </Row>
          <div className="valid-feedback">Looks good!</div>
        </FormGroup>

     








        <FormGroup className=" mb-3">
          <Row>
            <Col xl="3" sm="4" lg='3' >
              <Label className="fw-bold mb-0">Product Specification:</Label>
            </Col>


            <Col lg='9' >

              <div style={{ display: "flex", gap: "10px" }}>
                <Input placeholder="Regular Fit" onChange={(e: any) => {
                  setSpecification({ ...specification, question: e.target.value })
                }} value={specification.question} name="product_name" id="validationCustom01" type="text" maxLength={100} />


                <Input onChange={(e: any) => {
                  setSpecification({ ...specification, answer: e.target.value })
                }} maxLength={250} placeholder="Long Sleeve" value={specification.answer} name="product_name" id="validationCustom01" type="text" />

              </div>


              {/* <div className="offset-xl-7 offset-sm-4 mt-3" >
        <Button onClick={()=>{
          handleAddSpecification()
        }}   >
          Add Specification 
        </Button>
        <Button onClick={() => {
          setSpecificationArray([])
          setSpecification({question:"" , answer:""})
        }} type="button" color="primary" >Discard</Button>
      </div>      */}

            </Col>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div className="offset-xl-7 offset-sm-4 mt-3" >
                <Button onClick={() => {
                  handleAddSpecification()
                }} style={{ color: "white", backgroundColor: "green" }}>
                  Add
                </Button>
                <span>  <Button onClick={() => {
                  setSpecificationArray([])
                  setSpecification({ question: "", answer: "" })
                }} type="button" color="primary">Discard</Button></span>

              </div></div>
          </Row>
          <div className="valid-feedback">Looks good!</div>
        </FormGroup>

        {specificationArray && specificationArray.map((data, index) => {
          return (
            <>
              <Row className="mb-3">
                <Col xl="3" sm="4" >
                  <Label className="fw-bold mb-0">Question:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {data.question}  <XCircle style={{ position: "relative", top: "5px", left: "20px", cursor: "pointer" }} onClick={() => {
                    setSpecificationArray(prevArray => prevArray.filter((_, i) => i !== index));
                  }} />
                </Col>

                <Col xl="3" sm="4" >
                  <Label className="fw-bold mb-0">Answer:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {data.answer}
                </Col>


              </Row>

            </>
          )
        })}

        <FormGroup className="mb-3">
          <Row>
            <Col lg='3'>
              <Label className="fw-bold mb-0">Product Bullet Point Specification:</Label>
            </Col>

            <Col lg='9'>
              <Input
                placeholder="Composition of materials specified."
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSpecificationString(e.target.value);
                }}
                value={specificationString}
                name="product_name"
                id="validationCustom01"
                type="text"
                maxLength={250}
              />
            </Col>


            <div style={{ display: "flex", justifyContent: "end" }}>
              <div className="offset-xl-7 offset-sm-4 mt-3">
                <Button style={{ marginRight: "5px" }}
                  onClick={handleBulletPoints}
                  type="button"
                  color="secondary"
                >
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


          <div className="valid-feedback">Looks good!</div>
        </FormGroup>

        {specificationArray1 && specificationArray1.map((data, index) => {
          return (
            <>
              <Row className="mb-3">
                <Col sm="7" xl="8">
                  {data} <  XCircle style={{ position: "relative", top: "5px", left: "20px", cursor: "pointer" }} onClick={() => {
                    setSpecificationArray1(prevArray => prevArray.filter((_, i) => i !== index));
                  }} />
                </Col>
              </Row>
            </>
          )
        })}



        <div style={{ marginTop: "20px" }}>
          {variants.map((v, index) => (
            <div className="offset-xl-3" key={index}>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Product Title:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {v.title}
                </Col>
                <Col sm="2" xl="1">

                  <XCircle onClick={() => removeVariant(index)} style={{ position: "relative", top: "5px", left: "20px", cursor: "pointer" }} />

                </Col>
              </Row>


              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Product Description:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {v.description}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Product SKU:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {v.sku}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Color:</Label>
                </Col>
                <Col sm="7" xl="8">
                  <div style={{ height: "20px", width: "20px", backgroundColor: v.color, borderRadius: "50px", border: "1px solid" }}></div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Size:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {v.size}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Total Products:</Label>
                </Col>
                <Col sm="7" xl="8">
                  {v.quantity}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Image:</Label>
                </Col>
                <Col style={{ gap: "20px", display: "flex", flexWrap: "wrap" }} sm="7" xl="8">
                  {v.image.length >= 1 && v.image.map((image, idx) => (
                    <img alt="" key={idx} src={image || `${ImagePath}/dashboard/user.png`} style={{ width: 150, height: 100 }} />
                  ))}
                </Col>
              </Row>

              <hr />
            </div>
          ))}
        </div>
        <hr />
        <FormGroup className=" mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Product Title:</Label>
            </Col>
            <Col lg='9'>
              <Input onChange={(e: any) => {
                setTitle(e.target.value)
              }} value={title} name="product_name" id="validationCustom01" type="text" maxLength={200} />
            </Col>
          </Row>
          <div className="valid-feedback">Looks good!</div>
        </FormGroup>



        <FormGroup className=" mb-3 ">
          <Row>
            <Col lg='3'>
              <Label className="fw-bold">Product Description:</Label>
            </Col>
            <Col lg='9' className=" description-sm">
              <MDEditor  preview="edit" value={value} onChange={(e: any) => {
                onChange(e)
              }} />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup className=" mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Product SKU:</Label>
            </Col>
            <Col lg='9'>
              <Input onChange={(e: any) => {
                setSku(e.target.value)
              }} value={sku} name="product_name" id="validationCustom01" type="text" maxLength={50} />
            </Col>
          </Row>
          <div className="valid-feedback">Looks good!</div>
        </FormGroup>

        {/* <FormGroup className=" mb-3">
      <Row>
        <Col xl="3" sm="4">
          <Label className="fw-bold mb-0">Product Code :</Label>
        </Col>
        <Col sm="7" xl="8">
          <Input name="product_code" id="validationCustomUsername" type="number" required />
        </Col>
        <div className="invalid-feedback offset-sm-4 offset-xl-3">Please choose Valid Code.</div>
      </Row>
    </FormGroup> */}
        <FormGroup className="mb-3">
          <Row>
            <Col lg='3'>
              <Label className="fw-bold mb-0">Color:</Label>
            </Col>
            <Col lg='9'>


              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                  {color ? (
                    <>
                      <span style={{ backgroundColor: color, height: '20px', width: '20px', display: 'inline-block', borderRadius: '50%', marginRight: '8px', marginLeft: "-6px" }}></span>


                      {colorData.find(c => c.code === color)?.name}

                    </>
                  ) : (
                    'Select a color'
                  )}
                </DropdownToggle>
                <DropdownMenu style={{ height: "50vh", overflow: "auto" }}>
                  {colorData.map(color => (
                    <DropdownItem style={{display:"flex"}} key={color.code} onClick={() => setColor(color.code)}>
                      <span style={{ backgroundColor: color.code, height: '20px', width: '20px', display: 'inline-block', borderRadius: '50%', marginRight: '8px' }}></span>
                     <div style={{position:"relative" , top:"-2px"}}> {color.name}</div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Col>
            <div className="valid-feedback">Looks good!</div>
          </Row>
        </FormGroup>

        <FormGroup className="mb-3">
          <Row>
            <Col lg="3">
              <Label className="fw-bold mb-0">Select Size:</Label>
            </Col>
            <Col lg="9">
              <UncontrolledDropdown>
                <DropdownToggle style={{ background: "#000000", color: "#fff" }} caret color="">
                  {size.length > 0 ? size.join(", ") : "Select size"}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem type="button" toggle={false}>
                    <Input
                      type="checkbox"
                      id="size-m"
                      value="m"
                      onChange={handleCheckboxChange}
                      checked={size.includes("m")}
                    />{" "}
                    <Label for="size-m">M</Label>
                  </DropdownItem>
                  <DropdownItem type="button" toggle={false}>
                    <Input
                      type="checkbox"
                      id="size-l"
                      value="l"
                      onChange={handleCheckboxChange}
                      checked={size.includes("l")}
                    />{" "}
                    <Label for="size-l">L</Label>
                  </DropdownItem>
                  <DropdownItem type="button" toggle={false}>
                    <Input
                      type="checkbox"
                      id="size-xl"
                      value="xl"
                      onChange={handleCheckboxChange}
                      checked={size.includes("xl")}
                    />{" "}
                    <Label for="size-xl">XL</Label>
                  </DropdownItem>
                  <DropdownItem type="button" toggle={false}>
                    <Input
                      type="checkbox"
                      id="size-xxl"
                      value="xxl"
                      onChange={handleCheckboxChange}
                      checked={size.includes("xxl")}
                    />{" "}
                    <Label for="size-xxl">XXL</Label>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
        </FormGroup>


        <FormGroup className=" mb-3">
          <Row>
            <Col xl="3" sm="4">
              <Label className=" fw-bold mb-0">Total Products:</Label>
            </Col>
            <fieldset className="qty-box ms-0">
              <InputGroup className="bootstrap-touchspin">
                <div className="input-group-prepend">
                  <Button color="primary" className=" btn-square bootstrap-touchspin-down" onClick={DecreaseItem}>
                    <i className="fa fa-minus"></i>
                  </Button>
                </div>
                <div className="input-group-prepend">
                  <InputGroupText className="bootstrap-touchspin-prefix"></InputGroupText>
                </div>
                <Input className="touchspin" type="text" value={quantity} onChange={handleChange} />
                <div className="input-group-append">
                  <InputGroupText className=" bootstrap-touchspin-postfix"></InputGroupText>
                </div>
                <div className="input-group-append ms-0">
                  <Button color="primary" className="btn-square bootstrap-touchspin-up" onClick={IncrementItem}>
                    <i className="fa fa-plus"></i>
                  </Button>
                </div>
              </InputGroup>
            </fieldset>
          </Row>
        </FormGroup>







        <Col className="offset-xl-3 offset-sm-4 mb-3 image-file">
          <ul className="file-upload-product">

            <div className="box-input-file">
              <Input accept="image/*" multiple className="upload" type="file" onChange={(e: any) => handleImgChange(e)} />
              Upload Photos


            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px", flexWrap: "wrap" }}>
              {image.length >= 1 && image.map((image, index) => {
                return (<> <img alt="" src={image ? image : `${ImagePath}/dashboard/user.png`} style={{ width: 150, height: 100 }} />
                  <  XCircle style={{ position: "relative", top: "5px", right: "20px", cursor: "pointer" }} onClick={() => {
                    setImage(prevArray => prevArray.filter((_, i) => i !== index));
                  }} /> </>

                )
              })}
            </div>

          </ul>
        </Col>
        <div className="offset-xl-3 offset-sm-4 mb-3">
          <Button onClick={handleAddVariants} type="button" color="primary">
            {variants.length >= 1 ? "Add More variants" : "Add Variant"}
          </Button>
        </div>





        <div style={{ display: "flex", justifyContent: "end" }}>

          <div className="">
            <Button style={{ marginRight: "7px" }} type="submit" color="secondary">
              Submit
            </Button>
            <span>
              <Button onClick={() => {
                setVariants([])
                setValue("")
                setQuantity(1)
                setColor('')
                setSize([])
                setImage([])
                setTitle("")
                setSku("")
                setBrand("")
                setPrice("")
                setCategory("")
                setFinalPrice("")
                setSubCategory([])
                setCategoryData([])
                setSpecification({ question: "", answer: "" })
                setSpecificationArray([])
                setSpecificationArray1([])
                setSpecificationString('')
                setSubCategoryData([])
                setShopType([])
              }} type="reset" color="primary">Discard</Button>
            </span>
          </div>
        </div>



      </Form>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <ToastContainer />
    </>

  );
};

export default ProductCodeAndPrice;
