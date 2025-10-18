// AdminReviewPage.jsx
import React from 'react';
import AdminSendReviewRequest from '@/Data/AdminReviewDashboard'; // NEW
import AdminReviewDashboard from '@/Data/AdminSendReviewRequest';

export default function AdminReviewsPage() {
  return (
    <div style={{ padding: "20px" }}>
      {/* Send Review Request Section */}
      <div style={{ marginBottom: "30px" }}>
        <AdminSendReviewRequest />
      </div>

      {/* Review Management Section */}
      <AdminReviewDashboard />
    </div>
  );
}