"use client";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "@/Components/Cookies";
import { Button, ButtonGroup, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, FormGroup, Input, Label, } from "reactstrap";
import Api from "../../../../Components/Api/index";
import { toast, Toaster } from "react-hot-toast";

interface FeaturedSection {
    _id?: string;
    category: string;
    subCategory: string;
    priority: number | null;
    isActive: boolean;
    createdAt?: string;
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

const FeaturedSectionList = () => {
    const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([]);
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [formData, setFormData] = useState<FeaturedSection>({
        category: "",
        subCategory: "",
        priority: null,
        isActive: true,
    });

    const token = getCookie();

    useEffect(() => {
        fetchFeaturedSections();
        fetchCategories();
    }, []);

    const fetchFeaturedSections = async () => {
        const storeData: any = [];
        try {
            const res = await Api.getAllFeaturedSections(token);
            const createPromise = res.data.data.map(async (item: any) => {
                const newObject = {
                    Category: item.category,
                    "Sub Category": item.subCategory || "All",
                    Priority: item.priority,
                    Status: item.isActive ?
                        <span className="badge badge-success">Active</span> :
                        <span className="badge badge-danger">Inactive</span>,
                    Actions: item._id,
                };
                storeData.push(newObject);
            });
            await Promise.all(createPromise);
            setFeaturedSections(storeData);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch featured sections");
        }
    };

    const fetchCategories = async () => {
        try {
            const getData = await Api.getCategory();
            setCategoryData(getData.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSubCategoriesByCategory = async (categoryName: string) => {
        try {
            const getData = await Api.getSubCategoryByCategoryName(categoryName);
            setSubCategoryData(getData.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const onOpenModal = () => {
        setEditMode(false);
        setFormData({
            category: "",
            subCategory: "",
            priority: null,
            isActive: true,
        });
        setOpen(true);
    };

    const onCloseModal = () => {
        setOpen(false);
        setFormData({
            category: "",
            subCategory: "",
            priority: null,
            isActive: true,
        });
    };

    const openEditModal = async (id: string) => {
        try {
            const res = await Api.getFeaturedSectionById(id, token);
            const data = res.data.data;
            setFormData({
                category: data.category,
                subCategory: data.subCategory,
                priority: data.priority,
                isActive: data.isActive,
            });
            await fetchSubCategoriesByCategory(data.category);
            setSelectedId(id);
            setEditMode(true);
            setOpen(true);
        } catch (error) {
            toast.error("Failed to fetch section details");
        }
    };

    const openConfirmationModal = (id: string) => {
        setSelectedId(id);
        setConfirmDelete(true);
    };

    const onCloseConfirmationModal = () => {
        setConfirmDelete(false);
        setSelectedId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            return toast.error("Please select a category");
        }
        if (!formData.priority) {
            return toast.error("Please enter priority");
        }

        try {
            if (editMode && selectedId) {
                await Api.updateFeaturedSection(selectedId, formData, token);
                toast.success("Featured section updated successfully");
            } else {
                await Api.createFeaturedSection(formData, token);
                toast.success("Featured section created successfully");
            }

            fetchFeaturedSections();
            onCloseModal();
        } catch (error) {
            toast.error(error.response.data.message ? error.response.data.message : editMode ? "Failed to update section" : "Failed to create section");
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            await Api.deleteFeaturedSection(selectedId, token);
            toast.success("Featured section deleted successfully");
            fetchFeaturedSections();
            onCloseConfirmationModal();
        } catch (error) {
            toast.error("Failed to delete section");
        }
    };

    const handleCategoryChange = (categoryValue: string) => {
        setFormData({
            ...formData,
            category: categoryValue,
            subCategory: ""
        });
        fetchSubCategoriesByCategory(categoryValue);
    };

    return (
        <>
            <Fragment>
                <CommonBreadcrumb title="Featured Sections" parent="Management" />
                <Container fluid>
                    <Row>
                        <Col sm="12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Featured Sections Management</h5>
                                    <Button color="primary" className="btn-air-primary" onClick={onOpenModal}>
                                        Add Featured Section
                                    </Button>
                                </div>
                                <div className="card-body">
                                    {featuredSections.length > 0 && (
                                        <Datatable
                                            typeUse={"featured-sections"}
                                            myData={featuredSections}
                                            pageSize={10}
                                            pagination={true}
                                            handleDelete={openConfirmationModal}
                                            openPopUp={openEditModal}
                                            class="-striped -highlight"
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-center" reverseOrder={false} />
            </Fragment>

            {/* Add/Edit Modal */}
            <Modal isOpen={open} toggle={onCloseModal} size="lg">
                <ModalHeader toggle={onCloseModal}>
                    <h5 className="modal-title f-w-600">
                        {editMode ? "Edit Featured Section" : "Add Featured Section"}
                    </h5>
                </ModalHeader>
                <div onSubmit={handleSubmit}>
                    <ModalBody>

                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Category <span className="text-danger">*</span>:</Label>
                                </Col>
                                <Col sm="8" xl="8">
                                    <Input
                                        type="select"
                                        value={formData.category}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categoryData.map((category, index) => (
                                            <option key={index} value={category.value}>
                                                {category.category}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                            </Row>
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Sub Category:</Label>
                                </Col>
                                <Col sm="8" xl="8">
                                    <Input
                                        type="select"
                                        value={formData.subCategory}
                                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                                        disabled={!formData.category}
                                    >
                                        <option value="">Select Sub Category (Optional)</option>
                                        {subCategoryData.map((subCategory, index) => (
                                            <option key={index} value={subCategory.value}>
                                                {subCategory.subCategory}
                                            </option>
                                        ))}
                                    </Input>
                                    <small className="text-muted">Leave empty to feature entire category</small>
                                </Col>
                            </Row>
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Priority:</Label>
                                </Col>
                                <Col sm="8" xl="8">
                                    <Input
                                        type="text"
                                        value={formData.priority ?? ""}
                                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || null })}
                                    />
                                    <small className="text-muted">Lower number = Higher priority (1 = highest)</small>
                                </Col>
                            </Row>
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <Row>
                                <Col xl="3" sm="4">
                                    <Label className="fw-bold mb-0">Status:</Label>
                                </Col>
                                <Col sm="8" xl="8">
                                    <FormGroup check>
                                        <Label check>
                                            <Input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            />
                                            <span className="ml-2">Active (will be shown on frontend)</span>
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleSubmit}>
                            {editMode ? "Update Section" : "Create Section"}
                        </Button>
                        <Button color="secondary" onClick={onCloseModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>

            {/* Confirmation Delete Modal */}
            <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
                <ModalHeader toggle={onCloseConfirmationModal}>
                    <h5 className="modal-title f-w-600">Confirm Deletion</h5>
                </ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this featured section? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDelete}>
                        Yes, Delete
                    </Button>
                    <Button color="secondary" onClick={onCloseConfirmationModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default FeaturedSectionList;