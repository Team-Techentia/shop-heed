import { useState, useEffect, Fragment } from "react";
import { 
  Card, 
  CardBody, 
  Col, 
  Container, 
  Row, 
  Button, 
  Input, 
  Badge, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Alert,
  FormGroup,
  Label,
  Form,
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { toast, Toaster } from "react-hot-toast";
import { PromocodeType } from "@/Types";
import Api from "@/Components/Api";
import { getCookie } from "@/Components/Cookies";
import { XCircle } from "react-feather";

const ListCoupons = () => {
  const [promocodes, setPromocodes] = useState<PromocodeType[]>([]);
  const [promocodeTableData, setPromocodeTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, promocode: null as PromocodeType | null });
  const [editModal, setEditModal] = useState({ open: false, promocode: null as PromocodeType | null });
  const [viewModal, setViewModal] = useState({ open: false, promocode: null as PromocodeType | null });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingPromocode, setEditingPromocode] = useState<any>({});
  
  const token = getCookie();

  useEffect(() => {
    fetchPromocodes();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchPromocodes = async () => {
    setLoading(true);
    const storeData: any = [];
    
    try {
      if (!token) {
        toast.error("Authentication required. Please login.");
        return;
      }

      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await Api.getAllPromocodes(token, params);

      if (response.data.success) {
        setPromocodes(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);

        // Transform data for DataTable similar to product list
        const transformedData = response.data.data.map((item: PromocodeType) => ({
          "Promocode ID": item._id || "no",
          Code: item.code || "no",
          Name: item.name || "no",
          Discount: getDiscountDisplay(item),
          Usage: getUsageDisplay(item),
          "Valid Period": getDateRangeDisplay(item),
          Status: getStatusText(item),
          Actions: (
            <div className="d-flex gap-2">
              <Button
                color="info"
                size="sm"
                title="Edit"
                onClick={() => openEditModal(item._id!)}
                className="btn-square"
              >
                <i className="fa fa-edit"></i>
              </Button>
              <Button
                color="danger"
                size="sm"
                title="Delete"
                onClick={() => openConfirmationModal(item._id!)}
                className="btn-square"
              >
                <i className="fa fa-trash"></i>
              </Button>
              <Button
                color="primary"
                size="sm"
                title="View Details"
                onClick={() => openViewModal(item._id!)}
                className="btn-square"
              >
                <i className="fa fa-eye"></i>
              </Button>
            </div>
          ),
        }));

        setPromocodeTableData(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching promocodes:", error);
      toast.error("Error fetching promocodes: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await Api.deletePromocode(id, token);

      if (response.data.success) {
        toast.success("Promocode deleted successfully!");
        fetchPromocodes();
      }
    } catch (error: any) {
      console.error("Error deleting promocode:", error);
      toast.error("Error deleting promocode: " + (error.response?.data?.message || error.message));
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

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete(selectedId);
      onCloseConfirmationModal();
    }
  };

  const openEditModal = (id: string) => {
    const promocode = promocodes.find(p => p._id === id);
    if (promocode) {
      setEditingPromocode(promocode);
      setEditModal({ open: true, promocode });
    }
  };

  const openViewModal = (id: string) => {
    const promocode = promocodes.find(p => p._id === id);
    if (promocode) {
      setViewModal({ open: true, promocode });
    }
  };

  const onCloseEditModal = () => {
    setEditModal({ open: false, promocode: null });
    setEditingPromocode({});
  };

  const onCloseViewModal = () => {
    setViewModal({ open: false, promocode: null });
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No Limit';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (promocode: PromocodeType) => {
    const now = new Date();
    const startDate = promocode.startDate ? new Date(promocode.startDate) : null;
    const endDate = promocode.endDate ? new Date(promocode.endDate) : null;

    if (!promocode.status) {
      return <Badge color="secondary">Disabled</Badge>;
    }

    const totalUsageLimit = promocode.perLimit;
    if (totalUsageLimit && (promocode.usedQuantity || 0) >= totalUsageLimit) {
      return <Badge color="warning">Exhausted</Badge>;
    }

    if (startDate && startDate > now) {
      return <Badge color="info">Scheduled</Badge>;
    }

    if (endDate && endDate < now) {
      return <Badge color="danger">Expired</Badge>;
    }

    return <Badge color="success">Active</Badge>;
  };

  const getStatusText = (promocode: PromocodeType) => {
    const now = new Date();
    const startDate = promocode.startDate ? new Date(promocode.startDate) : null;
    const endDate = promocode.endDate ? new Date(promocode.endDate) : null;

    if (!promocode.status) return "Disabled";

    const totalUsageLimit = promocode.perLimit;
    if (totalUsageLimit && (promocode.usedQuantity || 0) >= totalUsageLimit) {
      return "Exhausted";
    }

    if (startDate && startDate > now) return "Scheduled";
    if (endDate && endDate < now) return "Expired";

    return "Active";
  };

  const getDiscountDisplay = (promocode: PromocodeType) => {
    if (promocode.discountType === 'percent') {
      return `${promocode.discountValue}%`;
    }
    return `₹${promocode.discountValue}`;
  };

  const getUsageDisplay = (promocode: PromocodeType) => {
    const usedCount = promocode.usedQuantity || 0;
    const totalLimit = promocode.perLimit;
    
    if (totalLimit) {
      return `${usedCount} / ${totalLimit}`;
    }
    
    return `${usedCount} / Unlimited`;
  };

  const getDateRangeDisplay = (promocode: PromocodeType) => {
    const startDate = formatDate(promocode.startDate);
    const endDate = formatDate(promocode.endDate);
    
    if (startDate === 'No Limit' && endDate === 'No Limit') {
      return 'Always Valid';
    }
    
    if (startDate === 'No Limit') {
      return `Until ${endDate}`;
    }
    
    if (endDate === 'No Limit') {
      return `From ${startDate}`;
    }
    
    return `${startDate} - ${endDate}`;
  };

  const handleUpdatePromocode = async (e: any) => {
    e.preventDefault();
    try {
      const response = await Api.updatePromocode(editingPromocode._id, editingPromocode, token);
      if (response.data.success) {
        toast.success("Promocode updated successfully!");
        fetchPromocodes();
        onCloseEditModal();
      }
    } catch (error: any) {
      toast.error("Error updating promocode: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Fragment>
      <CommonBreadcrumb title="List Coupons" parent="Coupons" />
      <Container fluid>
        <Row className="promocodes-admin ratio_asos">
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Promocodes Management" />
              <CardBody>
                {/* Header with Add Button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Promocodes ({promocodes.length})</h5>
                  <Button
                    color="primary"
                    onClick={() => window.location.href = '/en/coupons/create-coupons'}
                  >
                    Add New Promocode
                  </Button>
                </div>

                {/* Filters */}
                <Row className="mb-3">
                  <Col md="6">
                    <Input
                      type="text"
                      placeholder="Search by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col md="3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </Col>
                  <Col md="3">
                    <Button 
                      color="secondary" 
                      onClick={fetchPromocodes}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                  </Col>
                </Row>

                {/* Summary Cards */}
                <Row className="mb-3">
                  <Col md="3">
                    <Card className="bg-primary text-white">
                      <CardBody className="py-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-0">Total</h6>
                            <h4 className="mb-0">{promocodes.length}</h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="3">
                    <Card className="bg-success text-white">
                      <CardBody className="py-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-0">Active</h6>
                            <h4 className="mb-0">
                              {promocodes.filter(p => p.status && new Date() >= (p.startDate ? new Date(p.startDate) : new Date(0)) && new Date() <= (p.endDate ? new Date(p.endDate) : new Date(2100, 0, 1))).length}
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="3">
                    <Card className="bg-warning text-white">
                      <CardBody className="py-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-0">Expired</h6>
                            <h4 className="mb-0">
                              {promocodes.filter(p => p.endDate && new Date(p.endDate) < new Date()).length}
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="3">
                    <Card className="bg-secondary text-white">
                      <CardBody className="py-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-0">Disabled</h6>
                            <h4 className="mb-0">
                              {promocodes.filter(p => !p.status).length}
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {/* DataTable */}
                {promocodeTableData && promocodeTableData.length >= 1 && (
                  <Datatable
                    typeUse={"promocode-list"}
                    myData={promocodeTableData}
                    pageSize={10}
                    pagination={true}
                    handleDelete={openConfirmationModal}
                    openEditModal={openEditModal}
                    openViewModal={openViewModal}
                    class="-striped -highlight"
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDelete} toggle={onCloseConfirmationModal}>
        <ModalHeader toggle={onCloseConfirmationModal}>
          <h5 className="modal-title f-w-600">Confirm Deletion</h5>
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this Promocode?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmDelete}>Yes</Button>
          <Button color="secondary" onClick={onCloseConfirmationModal}>No</Button>
        </ModalFooter>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={viewModal.open} toggle={onCloseViewModal} className="modal-lg">
        <ModalHeader toggle={onCloseViewModal}>
          <h5 className="modal-title f-w-600">Promocode Details</h5>
        </ModalHeader>
        <ModalBody>
          {viewModal.promocode && (
            <div>
              <Row className="mb-3">
                <Col md="6">
                  <strong>Name:</strong> {viewModal.promocode.name}
                </Col>
                <Col md="6">
                  <strong>Code:</strong> 
                  <code className="bg-light px-2 py-1 rounded ms-2">
                    {viewModal.promocode.code}
                  </code>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md="6">
                  <strong>Discount:</strong> {getDiscountDisplay(viewModal.promocode)}
                </Col>
                <Col md="6">
                  <strong>Status:</strong> {getStatusBadge(viewModal.promocode)}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md="6">
                  <strong>Usage:</strong> {getUsageDisplay(viewModal.promocode)}
                </Col>
                <Col md="6">
                  <strong>Per Customer:</strong> {viewModal.promocode.perCustomer || 'Unlimited'}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md="12">
                  <strong>Valid Period:</strong> {getDateRangeDisplay(viewModal.promocode)}
                </Col>
              </Row>

              {viewModal.promocode.minimumSpend && (
                <Row className="mb-3">
                  <Col md="12">
                    <strong>Minimum Spend:</strong> ₹{viewModal.promocode.minimumSpend}
                  </Col>
                </Row>
              )}

              {viewModal.promocode.freeShipping && (
                <Row className="mb-3">
                  <Col md="12">
                    <strong>Free Shipping:</strong> Yes
                  </Col>
                </Row>
              )}

              {viewModal.promocode.categories && viewModal.promocode.categories.length > 0 && (
                <Row className="mb-3">
                  <Col md="12">
                    <strong>Categories:</strong> {viewModal.promocode.categories.join(', ')}
                  </Col>
                </Row>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onCloseViewModal}>Close</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal.open} toggle={onCloseEditModal} className="modal-lg">
        <ModalHeader toggle={onCloseEditModal}>
          <h5 className="modal-title f-w-600">Edit Promocode</h5>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleUpdatePromocode}>
            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Promocode Name:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="text"
                    value={editingPromocode.name || ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, name: e.target.value})}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Promocode Code:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="text"
                    value={editingPromocode.code || ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, code: e.target.value})}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Discount Type:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="select"
                    value={editingPromocode.discountType || 'percent'}
                    onChange={(e) => setEditingPromocode({...editingPromocode, discountType: e.target.value})}
                  >
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Discount Value:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="number"
                    min="0"
                    value={editingPromocode.discountValue || ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, discountValue: parseFloat(e.target.value)})}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Usage Limit:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="number"
                    min="0"
                    value={editingPromocode.quantity || ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, quantity: parseInt(e.target.value)})}
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Per Customer:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="number"
                    min="0"
                    value={editingPromocode.perCustomer || ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, perCustomer: parseInt(e.target.value)})}
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Minimum Spend:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="number"
                    min="0"
                    value={editingPromocode.minimumSpend || ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, minimumSpend: parseFloat(e.target.value)})}
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Start Date:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="datetime-local"
                    value={editingPromocode.startDate ? new Date(editingPromocode.startDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, startDate: e.target.value})}
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">End Date:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <Input
                    type="datetime-local"
                    value={editingPromocode.endDate ? new Date(editingPromocode.endDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingPromocode({...editingPromocode, endDate: e.target.value})}
                  />
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Status:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <div>
                    <Input
                      type="checkbox"
                      checked={editingPromocode.status || false}
                      onChange={(e) => setEditingPromocode({...editingPromocode, status: e.target.checked})}
                    />
                    <Label className="ms-2">Active</Label>
                  </div>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup className="mb-3">
              <Row>
                <Col xl="3" sm="4">
                  <Label className="fw-bold mb-0">Free Shipping:</Label>
                </Col>
                <Col xl="8" sm="7">
                  <div>
                    <Input
                      type="checkbox"
                      checked={editingPromocode.freeShipping || false}
                      onChange={(e) => setEditingPromocode({...editingPromocode, freeShipping: e.target.checked})}
                    />
                    <Label className="ms-2">Enable Free Shipping</Label>
                  </div>
                </Col>
              </Row>
            </FormGroup>

            <ModalFooter>
              <div className="offset-xl-3">
                <Button type="submit" color="primary">Update Promocode</Button>
                <Button color="secondary" className="ms-2" onClick={onCloseEditModal}>Cancel</Button>
              </div>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>

      <Toaster position="top-center" reverseOrder={false} />
    </Fragment>
  );
};

export default ListCoupons;