"use client";
import { useState, useEffect } from "react";
import { getCookie } from "@/Components/Cookies";
import Api from "@/Components/Api/index";

export default function AnnouncementEditor() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const token = getCookie();

  // ✅ Fetch initial announcement
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await Api.getAnnouncement();
        setText(res.data?.data?.text || "");
        setIsActive(res.data?.data?.isActive || false);
      } catch (err) {
        console.error("Failed to fetch announcement", err);
      }
    };
    fetchAnnouncement();
  }, []);

  // ✅ Save text update
  const saveAnnouncement = async () => {
    try {
      const res = await Api.updateAnnouncement({ text, isActive }, token);
      setText(res.data?.data?.text || text);
      setIsActive(res.data?.data?.isActive ?? isActive);
      alert("Announcement updated!");
    } catch (err) {
      console.error("Failed to update announcement", err);
      alert("Failed to update announcement!");
    }
  };

  // ✅ Toggle active state
  const toggleAnnouncement = async () => {
    try {
      const res = await Api.toggleAnnouncement(token);
      setIsActive(res.data?.data?.isActive ?? false);
      alert(res.data?.message || "Announcement toggled!");
    } catch (err) {
      console.error("Failed to toggle announcement", err);
      alert("Failed to toggle announcement!");
    }
  };

  return (
    <div className="card p-3">
      <h5>Update Announcement Bar</h5>
      <textarea
        className="form-control mb-2"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-primary" onClick={saveAnnouncement}>
          Save
        </button>
        <button
          className={`btn ${isActive ? "btn-danger" : "btn-success"}`}
          onClick={toggleAnnouncement}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </div>

      {/* ✅ Preview of fetched data */}
      <div className="alert alert-info">
        <strong>Current Announcement: </strong>
        {isActive ? (
          <span>{text || "No announcement set"}</span>
        ) : (
          <em>Announcement is currently deactivated</em>
        )}
      </div>
    </div>
  );
}
