"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Button,
} from "reactstrap";
import Link from "next/link";
import { ArrowLeft } from "react-feather";
import { toast } from "react-toastify";
import AdminRegisterForm from "@/Layout/Login/LoginTabs/RegisterForm";

const CreateAdminPage = () => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      // ✅ ONLY token (no adminToken)
      const token = Cookies.get("token");
      const storedAdminData = localStorage.getItem("admin");

      if (!token || !storedAdminData) {
        toast.error("Please login as admin first");
        router.replace("/auth/login");
        return;
      }

      const parsedAdminData = JSON.parse(storedAdminData);

      // ✅ role check
      if (parsedAdminData.role !== "admin") {
        toast.error("Admin access required");
        router.replace("/");
        return;
      }

      // ✅ authenticated admin
      setIsAuthenticated(true);
      setAdminData(parsedAdminData);
      setLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      toast.error("Authentication failed");
      router.replace("/auth/login");
    }
  };

  // ⏳ Loading screen
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // 🔁 Redirecting fallback
  if (!isAuthenticated) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <h4>Redirecting...</h4>
      </div>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12">
          <div
            className="login-card"
            style={{ maxWidth: "700px", margin: "50px auto" }}
          >
            <div className="login-main">
              {/* 🔙 Back Button */}
              <div className="mb-3">
                <Link href="/dashboard">
                  <Button color="link" className="p-0">
                    <ArrowLeft size={16} className="me-1" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>

              <Card>
                <CardHeader>
                  <h4 className="mb-1">Create New Admin</h4>
                  <p className="text-muted mb-0 small">
                    Add a new administrator to the system
                  </p>
                </CardHeader>

                <CardBody>
                  {/* ℹ️ Logged in Admin Info */}
                  <div className="alert alert-info mb-4">
                    <strong>Logged in as:</strong>
                    <br />
                    <span className="fw-bold">{adminData?.name}</span>
                    <br />
                    <small className="text-muted">{adminData?.email}</small>
                  </div>

                  {/* 📝 Register Form */}
                  <AdminRegisterForm />
                </CardBody>
              </Card>

              
              <div className="text-center mt-4">
                <p className="text-muted small">
                  Only authorized administrators can create new admin accounts
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateAdminPage;
