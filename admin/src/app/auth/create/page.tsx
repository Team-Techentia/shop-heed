"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Card, CardBody, CardHeader, Col, Container, Row, Button, Alert } from "reactstrap";
import Link from "next/link";
import { ArrowLeft } from "react-feather";
import { toast } from "react-toastify";
import AdminRegisterForm from "@/Layout/Login/LoginTabs/RegisterForm";

const CreateAdminPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Changed to false - no need to check initially
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(true); // Allow first time setup

  // Remove authentication check - allow anyone to access initially
  // After first admin is created, you can enable auth check

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12">
          <div className="login-card" style={{ maxWidth: "700px", margin: "50px auto", padding: "20px" }}>
            <div className="login-main">
              {/* Back to Login Button */}
              <div className="mb-3">
                <Link href="/auth/login" className="text-decoration-none">
                  <Button color="link" className="p-0">
                    <ArrowLeft size={16} className="me-1" />
                    Back to Login
                  </Button>
                </Link>
              </div>

              <Card className="mb-0">
                <CardHeader className="pb-3 bg-warning">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-1">🔐 First Time Admin Setup</h4>
                      <p className="mb-0 small">
                        Create your first administrator account
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardBody className="pt-4">
                  {/* Warning Alert */}
                  <Alert color="warning" className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i className="fa fa-exclamation-triangle fa-2x"></i>
                      </div>
                      <div>
                        <strong>⚠️ First Time Setup Mode</strong>
                        <br />
                        <small>
                          This page is currently in <strong>setup mode</strong>. 
                          After creating your first admin, you should enable authentication 
                          to protect this route.
                        </small>
                      </div>
                    </div>
                  </Alert>

                  {/* Instructions */}
                  <Alert color="info" className="mb-4">
                    <h6 className="alert-heading">📋 Instructions:</h6>
                    <ol className="mb-0 ps-3">
                      <li>Fill in all the required fields below</li>
                      <li>Create your first admin account</li>
                      <li>Login with your new credentials</li>
                      <li>⚠️ After login, uncomment the auth check in this file</li>
                    </ol>
                  </Alert>

                  {/* Register Form */}
                  <AdminRegisterForm />
                </CardBody>
              </Card>

              {/* Footer Note */}
              <div className="text-center mt-4">
                <Alert color="danger" className="mb-0">
                  <small>
                    <i className="fa fa-lock me-1"></i>
                    <strong>Security Notice:</strong> After creating your first admin, 
                    please enable authentication check in <code>app/admin/create/page.tsx</code>
                  </small>
                </Alert>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateAdminPage;