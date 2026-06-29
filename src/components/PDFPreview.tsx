import React from "react";
import Image from "next/image";
import { Check, X, Star } from "lucide-react";

interface ServiceStatus {
  flights: boolean;
  hotels: boolean;
  tours: boolean;
  transport: boolean;
  cruise: boolean;
  addons: boolean;
}

interface HotelItem {
  id: string;
  hotelName: string;
  hotelStar: string;
  hotelRoomType: string;
  hotelMealPlan: string;
  hotelCheckIn: string;
  hotelCheckOut: string;
  hotelImage?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  stay: string;
  description: string;
  mealPlan: string;
  image?: string;
  transferBasis?: string;
  customTransferBasis?: string;
}

interface PDFData {
  guestName: string;
  destination: string;
  arrivalDate: string;
  durationNights: number;
  durationDays: number;
  numPax: string;
  numRooms: string;
  vehicleType: string;
  transferBasis?: string;
  customTransferBasis?: string;
  pickupPoint: string;
  dropPoint: string;
  pickDrop?: string;
  mealPlan: string;
  services: ServiceStatus;
  pricePerPerson: string;
  totalPrice: string;
  advancePrice?: string;
  gstExtra: boolean;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  paymentPolicies: string[];
  cancellationPolicies: string[];
  bookingTerms: string[];
  coverImage?: string;
  hotels: HotelItem[];
  hotelLibrary?: HotelItem[];
}

// Simple date formatter to convert YYYY-MM-DD to DD MMM YYYY
const formatPreviewDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (!dateStr.includes("-")) return dateStr;
  try {
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(month) - 1;
    const formattedMonth = months[monthIndex] || month;
    return `${day} ${formattedMonth} ${year}`;
  } catch (e) {
    return dateStr;
  }
};

// Formatter to convert YYYY-MM-DDTHH:MM to DD MMM YYYY | HH:MM
const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return "";
  if (dateTimeStr.includes("T")) {
    const [datePart, timePart] = dateTimeStr.split("T");
    const formattedDate = formatPreviewDate(datePart);
    return `${formattedDate} | ${timePart}`;
  }
  if (dateTimeStr.includes(" | ")) {
    const [datePart, timePart] = dateTimeStr.split(" | ");
    return `${formatPreviewDate(datePart)} | ${timePart}`;
  }
  return dateTimeStr;
};

// Dynamic Day Image resolver for preview
const getDayImagePreview = (dayNum: number) => {
  if (dayNum === 1) return "/day1.png";
  if (dayNum === 2) return "/day2.png";
  if (dayNum === 3) return "/day3.png";
  if (dayNum === 4) return "/day4.png";
  return "/goa.png";
};

