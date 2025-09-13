"use client";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "@/Components/Cookies";
import { Button, Col, Container, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row, FormGroup, Input, Label, Card, CardBody, CardHeader } from "reactstrap";
import Api from "../../../../Components/Api/index";
import { toast, Toaster } from "react-hot-toast";
import convertToJPEG from "@/Components/imageConvertor";
import { XCircle, Plus, Eye, Edit, Trash2 } from "react-feather";
import { Banner } from "@/Types/banners";

// Table row data with Click Action properly displayed
type HomeTableRowData = {
  Image: JSX.Element;
  "Banner ID": string;
  Title: string;
  Priority: number;
  "Click Action": JSX.Element;
  "Created Date": string;
  Actions: JSX.Element;
};

const HomeBannerList = () => {
  const [bannerData, setBannerData] = useState<Banner[]>([]);
  const [filteredData, setFilteredData] = useState<HomeTableRowData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [subCategoryNames, setSubCategoryNames] = useState<{[key: string]: string}>({});
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Complete form state with click actions
  const [bannerForm, setBannerForm] = useState({
    title: "",
    priority: 1,
    image: "",
    clickAction: "none", // none, category, subcategory
    targetCategory: "",
    targetSubCategory: "",
  });

  const token = getCookie();

  useEffect(() => {
    fetchBanners();
    fetchCategories();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bannerData, categoryNames, subCategoryNames]);

  const fetchCategories = async () => {
    try {
      const res = await Api.getCategory();
      const categoriesData = res.data.data || [];
      
      setCategories(categoriesData);
     
      
      // Create a mapping of category IDs to names for quick lookup
      const nameMap: {[key: string]: string} = {};
      categoriesData.forEach((cat: any) => {
        nameMap[cat._id] = cat.name;
      });
      setCategoryNames(nameMap);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await Api.getsubCategory();
      const subCategoriesData = res.data.data || [];
      setSubCategories(subCategoriesData);
      
      // Create a mapping of subcategory IDs to names for quick lookup
      const nameMap: {[key: string]: string} = {};
      subCategoriesData.forEach((subCat: any) => {
        nameMap[subCat._id] = subCat.name;
      });
      setSubCategoryNames(nameMap);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  const applyFilters = () => {
    const tableData: HomeTableRowData[] = bannerData.map((item) => ({
      Image: (
        <div className="product-image-container">
          <img
           src={item.image ? item.image : "/placeholder-banner.jpg"}
            alt={item.title}
            className="banner-list-image"
            style={{
              width: 80,
              height: 50,
              objectFit: "cover",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
            }}
          />
        </div>
      ),
      "Banner ID": item._id || "no",
      Title: item.title || "No Title",
      Priority: item.priority || 0,
      "Click Action": (
        <div>
          {item.clickAction === "none" ? (
            <span className="badge badge-secondary">No Action</span>
          ) : item.clickAction === "category" ? (
            <div>
              <span className="badge badge-info">Category</span>
              <br />
              <small className="text-muted">
                {categoryNames[item.targetCategory] || "Unknown Category"}
              </small>
            </div>
          ) : item.clickAction === "subcategory" ? (
            <div>
              <span className="badge badge-warning">Subcategory</span>
              <br />
              <small className="text-muted">
                {subCategoryNames[item.targetSubCategory] || "Unknown Subcategory"}
              </small>
            </div>
          ) : (
            <span className="badge badge-secondary">-</span>
          )}
        </div>
      ),
      "Created Date": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
      Actions: (
        <div className="action-buttons">
          <Button
            color="primary"
            size="sm"
            className="me-2"
            onClick={() => openEditModal(item._id)}
          >
            <Edit size={16} />
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => openConfirmationModal(item._id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    }));

    setFilteredData(tableData);
  };

  const onCloseAddModal = () => {
    setOpenAdd(false);
    setEditId(null);
    resetForm();
  };

  const onOpenAddModal = () => {
    setOpenAdd(true);
  };

  const openConfirmationModal = (id: string) => {
    setSelectedId(id);
    setConfirmDelete(true);
  };

  const onCloseConfirmationModal = () => setConfirmDelete(false);

  const resetForm = () => {
    setBannerForm({
      title: "",
      priority: 1,
      image: "",
      clickAction: "none",
      targetCategory: "",
      targetSubCategory: "",
    });
    setImage("");
  };

  const fetchBanners = async () => {
    setTableLoading(true);
    try {
      const res = await Api.getAllBanners(token);
      setBannerData(res.data.data || []);
    } catch (error) {
      console.log("Error fetching home banners:", error);
      toast.error("Failed to fetch home banners");
    } finally {
      setTableLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await Api.deleteBanner(id, token);
      fetchBanners();
      toast.success("Home banner successfully deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete home banner");
    }
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete(selectedId);
      onCloseConfirmationModal();
    }
  };

  const openEditModal = async (id: string) => {
    try {
      const res = await Api.getBannerById(id, token);
      const banner = res.data.data;

      setBannerForm({
        title: banner.title || "",
        priority: banner.priority || 1,
        image: banner.image || "",
        clickAction: banner.clickAction || "none",
        targetCategory: banner.targetCategory || "",
        targetSubCategory: banner.targetSubCategory || "",
      });
      setImage(banner.image || "");
      setEditId(id);
      setOpenAdd(true);
    } catch (error) {
      console.log("Error fetching banner:", error);
      toast.error("Failed to fetch banner details");
    }
  };

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const file = e.target.files?.[0];
      if (!file) {
        toast.error("Please select a file to upload.");
        return;
      }

      // Support multiple file types (images, videos, gifs)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload an image, GIF, or video file");
        return;
      }

      // For images, convert to JPEG; for videos/GIFs, upload directly
      let fileToUpload = file;
      if (file.type.startsWith('image/') && file.type !== 'image/gif') {
        fileToUpload = await convertToJPEG(file) as File;
      }

      const formData = new FormData();
      formData.append("image", fileToUpload, file.name);

      const res = await Api.uploadSingleImage(formData);
      setImage(res.data.imageUrl);
      setBannerForm((prev) => ({ ...prev, image: res.data.imageUrl }));
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerForm.title) {
      return toast.error("Please enter banner title");
    }

    if (!image) {
      return toast.error("Please upload banner media");
    }

    // Validate click action requirements
    if (bannerForm.clickAction === "category" && !bannerForm.targetCategory) {
      return toast.error("Please select a category");
    }

    if (bannerForm.clickAction === "subcategory" && (!bannerForm.targetCategory || !bannerForm.targetSubCategory)) {
      return toast.error("Please select both category and subcategory");
    }

    try {
      const payload = {
        ...bannerForm,
        image: image,
        bannerType: "home", // Always home
        // Clean up payload based on click action
        ...(bannerForm.clickAction === "none" && {
          targetCategory: "",
          targetSubCategory: "",
        }),
        ...(bannerForm.clickAction === "category" && {
          targetSubCategory: "",
        }),
      };

      if (editId) {
        await Api.updateBanner(editId, payload, token);
        toast.success("Home banner updated successfully");
      } else {
        console.log()
        await Api.createBanner(payload, token);
        toast.success("Home banner created successfully");
      }

      fetchBanners();
      onCloseAddModal();
    } catch (error) {
      console.log("Error saving home banner:", error);
      toast.error("Failed to save home banner");
    }
  };

  // Get preview for different file types
  const getFilePreview = (url: string) => {
  if (!url) return null;

  if (url.includes('.mp4') || url.includes('.webm')) {
    return (
      <video
        src={url}
        className="img-fluid rounded shadow-sm"
        style={{ width: 400, height: 150, objectFit: "cover" }}
        controls
      />
    );
  }

  return (
    <img
      alt="Banner Preview"
      src={url}
      className="img-fluid rounded shadow-sm"
      style={{ width: 400, height: 150, objectFit: "cover" }}
    />
  );
};

  return (
    <>
      <Fragment>
        <CommonBreadcrumb title="Home Banner Management" parent="Marketing" />
        <Container fluid>
          <Row className="mb-4">
            <Col sm="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6>Home Page Banners (Carousel)</h6>
                    <Button color="primary" onClick={onOpenAddModal}>
                      <Plus size={16} className="me-1" />
                      Add Home Banner
                    </Button>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Manage carousel banners for the home page. Supports images, GIFs, and videos with navigation options to categories and subcategories.
                  </small>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm="12">
              <Card>
                <CardHeader className="pb-0 d-flex justify-content-between align-items-center">
                  <h5>Home Banners List ({filteredData.length})</h5>
                </CardHeader>
                <CardBody>
                  {tableLoading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="mt-2">Loading home banners...</p>
                    </div>
                  ) : filteredData && filteredData.length > 0 ? (
                    <Datatable
                      typeUse={"home-banner-list"}
                      myData={filteredData}
                      pageSize={10}
                      pagination={true}
                      handleDelete={openConfirmationModal}
                      openPopUp={openEditModal}
                      class="-striped -highlight"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="empty-state">
                        <Eye size={48} className="text-muted mb-3" />
                        <h6>No home banners found</h6>
                        <p className="text-muted">
                          No carousel banners have been created yet. Add your first banner to start the home page carousel.
                        </p>
                        <Button color="primary" onClick={onOpenAddModal}>
                          <Plus size={16} className="me-1" />
                          Add First Home Banner
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Toaster position="top-center" reverseOrder={false} />

        {/* Delete Confirmation Modal */}
        <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal} centered>
          <ModalHeader toggle={onCloseConfirmationModal}>
            <h5 className="modal-title f-w-600">
              <Trash2 className="me-2" size={20} />
              Confirm Deletion
            </h5>
          </ModalHeader>
          <ModalBody>
            <div className="text-center">
              <div className="icon-wrapper bg-danger-light mb-3 mx-auto" style={{ width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trash2 className="text-danger" size={24} />
              </div>
              <h6>Are you sure you want to delete this home banner?</h6>
              <p className="text-muted">This action cannot be undone. The banner will be permanently removed from the carousel.</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
            <Button color="secondary" onClick={onCloseConfirmationModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Add/Edit Banner Modal */}
        <Modal isOpen={openAdd} toggle={onCloseAddModal} size="lg" centered>
          <ModalHeader toggle={onCloseAddModal}>
            <h5 className="modal-title f-w-600">
              <Plus className="me-2" size={20} />
              {editId ? "Edit Home Banner" : "Add New Home Banner"}
            </h5>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <Label className="fw-bold">Banner Title:</Label>
                <Input
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm((prev) => ({ ...prev, title: e.target.value }))}
                  type="text"
                  placeholder="Enter banner title (e.g., 'Summer Sale')"
                  required
                />
              </FormGroup>

              <Row>
                <Col md="12">
                  <FormGroup className="mb-3">
                    <Label className="fw-bold">Priority:</Label>
                    <Input
                      type="number"
                      value={bannerForm.priority}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                      placeholder="1"
                      min="1"
                      max="10"
                      required
                    />
                    <small className="text-muted">Lower number = higher priority in carousel (1 = first)</small>
                  </FormGroup>
                </Col>
              </Row>

              {/* Click Action Section */}
              <FormGroup className="mb-3">
                <Label className="fw-bold">Click Action (Navigation):</Label>
                <Input
                  type="select"
                  value={bannerForm.clickAction}
                  onChange={(e) => setBannerForm((prev) => ({ 
                    ...prev, 
                    clickAction: e.target.value,
                    targetCategory: "",
                    targetSubCategory: ""
                  }))}
                >
                  <option value="none">No Action (Static Banner)</option>
                  <option value="category">Navigate to Category Page</option>
                  <option value="subcategory">Navigate to Subcategory Page</option>
                </Input>
                <small className="text-muted">Choose where users go when clicking this banner</small>
              </FormGroup>

              {/* Category Selection */}
              {bannerForm.clickAction === "category" && (
                <FormGroup className="mb-3">
                  <Label className="fw-bold">Select Target Category:</Label>
                  <Input
                    type="select"
                    value={bannerForm.targetCategory}
                    onChange={(e) => setBannerForm((prev) => ({ ...prev, targetCategory: e.target.value }))}
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </Input>
                </FormGroup>
              )}

              {/* Subcategory Selection */}
              {bannerForm.clickAction === "subcategory" && (
                <>
                  <FormGroup className="mb-3">
                    <Label className="fw-bold">Select Target Category:</Label>
                    <Input
                      type="select"
                      value={bannerForm.targetCategory}
                      onChange={(e) => setBannerForm((prev) => ({ 
                        ...prev, 
                        targetCategory: e.target.value, 
                        targetSubCategory: "" 
                      }))}
                      required
                    >
                      <option value="">Select category...</option>
                      {categories && categories.length > 0 ? (
                        categories.map(cat => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No categories available</option>
                      )}
                    </Input>
                    {categories.length === 0 && (
                      <small className="text-warning">
                        No categories found. Please ensure categories are created first.
                      </small>
                    )}
                  </FormGroup>
                  
                  <FormGroup className="mb-3">
                    <Label className="fw-bold">Select Target Subcategory:</Label>
                    <Input
                      type="select"
                      value={bannerForm.targetSubCategory}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, targetSubCategory: e.target.value }))}
                      required
                      disabled={!bannerForm.targetCategory}
                    >
                      <option value="">Select subcategory...</option>
                      {bannerForm.targetCategory && subCategories && subCategories.length > 0 ? (
                        subCategories
                          .filter(sub => sub.categoryId === bannerForm.targetCategory)
                          .map(sub => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))
                      ) : bannerForm.targetCategory ? (
                        <option disabled>No subcategories available for selected category</option>
                      ) : (
                        <option disabled>Please select a category first</option>
                      )}
                    </Input>
                    {bannerForm.targetCategory && subCategories.filter(sub => sub.categoryId === bannerForm.targetCategory).length === 0 && (
                      <small className="text-warning">
                        No subcategories found for selected category.
                      </small>
                    )}
                  </FormGroup>
                </>
              )}

              {/* Media Upload Section */}
              <FormGroup className="mb-4">
                <Label className="fw-bold">
                  Banner Media <span className="text-danger">*</span>:
                </Label>
                <div className="upload-section">
                  <div className="box-input-file mb-3">
                    <Input
                      accept="image/*,video/mp4,video/webm"
                      className="upload"
                      type="file"
                      onChange={handleImgChange}
                      disabled={isLoading}
                      id="home-banner-upload"
                    />
                    <Label htmlFor="home-banner-upload" className="upload-label">
                      {isLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="me-2" />
                          {image ? "Change Media" : "Upload Media"}
                        </>
                      )}
                    </Label>
                  </div>

                  {image && (
                    <div className="image-preview mt-3">
                      <div className="position-relative d-inline-block">
                        {getFilePreview(image)}
                        <Button
                          color="danger"
                          size="sm"
                          className="position-absolute"
                          style={{ top: "5px", right: "5px", padding: "4px 8px" }}
                          onClick={() => {
                            setImage("");
                            setBannerForm((prev) => ({ ...prev, image: "" }));
                          }}
                        >
                          <XCircle size={14} />
                        </Button>
                      </div>
                      <small className="text-success d-block mt-2">Current banner media for carousel</small>
                    </div>
                  )}

                  <small className="text-muted">
                    Supports: Images (JPG, PNG, WebP), GIFs, Videos (MP4, WebM). 
                    Recommended: 1200x400px for best carousel display.
                  </small>
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={onCloseAddModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  {editId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus size={16} className="me-1" />
                  {editId ? "Update Banner" : "Add Banner"}
                </>
              )}
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    </>
  );
};

export default HomeBannerList;