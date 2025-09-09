"use client"
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "@/Components/Cookies";
import { Button, Col, Container, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row, FormGroup, Input, Label, Card, CardBody, CardHeader, } from "reactstrap";
import Api from "../../../../Components/Api/index";
import { toast, Toaster } from "react-hot-toast";
import convertToJPEG from "@/Components/imageConvertor";
import { XCircle, Plus, Eye, Edit, Trash2, Power, X } from "react-feather";

interface Banner {
    _id: string;
    title: string;
    image: string;
    bannerType: string;
    category?: string;
    subCategory?: string;
    isActive: boolean;
    priority: number;
    link?: string;
    createdAt: string;
    updatedAt: string;
}

interface Category {
    category: string;
    value: string;
}

interface SubCategory {
    category: string;
    subCategory: string;
    value: string;
}

const bannerTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "home", label: "Home Page" },
    { value: "category", label: "Category Page" },
    { value: "subcategory", label: "SubCategory Page" }
];

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" }
];

const BannerList = () => {
    const [bannerData, setBannerData] = useState<Banner[]>([]);
    const [filteredData, setFilteredData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [image, setImage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        bannerType: "all",
        status: "all",
        category: "all",
        search: ""
    });

    // Form state for add/edit banner
    const [bannerForm, setBannerForm] = useState({
        title: "",
        bannerType: "home",
        category: "",
        subCategory: "",
        isActive: true,
        priority: 1,
        link: "",
        image: ""
    });

    const token = getCookie();

    useEffect(() => {
        fetchBanners();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [bannerData, filters]);

    const applyFilters = () => {
        let filtered = bannerData.filter(item => {
            const banner = bannerData.find(b => b._id === item["Banner ID"]);
            if (!banner) return true;

            // Filter by banner type
            if (filters.bannerType !== "all" && banner.bannerType !== filters.bannerType) {
                return false;
            }

            // Filter by status
            if (filters.status !== "all" && banner.isActive.toString() !== filters.status) {
                return false;
            }

            // Filter by category (only for category and subcategory banners)
            if (filters.category !== "all" && banner.category !== filters.category) {
                return false;
            }

            // Search filter
            if (filters.search && !banner.title.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            return true;
        });

        setFilteredData(filtered);
    };

    const onCloseModal = () => {
        setOpen(false);
        setSelectedBanner(null);
        resetForm();
    };

    const onOpenModal = () => {
        setOpen(true);
    };

    const onCloseAddModal = () => {
        setOpenAdd(false);
        resetForm();
    };

    const onOpenAddModal = () => {
        setOpenAdd(true);
    };

    const onCloseViewModal = () => {
        setOpenView(false);
        setSelectedBanner(null);
    };

    const openConfirmationModal = (id: string) => {
        setSelectedId(id);
        setConfirmDelete(true);
    };

    const onCloseConfirmationModal = () => setConfirmDelete(false);

    const resetForm = () => {
        setBannerForm({
            title: "",
            bannerType: "home",
            category: "",
            subCategory: "",
            isActive: true,
            priority: 1,
            link: "",
            image: ""
        });
        setImage("");
    };

    const fetchBanners = async () => {
        setTableLoading(true);
        const storeData = [];
        try {
            const res = await Api.getAllBanners();

            res.data.data.forEach((item) => {
                const newObject = {
                    Image: (
                        <div className="product-image-container">
                            <img
                                src={item.image || "/placeholder-banner.jpg"}
                                alt={item.title}
                                className="banner-list-image"
                                style={{
                                    width: 80,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #dee2e6"
                                }}
                                onError={(e) => {
                                    e.target.src = "/placeholder-banner.jpg";
                                }}
                            />
                        </div>
                    ),
                    "Banner ID": item._id || "no",
                    Title: (
                        <div className="banner-title-cell">
                            <span className="banner-title">{item.title || "No Title"}</span>
                            <small className="text-muted d-block">
                                {item.link && (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="banner-link">
                                        🔗 View Link
                                    </a>
                                )}
                            </small>
                        </div>
                    ),
                    Type: (
                        <span className={`badge badge-${getBannerTypeBadge(item.bannerType)}`}>
                            {item.bannerType?.toUpperCase() || "HOME"}
                        </span>
                    ),
                    Category: item.category || "N/A",
                    SubCategory: item.subCategory || "N/A",
                    Status: (
                        <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                    ),
                    Priority: (
                        <span className="priority-badge">
                            #{item.priority || 1}
                        </span>
                    ),
                    "Created Date": new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }),
                    Actions: item._id || "no",
                };
                storeData.push(newObject);
            });

            setBannerData(res.data.data);
        } catch (error) {
            console.log("Error fetching banners:", error);
            toast.error("Failed to fetch banners");
        } finally {
            setTableLoading(false);
        }
    };

    const getBannerTypeBadge = (type) => {
        switch (type) {
            case 'home': return 'primary';
            case 'category': return 'info';
            case 'subcategory': return 'warning';
            default: return 'secondary';
        }
    };

    const fetchCategories = async () => {
        try {
            const getData = await Api.getCategory();
            setCategoryData(getData.data.data);
        } catch (error) {
            console.log("Error fetching categories:", error);
        }
    };

    const fetchSubCategoriesByCategory = async (categoryName) => {
        try {
            const getData = await Api.getSubCategoryByCategoryName(categoryName);
            setSubCategoryData(getData.data.data);
        } catch (error) {
            console.log("Error fetching subcategories:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await Api.deleteBanner(id, { headers: { Authorization: `Bearer ${token}` } });
            fetchBanners();
            toast.success("Banner successfully deleted");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete banner");
        }
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            handleDelete(selectedId);
            onCloseConfirmationModal();
        }
    };

    const openEditModal = async (id) => {
        try {
            const res = await Api.getBannerById(id);
            const banner = res.data.data;

            setBannerForm({
                title: banner.title || "",
                bannerType: banner.bannerType || "home",
                category: banner.category || "",
                subCategory: banner.subCategory || "",
                isActive: banner.isActive || true,
                priority: banner.priority || 1,
                link: banner.link || "",
                image: banner.image || ""
            });
            setImage(banner.image || "");
            setSelectedBanner(banner);

            if (banner.category) {
                fetchSubCategoriesByCategory(banner.category);
            }

            onOpenModal();
        } catch (error) {
            console.log("Error fetching banner:", error);
            toast.error("Failed to fetch banner details");
        }
    };

    const openViewModal = async (id) => {
        try {
            const res = await Api.getBannerById(id);
            const banner = res.data.data;
            setSelectedBanner(banner);
            setOpenView(true);
        } catch (error) {
            console.log("Error fetching banner:", error);
            toast.error("Failed to fetch banner details");
        }
    };

    const handleImgChange = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const file = e.target.files[0];
            if (!file) {
                toast.error("Please select an image to upload.");
                return;
            }

            const convertedImage = await convertToJPEG(file);
            const formData = new FormData();
            formData.append("image", convertedImage, "banner.jpg");

            const res = await Api.uploadSingleImage(formData);
            setImage(res.data.imageUrl);
            setBannerForm(prev => ({ ...prev, image: res.data.imageUrl }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bannerForm.title) {
            return toast.error("Please enter banner title");
        }

        if (!image) {
            return toast.error("Please upload banner image");
        }

        try {
            const payload = {
                ...bannerForm,
                image: image
            };

            if (selectedBanner) {
                await Api.updateBanner(selectedBanner._id, payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Banner updated successfully");
            } else {
                await Api.createBanner(payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Banner created successfully");
            }

            fetchBanners();
            onCloseModal();
            onCloseAddModal();
        } catch (error) {
            console.log("Error saving banner:", error);
            toast.error("Failed to save banner");
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            await Api.updateBannerStatus(id, { isActive: !currentStatus }, { headers: { Authorization: `Bearer ${token}` } });
            fetchBanners();
            toast.success("Banner status updated successfully");
        } catch (error) {
            console.log("Error updating status:", error);
            toast.error("Failed to update banner status");
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            bannerType: "all",
            status: "all",
            category: "all",
            search: ""
        });
    };

    const getActiveBannerCount = () => {
        return bannerData.filter(banner => banner.isActive).length;
    };

    const getInactiveBannerCount = () => {
        return bannerData.filter(banner => !banner.isActive).length;
    };

    return (
        <>
            <Fragment>
                <CommonBreadcrumb title="Banner Management" parent="Marketing" />
                <Container fluid>
                    {/* Stats Cards */}
                    <Row className="mb-4">
                        <Col xl="3" md="6">
                            <Card className="stats-card">
                                <CardBody>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h6 className="text-muted mb-1">Total Banners</h6>
                                            <h3 className="mb-0">{bannerData.length}</h3>
                                        </div>
                                        <div className="icon-wrapper bg-primary-light">
                                            <Eye className="text-primary" size={24} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl="3" md="6">
                            <Card className="stats-card">
                                <CardBody>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h6 className="text-muted mb-1">Active Banners</h6>
                                            <h3 className="mb-0 text-success">{getActiveBannerCount()}</h3>
                                        </div>
                                        <div className="icon-wrapper bg-success-light">
                                            <Power className="text-success" size={24} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl="3" md="6">
                            <Card className="stats-card">
                                <CardBody>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h6 className="text-muted mb-1">Inactive Banners</h6>
                                            <h3 className="mb-0 text-danger">{getInactiveBannerCount()}</h3>
                                        </div>
                                        <div className="icon-wrapper bg-danger-light">
                                            <X className="text-danger" size={24} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xl="3" md="6">
                            <Card className="stats-card">
                                <CardBody>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h6 className="text-muted mb-1">Home Banners</h6>
                                            <h3 className="mb-0 text-info">{bannerData.filter(b => b.bannerType === 'home').length}</h3>
                                        </div>
                                        <div className="icon-wrapper bg-info-light">
                                            <Edit className="text-info" size={24} />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Filters */}
                    <Row className="mb-4">
                        <Col sm="12">
                            <Card>
                                <CardBody>
                                    <h6 className="mb-3">Filters</h6>
                                    <Row>
                                        <Col xl="2" md="4" sm="6">
                                            <FormGroup>
                                                <Label>Banner Type</Label>
                                                <Input
                                                    type="select"
                                                    value={filters.bannerType}
                                                    onChange={(e) => handleFilterChange('bannerType', e.target.value)}
                                                >
                                                    {bannerTypeOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col xl="2" md="4" sm="6">
                                            <FormGroup>
                                                <Label>Status</Label>
                                                <Input
                                                    type="select"
                                                    value={filters.status}
                                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col xl="2" md="4" sm="6">
                                            <FormGroup>
                                                <Label>Category</Label>
                                                <Input
                                                    type="select"
                                                    value={filters.category}
                                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                                >
                                                    <option value="all">All Categories</option>
                                                    {categoryData.map((cat, index) => (
                                                        <option key={index} value={cat.value}>
                                                            {cat.category}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col xl="3" md="6" sm="6">
                                            <FormGroup>
                                                <Label>Search</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Search by title..."
                                                    value={filters.search}
                                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col xl="3" md="6" sm="6" className="d-flex align-items-end">
                                            <FormGroup className="mb-0">
                                                <Button color="secondary" onClick={clearFilters} className="me-2">
                                                    Clear Filters
                                                </Button>
                                                <Button color="primary" onClick={onOpenAddModal}>
                                                    <Plus size={16} className="me-1" />
                                                    Add Banner
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* Banner List */}
                    <Row>
                        <Col sm="12">
                            <Card>
                                <CardHeader className="pb-0 d-flex justify-content-between align-items-center">
                                    <h5>Banner List ({filteredData.length})</h5>
                                </CardHeader>
                                <CardBody>
                                    {tableLoading ? (
                                        <div className="text-center p-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            <p className="mt-2">Loading banners...</p>
                                        </div>
                                    ) : filteredData && filteredData.length > 0 ? (
                                        <Datatable
                                            typeUse={"banner-list"}
                                            myData={filteredData}
                                            pageSize={10}
                                            pagination={true}
                                            handleDelete={openConfirmationModal}
                                            openPopUp={openEditModal}
                                            viewPopUp={openViewModal}
                                            handleStatusToggle={handleStatusToggle}
                                            class="-striped -highlight"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="empty-state">
                                                <Eye size={48} className="text-muted mb-3" />
                                                <h6>No banners found</h6>
                                                <p className="text-muted">
                                                    {filters.bannerType !== "all" || filters.status !== "all" || filters.search
                                                        ? "No banners match your current filters. Try adjusting your search criteria."
                                                        : "No banners have been created yet. Click 'Add Banner' to create your first banner."
                                                    }
                                                </p>
                                                {(filters.bannerType !== "all" || filters.status !== "all" || filters.search) && (
                                                    <Button color="secondary" onClick={clearFilters} className="me-2">
                                                        Clear Filters
                                                    </Button>
                                                )}
                                                <Button color="primary" onClick={onOpenAddModal}>
                                                    <Plus size={16} className="me-1" />
                                                    Add New Banner
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
            </Fragment>

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
                        <div className="icon-wrapper bg-danger-light mb-3 mx-auto" style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 className="text-danger" size={24} />
                        </div>
                        <h6>Are you sure you want to delete this banner?</h6>
                        <p className="text-muted">This action cannot be undone. The banner will be permanently removed.</p>
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

            {/* View Banner Modal */}
            <Modal isOpen={openView} toggle={onCloseViewModal} size="lg" centered>
                <ModalHeader toggle={onCloseViewModal}>
                    <h5 className="modal-title f-w-600">
                        <Eye className="me-2" size={20} />
                        Banner Details
                    </h5>
                </ModalHeader>
                <ModalBody>
                    {selectedBanner && (
                        <div>
                            <Row>
                                <Col md="6">
                                    <div className="banner-preview mb-3">
                                        <img
                                            src={selectedBanner.image}
                                            alt={selectedBanner.title}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="banner-info">
                                        <div className="info-group mb-3">
                                            <Label className="fw-bold">Title:</Label>
                                            <p className="mb-0">{selectedBanner.title}</p>
                                        </div>

                                        <div className="info-group mb-3">
                                            <Label className="fw-bold">Type:</Label>
                                            <span className={`badge badge-${getBannerTypeBadge(selectedBanner.bannerType)} ms-2`}>
                                                {selectedBanner.bannerType?.toUpperCase()}
                                            </span>
                                        </div>

                                        {selectedBanner.category && (
                                            <div className="info-group mb-3">
                                                <Label className="fw-bold">Category:</Label>
                                                <p className="mb-0">{selectedBanner.category}</p>
                                            </div>
                                        )}

                                        {selectedBanner.subCategory && (
                                            <div className="info-group mb-3">
                                                <Label className="fw-bold">Sub Category:</Label>
                                                <p className="mb-0">{selectedBanner.subCategory}</p>
                                            </div>
                                        )}

                                        <div className="info-group mb-3">
                                            <Label className="fw-bold">Priority:</Label>
                                            <span className="priority-badge ms-2">#{selectedBanner.priority}</span>
                                        </div>

                                        <div className="info-group mb-3">
                                            <Label className="fw-bold">Status:</Label>
                                            <span className={`badge ms-2 ${selectedBanner.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                {selectedBanner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        {selectedBanner.link && (
                                            <div className="info-group mb-3">
                                                <Label className="fw-bold">Link:</Label>
                                                <p className="mb-0">
                                                    <a href={selectedBanner.link} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                        {selectedBanner.link}
                                                    </a>
                                                </p>
                                            </div>
                                        )}

                                        <div className="info-group mb-3">
                                            <Label className="fw-bold">Created:</Label>
                                            <p className="mb-0">{new Date(selectedBanner.createdAt).toLocaleString()}</p>
                                        </div>

                                        <div className="info-group mb-0">
                                            <Label className="fw-bold">Last Updated:</Label>
                                            <p className="mb-0">{new Date(selectedBanner.updatedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => {
                        onCloseViewModal();
                        if (selectedBanner) {
                            openEditModal(selectedBanner._id);
                        }
                    }}>
                        <Edit size={16} className="me-1" />
                        Edit Banner
                    </Button>
                    <Button color="secondary" onClick={onCloseViewModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Add Banner Modal */}
            <Modal isOpen={openAdd} toggle={onCloseAddModal} size="lg" className="model-model" centered>
                <ModalHeader toggle={onCloseAddModal}>
                    <h5 className="modal-title f-w-600">
                        <Plus className="me-2" size={20} />
                        Add New Banner
                    </h5>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} className="form-label-center">
                        {/* Banner Title */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Banner Title <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        value={bannerForm.title}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                                        name="title"
                                        type="text"
                                        placeholder="Enter banner title"
                                        required
                                    />
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Banner Type */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Banner Type <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        type="select"
                                        value={bannerForm.bannerType}
                                        onChange={(e) => {
                                            setBannerForm(prev => ({
                                                ...prev,
                                                bannerType: e.target.value,
                                                category: "",
                                                subCategory: ""
                                            }));
                                            setSubCategoryData([]); // Clear subcategory data when banner type changes
                                        }}
                                    >
                                        <option value="home">Home Page</option>
                                        <option value="category">Category Page</option>
                                        <option value="subcategory">SubCategory Page</option>
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Category Selection (for category and subcategory banners) */}
                        {(bannerForm.bannerType === "category" || bannerForm.bannerType === "subcategory") && (
                            <FormGroup className="mb-3">
                                <Row>
                                    <Col xl="3" sm="4">
                                        <Label className="fw-bold mb-0">Category <span className="text-danger">*</span>:</Label>
                                    </Col>
                                    <Col xl="8" sm="7">
                                        <Input
                                            onClick={fetchCategories}
                                            type="select"
                                            value={bannerForm.category}
                                            onChange={(e) => {
                                                setBannerForm(prev => ({
                                                    ...prev,
                                                    category: e.target.value,
                                                    subCategory: ""
                                                }));
                                                if (e.target.value) {
                                                    fetchSubCategoriesByCategory(e.target.value);
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categoryData.map((data, index) => (
                                                <option key={index} value={data.value}>
                                                    {data.category}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                        )}

                        {/* SubCategory Selection (for subcategory banners) */}
                        {bannerForm.bannerType === "subcategory" && (
                            <FormGroup className="mb-3">
                                <Row>
                                    <Col xl="3" sm="4">
                                        <Label className="fw-bold mb-0">SubCategory <span className="text-danger">*</span>:</Label>
                                    </Col>
                                    <Col xl="8" sm="7">
                                        <Input
                                            type="select"
                                            value={bannerForm.subCategory}
                                            onChange={(e) => setBannerForm(prev => ({ ...prev, subCategory: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select a subcategory</option>
                                            {subCategoryData.map((data, index) => (
                                                <option key={index} value={data.value}>
                                                    {data.subCategory}
                                                </option>
                                            ))}
                                        </Input>
                                        {bannerForm.category && subCategoryData.length === 0 && (
                                            <small className="text-muted">No subcategories found for selected category</small>
                                        )}
                                    </Col>
                                </Row>
                            </FormGroup>
                        )}

                        {/* Priority */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Priority:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={bannerForm.priority}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                                        placeholder="Enter priority (1-100)"
                                    />
                                    <small className="text-muted">Lower numbers display first</small>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Link URL */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Link URL:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        type="url"
                                        value={bannerForm.link}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, link: e.target.value }))}
                                        placeholder="https://example.com (optional)"
                                    />
                                    <small className="text-muted">Optional: URL to redirect when banner is clicked</small>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Status */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Status:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <div className="d-flex align-items-center">
                                        <FormGroup check className="me-3">
                                            <Input
                                                type="radio"
                                                name="status"
                                                checked={bannerForm.isActive === true}
                                                onChange={() => setBannerForm(prev => ({ ...prev, isActive: true }))}
                                            />
                                            <Label check className="text-success">Active</Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Input
                                                type="radio"
                                                name="status"
                                                checked={bannerForm.isActive === false}
                                                onChange={() => setBannerForm(prev => ({ ...prev, isActive: false }))}
                                            />
                                            <Label check className="text-danger">Inactive</Label>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Image Upload */}
                        <FormGroup className="mb-4">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Banner Image <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <div className="upload-section">
                                        <div className="box-input-file mb-3">
                                            <Input
                                                accept="image/*"
                                                className="upload"
                                                type="file"
                                                onChange={handleImgChange}
                                                disabled={isLoading}
                                                id="banner-image-upload"
                                            />
                                            <Label for="banner-image-upload" className="upload-label">
                                                {isLoading ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={16} className="me-2" />
                                                        Upload Banner Image
                                                    </>
                                                )}
                                            </Label>
                                        </div>

                                        {image && (
                                            <div className="image-preview mt-3">
                                                <div className="position-relative d-inline-block">
                                                    <img
                                                        alt="Banner Preview"
                                                        src={image}
                                                        className="img-fluid rounded shadow-sm"
                                                        style={{ width: 250, height: 150, objectFit: "cover" }}
                                                    />
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        className="position-absolute"
                                                        style={{ top: "5px", right: "5px", padding: "4px 8px" }}
                                                        onClick={() => {
                                                            setImage("");
                                                            setBannerForm(prev => ({ ...prev, image: "" }));
                                                        }}
                                                    >
                                                        <XCircle size={14} />
                                                    </Button>
                                                </div>
                                                <small className="text-muted d-block mt-2">Image uploaded successfully</small>
                                            </div>
                                        )}

                                        <small className="text-muted">
                                            Recommended: 1200x400px or higher. Supports JPG, PNG, WebP formats.
                                        </small>
                                    </div>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-end">
                    <Button color="secondary" onClick={onCloseAddModal} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Plus size={16} className="me-1" />
                                Create Banner
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Banner Modal */}
            <Modal isOpen={open} toggle={onCloseModal} size="lg" className="model-model" centered>
                <ModalHeader toggle={onCloseModal}>
                    <h5 className="modal-title f-w-600">
                        <Edit className="me-2" size={20} />
                        Edit Banner
                    </h5>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit} className="form-label-center">
                        {/* Banner Title */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Banner Title <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        value={bannerForm.title}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                                        name="title"
                                        type="text"
                                        placeholder="Enter banner title"
                                        required
                                    />
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Banner Type */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Banner Type <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        type="select"
                                        value={bannerForm.bannerType}
                                        onChange={(e) => {
                                            setBannerForm(prev => ({
                                                ...prev,
                                                bannerType: e.target.value,
                                                category: "",
                                                subCategory: ""
                                            }));
                                            setSubCategoryData([]); // Clear subcategory data when banner type changes
                                        }}
                                    >
                                        <option value="home">Home Page</option>
                                        <option value="category">Category Page</option>
                                        <option value="subcategory">SubCategory Page</option>
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Category Selection (for category and subcategory banners) */}
                        {(bannerForm.bannerType === "category" || bannerForm.bannerType === "subcategory") && (
                            <FormGroup className="mb-3">
                                <Row>
                                    <Col xl="3" sm="4">
                                        <Label className="fw-bold mb-0">Category <span className="text-danger">*</span>:</Label>
                                    </Col>
                                    <Col xl="8" sm="7">
                                        <Input
                                            onClick={fetchCategories}
                                            type="select"
                                            value={bannerForm.category}
                                            onChange={(e) => {
                                                setBannerForm(prev => ({
                                                    ...prev,
                                                    category: e.target.value,
                                                    subCategory: ""
                                                }));
                                                if (e.target.value) {
                                                    fetchSubCategoriesByCategory(e.target.value);
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categoryData.map((data, index) => (
                                                <option key={index} value={data.value}>
                                                    {data.category}
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                </Row>
                            </FormGroup>
                        )}

                        {/* SubCategory Selection (for subcategory banners) */}
                        {bannerForm.bannerType === "subcategory" && (
                            <FormGroup className="mb-3">
                                <Row>
                                    <Col xl="3" sm="4">
                                        <Label className="fw-bold mb-0">SubCategory <span className="text-danger">*</span>:</Label>
                                    </Col>
                                    <Col xl="8" sm="7">
                                        <Input
                                            type="select"
                                            value={bannerForm.subCategory}
                                            onChange={(e) => setBannerForm(prev => ({ ...prev, subCategory: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select a subcategory</option>
                                            {subCategoryData.map((data, index) => (
                                                <option key={index} value={data.value}>
                                                    {data.subCategory}
                                                </option>
                                            ))}
                                        </Input>
                                        {bannerForm.category && subCategoryData.length === 0 && (
                                            <small className="text-muted">No subcategories found for selected category</small>
                                        )}
                                    </Col>
                                </Row>
                            </FormGroup>
                        )}

                        {/* Priority */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Priority:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={bannerForm.priority}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                                        placeholder="Enter priority (1-100)"
                                    />
                                    <small className="text-muted">Lower numbers display first</small>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Link URL */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Link URL:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <Input
                                        type="url"
                                        value={bannerForm.link}
                                        onChange={(e) => setBannerForm(prev => ({ ...prev, link: e.target.value }))}
                                        placeholder="https://example.com (optional)"
                                    />
                                    <small className="text-muted">Optional: URL to redirect when banner is clicked</small>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Status */}
                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Status:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <div className="d-flex align-items-center">
                                        <FormGroup check className="me-3">
                                            <Input
                                                type="radio"
                                                name="editStatus"
                                                checked={bannerForm.isActive === true}
                                                onChange={() => setBannerForm(prev => ({ ...prev, isActive: true }))}
                                            />
                                            <Label check className="text-success">Active</Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Input
                                                type="radio"
                                                name="editStatus"
                                                checked={bannerForm.isActive === false}
                                                onChange={() => setBannerForm(prev => ({ ...prev, isActive: false }))}
                                            />
                                            <Label check className="text-danger">Inactive</Label>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Image Upload */}
                        <FormGroup className="mb-4">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Banner Image <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col xl="8" sm="7">
                                    <div className="upload-section">
                                        <div className="box-input-file mb-3">
                                            <Input
                                                accept="image/*"
                                                className="upload"
                                                type="file"
                                                onChange={handleImgChange}
                                                disabled={isLoading}
                                                id="banner-image-upload-edit"
                                            />
                                            <Label for="banner-image-upload-edit" className="upload-label">
                                                {isLoading ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Edit size={16} className="me-2" />
                                                        Change Banner Image
                                                    </>
                                                )}
                                            </Label>
                                        </div>

                                        {image && (
                                            <div className="image-preview mt-3">
                                                <div className="position-relative d-inline-block">
                                                    <img
                                                        alt="Banner Preview"
                                                        src={image}
                                                        className="img-fluid rounded shadow-sm"
                                                        style={{ width: 250, height: 150, objectFit: "cover" }}
                                                    />
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        className="position-absolute"
                                                        style={{ top: "5px", right: "5px", padding: "4px 8px" }}
                                                        onClick={() => {
                                                            setImage("");
                                                            setBannerForm(prev => ({ ...prev, image: "" }));
                                                        }}
                                                    >
                                                        <XCircle size={14} />
                                                    </Button>
                                                </div>
                                                <small className="text-success d-block mt-2">Current banner image</small>
                                            </div>
                                        )}

                                        <small className="text-muted">
                                            Recommended: 1200x400px or higher. Supports JPG, PNG, WebP formats.
                                        </small>
                                    </div>
                                </Col>
                            </Row>
                        </FormGroup>

                        {/* Additional Info for Editing */}
                        {selectedBanner && (
                            <FormGroup className="mb-3">
                                <Row>
                                    <Col xl="3" sm="4">
                                        <Label className="fw-bold mb-0">Banner Info:</Label>
                                    </Col>
                                    <Col xl="8" sm="7">
                                        <div className="bg-light p-3 rounded">
                                            <small className="text-muted">
                                                <strong>Created:</strong> {new Date(selectedBanner.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}<br />
                                                <strong>Last Modified:</strong> {new Date(selectedBanner.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}<br />
                                                <strong>Banner ID:</strong> {selectedBanner._id}
                                            </small>
                                        </div>
                                    </Col>
                                </Row>
                            </FormGroup>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-end">
                    <Button color="secondary" onClick={onCloseModal} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Edit size={16} className="me-1" />
                                Update Banner
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default BannerList;