// Helper to render hotel stars dynamically in HTML
const renderStarsHtml = (starStr: string) => {
  let count = 3;
  if (starStr.includes("5")) count = 5;
  else if (starStr.includes("4")) count = 4;
  else if (starStr.includes("3")) count = 3;
  else if (starStr.includes("2")) count = 2;
  else if (starStr.includes("1")) count = 1;
  return (
    <div className="star-row-container">
      {Array(count).fill(0).map((_, i) => (
        <Star key={i} size={12} fill="#c5a059" stroke="#c5a059" style={{ marginRight: "2px" }} />
      ))}
      <style jsx>{`
        .star-row-container {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

const getDayItineraryTransferText = (dayItem: ItineraryDay | null | undefined, data: PDFData) => {
  const selectedBasis = (dayItem && dayItem.transferBasis) || data.transferBasis || "PRIVATE BASIS (PVT)";
  const selectedCustom = (dayItem && dayItem.transferBasis) ? (dayItem.customTransferBasis || "") : (data.customTransferBasis || "");
  
  const basis = selectedBasis === "CUSTOM BASIS"
    ? (selectedCustom || "Custom")
    : selectedBasis;
  
  if (basis === "NONE") {
    return `Cab: ${data.vehicleType}`;
  }
  
  if (data.vehicleType === "No Transport (Direct Check-in)") {
    return `Cab: ${basis}`;
  }
  return `Cab: ${data.vehicleType} (${basis})`;
};

export const PDFPreview: React.FC<{ data: PDFData }> = ({ data }) => {
  const formattedArrival = formatPreviewDate(data.arrivalDate);
  const totalPages = 5 + (data.itinerary || []).length;

  return (
    <div className="preview-sheet-container">
      <style jsx>{`
        .preview-sheet-container {
          background-color: #e2e8f0;
          padding: 2rem 1rem;
          height: 100%;
          overflow-y: auto;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }

        .pdf-page-mock {
          width: 595px; /* A4 width standard */
          min-height: 842px; /* A4 height standard */
          background-color: #ffffff;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.1);
          border-radius: 6px;
          padding: 105px 45px 70px 45px; /* Increased to clear larger header logo */
          position: relative;
          display: flex;
          flex-direction: column;
          color: #1e293b;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 10.5px; /* Matching PDF font size */
          margin-bottom: 1rem;
        }

        .pdf-header {
          position: absolute;
          top: 20px;
          left: 45px;
          right: 45px;
          display: flex;
          flex-direction: column;
        }

        .pdf-header-main {
          border-bottom: 3px solid #c5a059;
          padding-bottom: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pdf-logo-large {
          height: 70px;
          width: auto;
        }

        .pdf-logo-small {
          height: 28px;
          width: auto;
        }

        .pdf-footer {
          border-top: 1.5px solid #c5a059;
          padding-top: 8px;
          position: absolute;
          bottom: 20px;
          left: 45px;
          right: 45px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
        }

        .footer-col-title {
          font-size: 7.5px;
          font-weight: 800;
          color: #0a2540;
          margin-bottom: 2px;
          text-transform: uppercase;
        }

        .footer-col-text {
          font-size: 7px;
          color: #475569;
          line-height: 1.3;
        }

        .footer-link {
          color: #1e40af;
          text-decoration: underline;
        }

        .page-badge {
          background-color: #10b981;
          color: #ffffff;
          padding: 3px 8px;
          font-size: 8px;
          font-weight: 700;
          border-radius: 3px;
          margin-top: 2px;
        }

        /* Cover Content */
        .cover-photo-wrapper {
          position: relative;
          width: 100%;
          height: 230px; /* Enlarged Cover image size */
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1.25rem;
          border: 2px solid #c5a059;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .cover-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(10, 37, 64, 0.9);
          color: #ffffff;
          padding: 0.85rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cover-overlay h2 {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          color: #ffffff;
        }

        .cover-badge {
          color: #c5a059;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .greeting-section {
          margin-bottom: 1.25rem;
          background-color: #f1f5f9;
          padding: 0.85rem 1.25rem;
          border-radius: 6px;
          border-left: 5px solid #c5a059; /* Matching Gold Left Border */
        }

        .greeting-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0a2540;
          margin-bottom: 0.15rem;
        }

        .greeting-sub {
          font-size: 0.85rem;
          font-weight: 600;
          color: #c5a059;
          margin-bottom: 0.35rem;
        }

        .greeting-body {
          font-size: 0.85rem;
          color: #1e293b;
          line-height: 1.5;
        }

        /* Details Grid */
        .details-grid-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #0a2540;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .details-grid-row {
          display: flex;
          border-bottom: 1px solid #cbd5e1;
        }

        .details-grid-row:last-child {
          border-bottom: none;
        }

        .details-label-cell {
          width: 35%;
          background-color: #0a2540;
          padding: 0.65rem 1.1rem;
          font-weight: 700;
          color: #ffffff;
          font-size: 0.9rem;
          border-right: 1.5px solid #1e3a8a;
        }

        .details-value-cell {
          width: 65%;
          padding: 0.65rem 1.1rem;
          font-weight: 700;
          color: #1e3a8a;
          font-size: 0.9rem;
          background-color: #ffffff;
        }

        /* Services Checklist */
        .services-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0a2540;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 0.75rem;
        }

        .services-include-grid {
          display: flex;
          justify-content: space-around;
          background-color: #f8fafc;
          border: 2px solid #c5a059;
          border-radius: 8px;
          padding: 0.85rem 1.25rem;
          margin-bottom: 1.5rem;
        }

        .service-include-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .service-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }

        .service-icon-box.success {
          background-color: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .service-icon-box.error {
          background-color: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .service-title-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #0f172a;
        }

        /* Page Titles */
        .page-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          background-color: #0a2540;
          padding: 0.5rem 1.1rem;
          border-radius: 4px;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          border-left: 4px solid #c5a059;
        }

        /* Brand Profile Card */
        .brand-profile-preview-card {
          border: 2px solid #c5a059;
          border-left: 6px solid #0a2540;
          border-radius: 6px;
          padding: 0.85rem;
          background-color: #faf6eb; /* Soft Cream Gold Highlight Background */
          margin-bottom: 1.25rem;
        }

        .brand-profile-hl {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0a2540;
          margin-bottom: 0.15rem;
        }

        .brand-profile-gov {
          font-size: 0.85rem;
          font-weight: 700;
          color: #c5a059;
          margin-bottom: 0.15rem;
        }

        .brand-profile-adr {
          font-size: 0.8rem;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .brand-preview-divider {
          border-bottom: 1px solid #cbd5e1;
          margin: 0.5rem 0;
        }

        .brand-preview-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a2540;
          margin-top: 0.5rem;
          margin-bottom: 0.15rem;
          text-transform: uppercase;
        }

        .brand-preview-list {
          font-size: 0.8rem;
          color: #1e293b;
          line-height: 1.45;
        }

        /* Hotel Card Stacked Vertically with HUGE Image */
        .hotel-detail-card {
          border: 1.5px solid #cbd5e1;
          border-left: 6px solid #c5a059;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column; /* Stacked Vertically */
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background-color: #f8fafc;
        }

        .hotel-text-info {
          display: flex;
          flex-direction: column;
        }

        .hotel-img-placeholder {
          width: 100%; /* Giant full-width hotel image */
          height: 180px;            /* Balanced preview height */
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 1.5px solid #c5a059;
          margin: 0.5rem 0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .hotel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hotel-name-row-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .hotel-headline {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0a2540;
        }

        .hotel-headline-link {
          color: #1e40af;
          text-decoration: underline;
          font-weight: 700;
        }

        .hotel-headline-link:hover {
          color: #1d4ed8;
        }

        .hotel-star-row {
          color: #c5a059;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .hotel-field-grid {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }

        .hotel-field-row {
          display: flex;
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
          width: 50%; /* 2 Columns Stay Details Grid */
        }

        .hotel-field-label {
          width: 75px;
          color: #64748b;
        }

        .hotel-field-value {
          font-weight: 700;
          color: #0f172a;
        }

        /* Pricing Card */
        .price-card-box {
          background-color: #faf6eb; /* Cream background */
          border: 3px solid #c5a059; /* Thick gold border */
          border-radius: 10px;
          padding: 1.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .price-row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: 1.1rem;
        }

        .price-label-text {
          font-weight: 700;
          color: #0a2540; /* Navy text */
        }

        .price-total-text {
          font-size: 1.9rem; /* Big bold price size */
          font-weight: 800;
          color: #0a2540; /* Navy price color */
        }

        .price-gst-sub {
          font-size: 0.85rem;
          color: #ffffff;
          background-color: #ef4444;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-weight: 700;
          margin-top: 0.25rem;
        }

        /* Abbreviations Box */
        .abbreviation-box {
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 0.75rem;
          background-color: #f8fafc;
          font-size: 0.75rem;
          color: #475569;
          line-height: 1.45;
        }

        .abbrev-title-header {
          font-weight: 700;
          color: #0a2540;
          margin-bottom: 0.25rem;
        }

        /* Itinerary Timeline - Vertical Stacked Daily Cards with HUGE Spot Photos */
        .itinerary-timeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .itinerary-day-card {
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          background-color: #f8fafc;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .itinerary-day-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          background-color: #eff6ff;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          border-left: 4px solid #1e3a8a;
        }

        .itinerary-day-label {
          font-size: 0.98rem;
          font-weight: 700;
          color: #0a2540;
        }

        .itinerary-day-stay-tag {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e3a8a;
          background-color: #dbeafe;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }

        .itinerary-day-big-img-box {
          width: 100%;
          height: 200px; /* Cinematic preview height to match PDF design */
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          margin: 0.5rem 0;
          border: 1.5px solid #c5a059;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .day-itinerary-big-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .itinerary-day-description-text {
          font-size: 0.95rem; /* Larger text */
          line-height: 1.55;
          color: #1e293b;
          margin-bottom: 0.5rem;
          margin-top: 0.25rem;
        }

        .itinerary-meta-row-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          border-top: 1px solid #e2e8f0;
          padding-top: 0.5rem;
        }

        .itinerary-day-meal-plan-text {
          font-size: 0.85rem;
          font-weight: 700;
          color: #c5a059;
        }

        .itinerary-badge-green-preview {
          background-color: #d1fae5;
          color: #065f46;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
        }

        /* Policies Column Cards - BOLD STYLING MOCKED */
        .policies-split-layout {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .policy-col {
          flex: 1;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .policy-col.inc-box {
          border: 2px solid #bbf7d0;
          background-color: #f0fdf4;
        }

        .policy-col.exc-box {
          border: 2px solid #fecaca;
          background-color: #fef2f2;
        }

        .policy-block-card-preview-payment {
          flex: 1;
          border: 2px solid #bfdbfe;
          background-color: #eff6ff;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .policy-block-card-preview-cancellation {
          flex: 1;
          border: 2px solid #fed7aa;
          background-color: #fff7ed;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .policy-col-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.85rem;
          padding-bottom: 0.35rem;
          border-bottom: 1px solid #cbd5e1;
        }

        .policy-col-title.inclusions {
          color: #10b981;
        }

        .policy-col-title.exclusions {
          color: #ef4444;
        }

        .policy-col-title.payment {
          color: #1e3a8a;
          border-bottom: 1px solid #bfdbfe;
        }

        .policy-col-title.cancellation {
          color: #ea580c;
          border-bottom: 1px solid #fed7aa;
        }

        .policy-list-items {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .policy-list-item-row {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
          line-height: 1.45;
          align-items: flex-start;
          color: #1e293b;
        }

        .policy-list-bullet-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Bank Account Info Card */
        .bank-details-card-preview {
          border: 2px solid #c5a059;
          border-radius: 8px;
          padding: 1.25rem;
          background-color: #f8fafc;
          margin-bottom: 1.25rem;
        }

        .bank-details-title-preview {
          font-weight: 700;
          color: #0a2540;
          text-align: center;
          margin-bottom: 0.75rem;
          font-size: 1.05rem;
        }

        .bank-detail-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bank-detail-table tr {
          border-bottom: 1px solid #e2e8f0;
        }

        .bank-detail-table tr:last-child {
          border-bottom: none;
        }

        .bank-detail-table td {
          padding: 0.65rem 0;
          font-size: 0.9rem;
        }

        .bank-detail-lbl {
          color: #64748b;
          width: 130px;
        }

        .bank-detail-val {
          font-weight: 700;
          color: #0f172a;
        }

        /* Thank You block */
        .thank-you-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 1.25rem;
          gap: 0.5rem;
          background-color: #f8fafc;
          padding: 1.25rem;
          border-radius: 8px;
          border: 1.5px solid #c5a059;
          width: 100%;
        }

        .thank-you-large-text {
          font-family: var(--font-serif);
          font-size: 1.95rem;
          font-weight: 800;
          color: #0a2540;
          letter-spacing: 2px;
        }

        .thank-you-brand-sub {
          font-size: 0.9rem;
          font-weight: 700;
          color: #c5a059;
          letter-spacing: 1px;
        }

        .thank-you-links-row {
          display: flex;
          gap: 1.5rem;
          font-size: 0.88rem;
          margin-top: 0.75rem;
        }

        .thank-you-link-item {
          color: #1e40af;
          text-decoration: underline;
          font-weight: 700;
        }

        .thank-you-link-item:hover {
          color: #1d4ed8;
        }
      `}</style>

      {/* Page 1: Dedicated Luxury Cover Page */}
      <div className="pdf-page-mock" style={{ padding: "45px 45px 45px 45px" }}>
        {/* Center Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px", width: "100%" }}>
          <Image src="/logo.jpg" alt="Logo" width={260} height={90} className="pdf-logo-large" style={{ height: "90px", width: "auto" }} />
        </div>

        {/* Large Cover Photo Container */}
        <div className="cover-photo-wrapper" style={{ height: "300px", marginBottom: "20px" }}>
          <img src={data.coverImage || "/goa.png"} alt="Destination Cover" className="cover-photo" style={{ height: "100%" }} />
          <div className="cover-overlay">
            <h2 style={{ fontSize: "1.7rem" }}>{(data.destination || "").toUpperCase()}</h2>
            <span className="cover-badge">PREMIUM TOUR PACKAGE</span>
          </div>
        </div>

        {/* Quotation Details Summary Box */}
        <div style={{
          border: "2px solid #c5a059",
          borderRadius: "8px",
          padding: "15px",
          backgroundColor: "#faf6eb",
          marginTop: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#0a2540", borderBottom: "1.5px solid #c5a059", paddingBottom: "4px", textTransform: "uppercase" }}>
            Quotation Details
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "#64748b", fontWeight: "bold" }}>PREPARED FOR :</span>
              <span style={{ fontWeight: "bold", color: "#0a2540" }}>{data.guestName || ""}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "#64748b", fontWeight: "bold" }}>DURATION :</span>
              <span style={{ fontWeight: "bold", color: "#0a2540" }}>
                {(data.durationNights ?? 0).toString().padStart(2, "0")} Nights / {(data.durationDays ?? 0).toString().padStart(2, "0")} Days
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "#64748b", fontWeight: "bold" }}>TRAVEL DATE :</span>
              <span style={{ fontWeight: "bold", color: "#0a2540" }}>{formattedArrival}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "#64748b", fontWeight: "bold" }}>TOTAL TRAVELERS :</span>
              <span style={{ fontWeight: "bold", color: "#0a2540" }}>{data.numPax || ""}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "#64748b", fontWeight: "bold" }}>ACCOMMODATION :</span>
              <span style={{ fontWeight: "bold", color: "#0a2540" }}>{data.numRooms || ""}</span>
            </div>
          </div>
        </div>

        {/* Cover footer */}
        <div style={{
          position: "absolute",
          bottom: "35px",
          left: "45px",
          right: "45px",
          borderTop: "1.5px solid #c5a059",
          paddingTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#0a2540" }}>MAHADEV HOLIDAYS</span>
            <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Explore • Experience • Enjoy</span>
            <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Estd: 2022</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#0a2540" }}>TOUR ADVISOR: VISHAL CHAUHAN (DARJI)</span>
            <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Ph: 9328151481</span>
            <span style={{ fontSize: "0.65rem", color: "#64748b" }}>Email: mahadevholidays2000@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Page 2: Welcome Greeting & Overview Summary Table */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="page-title">Welcome Greeting & Package Overview</div>

        <div className="greeting-section">
          <div className="greeting-title">Dear Sir/Madam,</div>
          <div className="greeting-sub">Greetings From Mahadev Holidays,</div>
          <div className="greeting-body">
            Thanks for your query & as per our telephonic conversation, I am sending you the package details. Kindly check the details given below & for any clarifications feel free to mail or call.
          </div>
        </div>

        <div className="details-grid-table">
          <div className="details-grid-row">
            <div className="details-label-cell">Guest / Client Name</div>
            <div className="details-value-cell">{data.guestName || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Arrival Date</div>
            <div className="details-value-cell">{formattedArrival}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Duration</div>
            <div className="details-value-cell">
              {(data.durationNights ?? 0).toString().padStart(2, "0")} Nights and {(data.durationDays ?? 0).toString().padStart(2, "0")} Days
            </div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">No. of People</div>
            <div className="details-value-cell">{data.numPax || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Rooms Requested</div>
            <div className="details-value-cell">{data.numRooms || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Vehicle Type (Transfers)</div>
            <div className="details-value-cell">
              {getDayItineraryTransferText(null, data).replace("Cab: ", "")}
            </div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Pickup Point</div>
            <div className="details-value-cell">{data.pickupPoint || "Not Specified"}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Drop Point</div>
            <div className="details-value-cell">{data.dropPoint || "Not Specified"}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Meal Plan</div>
            <div className="details-value-cell">{data.mealPlan || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Hotel (Stay Category)</div>
            <div className="details-value-cell">
              {data.hotels ? data.hotels.map(h => h.hotelStar).filter((v, i, a) => a.indexOf(v) === i).join(", ") : ""}
            </div>
          </div>
        </div>

        <div className="services-section-title">Services Include</div>
        <div className="services-include-grid">
          {Object.entries(data.services || {}).map(([key, val]) => (
            <div className="service-include-item" key={key}>
              <div className={`service-icon-box ${val ? "success" : "error"}`}>
                {val ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
              </div>
              <span className="service-title-text">{key === "transport" ? "TRANSFERS" : key.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2022</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">TOUR ADVISOR</span>
            <span className="footer-col-text">VISHAL CHAUHAN (DARJI)</span>
            <span className="footer-col-text">Ph: 9328151481</span>
            <span className="footer-col-text">mahadevholidays2000@gmail.com</span>
          </div>
          <span className="page-badge">Page 2/{totalPages}</span>
        </div>
      </div>

      {/* Page 2: Pricing & Accommodation Stay Details (Hotel Stay below Pricing Cards) */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="page-title">Package Pricing Details</div>

        {/* Pricing Summary Card */}
        <div className="price-card-box" style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 18px" }}>
          <div className="price-row-item" style={{ borderBottom: "1px dashed #c5a059", paddingBottom: "6px" }}>
            <span className="price-label-text" style={{ fontSize: "1.05rem" }}>TOTAL PACKAGE PRICE :</span>
            <span className="price-total-text">Rs. {parseFloat(data.totalPrice || "0").toLocaleString("en-IN")}/-</span>
          </div>
          <div className="price-row-item" style={{ borderBottom: "1px dashed #cbd5e1", paddingBottom: "4px" }}>
            <span className="price-label-text" style={{ fontSize: "0.85rem", color: "#64748b" }}>ADVANCE PAYMENT RECEIVED :</span>
            <span style={{ fontSize: "1.05rem", fontWeight: "bold", color: "#065f46" }}>
              Rs. {parseFloat(data.advancePrice || "0").toLocaleString("en-IN")}/-
            </span>
          </div>
          <div className="price-row-item">
            <span className="price-label-text" style={{ fontSize: "0.9rem", color: "#0a2540", fontWeight: "800" }}>BALANCE PAYMENT DUE :</span>
            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#b91c1c" }}>
              Rs. {((parseFloat(data.totalPrice || "0") || 0) - (parseFloat(data.advancePrice || "0") || 0)).toLocaleString("en-IN")}/-
            </span>
          </div>
        </div>

        {/* Hotel Stay Cards - Placed BELOW Pricing Card */}
        {data.hotels && data.hotels.map((hotel, index) => {
          const hotelCheckInFormatted = formatDateTime(hotel.hotelCheckIn);
          const hotelCheckOutFormatted = formatDateTime(hotel.hotelCheckOut);
          return (
            <div className="hotel-detail-card" key={hotel.id || index} style={{ marginTop: "0.5rem" }}>
              <div className="hotel-text-info">
                <div className="hotel-name-row-preview">
                  <div className="hotel-headline">
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(hotel.hotelName)}`} target="_blank" rel="noopener noreferrer" className="hotel-headline-link">
                      {hotel.hotelName || ""}
                    </a>
                  </div>
                  {renderStarsHtml(hotel.hotelStar)}
                </div>
              </div>

              <div className="hotel-img-placeholder">
                <img src={hotel.hotelImage || "/hotel.png"} alt="Hotel Cover" className="hotel-img" />
              </div>

              <div className="hotel-field-grid">
                <div className="hotel-field-row">
                  <span className="hotel-field-label">Room Type:</span>
                  <span className="hotel-field-value">{hotel.hotelRoomType || ""}</span>
                </div>
                <div className="hotel-field-row">
                  <span className="hotel-field-label">Meal Plan:</span>
                  <span className="hotel-field-value">{hotel.hotelMealPlan || ""}</span>
                </div>
                <div className="hotel-field-row">
                  <span className="hotel-field-label">Check-in:</span>
                  <span className="hotel-field-value">{hotelCheckInFormatted}</span>
                </div>
                <div className="hotel-field-row">
                  <span className="hotel-field-label">Check-out:</span>
                  <span className="hotel-field-value">{hotelCheckOutFormatted}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2022</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">TOUR ADVISOR</span>
            <span className="footer-col-text">VISHAL CHAUHAN (DARJI)</span>
            <span className="footer-col-text">Ph: 9328151481</span>
            <span className="footer-col-text">mahadevholidays2000@gmail.com</span>
          </div>
          <span className="page-badge">Page 3/{totalPages}</span>
        </div>
      </div>

      {/* Detailed daily timeline - One Page Per Day (Giant photos vertically stacked) */}
      {(data.itinerary || []).map((dayItem, idx) => (
        <div className="pdf-page-mock" key={dayItem.day || idx}>
          <div className="pdf-header">
            <div className="pdf-header-main">
              <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
            </div>
          </div>

          <div className="page-title">Tour Itinerary Details (Day {dayItem.day})</div>

          <div className="itinerary-timeline-wrapper">
            <div className="itinerary-day-card" style={{ marginBottom: 0 }}>
              <div className="itinerary-day-title-row">
                <span className="itinerary-day-label">Day {dayItem.day}: {dayItem.title || ""}</span>
                {dayItem.stay && <span className="itinerary-day-stay-tag">Stay: {dayItem.stay}</span>}
              </div>
              
              {/* Daily big photo block */}
              <div className="itinerary-day-big-img-box">
                <img src={dayItem.image || getDayImagePreview(dayItem.day)} alt={`Day ${dayItem.day}`} className="day-itinerary-big-img" />
              </div>

              <p className="itinerary-day-description-text">{dayItem.description || ""}</p>
              
              <div className="itinerary-meta-row-preview">
                {dayItem.mealPlan && <div className="itinerary-day-meal-plan-text">Meals: {dayItem.mealPlan}</div>}
                <div className="itinerary-badge-green-preview">
                  {getDayItineraryTransferText(dayItem, data)}
                </div>
              </div>
            </div>
          </div>

          <div className="pdf-footer">
            <div className="footer-left">
              <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
            </div>
            <div className="footer-col">
              <span className="footer-col-title">OUR ACHIEVEMENTS</span>
              <span className="footer-col-text">Estd: 2022</span>
              <span className="footer-col-text">Govt Approved Tour Operator</span>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">LEGAL INFO</span>
              <span className="footer-col-text">Approved by Ministry of Tourism</span>
              <span className="footer-col-text">Government of India</span>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">TOUR ADVISOR</span>
              <span className="footer-col-text">VISHAL CHAUHAN (DARJI)</span>
              <span className="footer-col-text">Ph: 9328151481</span>
              <span className="footer-col-text">mahadevholidays2000@gmail.com</span>
            </div>
            <span className="page-badge">Page {4 + idx}/{totalPages}</span>
          </div>
        </div>
      ))}

      {/* Page 5: Terms & Policies */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="page-title">Terms & Policies</div>

        <div className="policies-split-layout">
          {/* Inclusions */}
          <div className="policy-col inc-box">
            <div className="policy-col-title inclusions">Inclusions</div>
            <ul className="policy-list-items">
              {(data.inclusions || []).map((item, idx) => (
                <li className="policy-list-item-row" key={idx}>
                  <Check size={10} className="policy-list-bullet-icon" style={{ color: "#10b981" }} />
                  <span>{item || ""}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="policy-col exc-box">
            <div className="policy-col-title exclusions">Exclusions</div>
            <ul className="policy-list-items">
              {(data.exclusions || []).map((item, idx) => (
                <li className="policy-list-item-row" key={idx}>
                  <X size={10} className="policy-list-bullet-icon" style={{ color: "#ef4444" }} />
                  <span>{item || ""}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment & Booking Policies Grid */}
        <div className="policies-split-layout">
          {/* Payment Policies */}
          <div className="policy-block-card-preview-payment">
            <div className="policy-col-title payment">Payment Policies</div>
            <ul className="policy-list-items">
              {(data.paymentPolicies || []).map((item, idx) => (
                <li className="policy-list-item-row" key={idx}>
                  <Check size={10} className="policy-list-bullet-icon" style={{ color: "#1e3a8a" }} />
                  <span>{item || ""}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cancellation Policies */}
          <div className="policy-block-card-preview-cancellation">
            <div className="policy-col-title cancellation">Cancellation Policies</div>
            <ul className="policy-list-items">
              {(data.cancellationPolicies || []).map((item, idx) => (
                <li className="policy-list-item-row" key={idx}>
                  <X size={10} className="policy-list-bullet-icon" style={{ color: "#ea580c" }} />
                  <span>{item || ""}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="abbreviation-box" style={{ marginTop: "1rem" }}>
          <div className="abbrev-title-header">ABBREVIATIONS & PLAN CODES</div>
          <div>EP: Room Only (No Meals) | CP: Breakfast Only | MAP: Breakfast + Dinner | AP: Breakfast + Lunch + Dinner</div>
        </div>

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2022</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">TOUR ADVISOR</span>
            <span className="footer-col-text">VISHAL CHAUHAN (DARJI)</span>
            <span className="footer-col-text">Ph: 9328151481</span>
            <span className="footer-col-text">mahadevholidays2000@gmail.com</span>
          </div>
          <span className="page-badge">Page {4 + (data.itinerary || []).length}/{totalPages}</span>
        </div>
      </div>

      {/* Page 6: Account Details, Brand Profile & Thank You */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="page-title">Account & booking information</div>

        <div className="bank-details-card-preview">
          <div className="bank-details-title-preview">CURRENT ACCOUNT DETAILS</div>
          <table className="bank-detail-table">
            <tbody>
              <tr>
                <td className="bank-detail-lbl">Bank Name:</td>
                <td className="bank-detail-val">Indusind Bank</td>
              </tr>
              <tr>
                <td className="bank-detail-lbl">Account Number:</td>
                <td className="bank-detail-val">259328151481</td>
              </tr>
              <tr>
                <td className="bank-detail-lbl">IFSC Code:</td>
                <td className="bank-detail-val">INDB0001669</td>
              </tr>
              <tr>
                <td className="bank-detail-lbl">Account Name:</td>
                <td className="bank-detail-val">Mahadev Online</td>
              </tr>
              <tr>
                <td className="bank-detail-lbl">UPI / Payment Modes:</td>
                <td className="bank-detail-val">
                  9664545613 | 9328151481
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Brand Work Profile Section (Moved here to the last page by default!) */}
        <div className="brand-profile-preview-card">
          <div className="brand-profile-hl">Mahadev Holidays,</div>
          <div className="brand-profile-gov">Approved by the Ministry of Tourism Government of India.</div>
          <div className="brand-profile-adr">Shop.no-26, Above Alex Tailor, Bus Station Road, Gurunanak Chowk, Palanpur, B.K, Guj (385001)</div>
          
          <div className="brand-preview-divider"></div>
          
          <div className="brand-preview-lbl">SERVICES OFFERED :</div>
          <div className="brand-preview-list">
            FLIGHT TICKETS | HOTEL BOOKING | RAIL TICKET | BUS BOOKING | CAB BOOKING | HOLIDAY PACKAGES | HONEYMOON PACKAGES | FAMILY PACKAGES | ADVENTURE TOURS | WILDLIFE TOURS | CORPORATE TOURS | GROUP TOURS | HERITAGE & CULTURE TOURS | TREKKING PACKAGES
          </div>

          <div className="brand-preview-lbl" style={{ marginTop: "6px" }}>DESTINATIONS COVERED :</div>
          <div className="brand-preview-list">
            HIMACHAL | SPITI VALLEY | UTTRAKHAND | LADAKH | KASHMIR | NORTH EAST INDIA | RAJASTHAN | KERALA | GOA | BHUTAN | NEPAL | SRI LANKA | GUJARAT
          </div>
        </div>

        <div className="thank-you-banner">
          <span className="thank-you-large-text">THANK YOU</span>
          <span className="thank-you-brand-sub">MAHADEV ONLINE AND TOUR TRAVELS</span>
          <div className="thank-you-links-row">
            <a href="https://share.google/uKI9joTM9gh5KYzWR" target="_blank" rel="noopener noreferrer" className="thank-you-link-item">
              View Location on Google Maps
            </a>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <a href="https://wa.me/919328151481" target="_blank" rel="noopener noreferrer" className="thank-you-link-item">
              Chat on WhatsApp (9328151481)
            </a>
          </div>
        </div>

        {/* Tour Advisor Details Card on Last Page */}
        <div style={{
          marginTop: "15px",
          padding: "12px",
          backgroundColor: "#faf6eb",
          border: "1.5px solid #c5a059",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "10px", fontWeight: "bold", color: "#0a2540", marginBottom: "4px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Your Tour Advisor
          </span>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#c5a059", marginBottom: "2px" }}>
            VISHAL CHAUHAN (DARJI)
          </span>
          <span style={{ fontSize: "9.5px", color: "#0a2540", fontWeight: "bold" }}>
            Phone: +91 9328151481   |   Email: mahadevholidays2000@gmail.com
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1rem" }}>
          <img src="/logo.jpg" alt="Mahadev Holidays Large Logo" style={{ height: "60px", width: "auto", opacity: 0.9 }} />
        </div>

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2022</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">TOUR ADVISOR</span>
            <span className="footer-col-text">VISHAL CHAUHAN (DARJI)</span>
            <span className="footer-col-text">Ph: 9328151481</span>
            <span className="footer-col-text">mahadevholidays2000@gmail.com</span>
          </div>
          <span className="page-badge">Page {5 + (data.itinerary || []).length}/{totalPages}</span>
        </div>
      </div>
    </div>
  );
};
