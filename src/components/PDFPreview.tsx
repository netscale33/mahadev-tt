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

interface ItineraryDay {
  day: number;
  title: string;
  stay: string;
  description: string;
  mealPlan: string;
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
  pickDrop: string;
  mealPlan: string;
  hotelStar: string;
  services: ServiceStatus;
  hotelName: string;
  hotelRoomType: string;
  hotelMealPlan: string;
  hotelCheckIn: string;
  hotelCheckOut: string;
  pricePerPerson: string;
  totalPrice: string;
  gstExtra: boolean;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  paymentPolicies: string[];
  cancellationPolicies: string[];
  bookingTerms: string[];
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

export const PDFPreview: React.FC<{ data: PDFData }> = ({ data }) => {
  const formattedArrival = formatPreviewDate(data.arrivalDate);
  const formattedCheckIn = formatDateTime(data.hotelCheckIn);
  const formattedCheckOut = formatDateTime(data.hotelCheckOut);

  // Split itinerary: Days 1-2 on Page 3, Days 3-4 on Page 4
  const page3Days = (data.itinerary || []).filter(d => d.day <= 2);
  const page4Days = (data.itinerary || []).filter(d => d.day > 2);

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
          padding: 85px 45px 70px 45px; /* Restored standard padding */
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
          height: 52px;
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
          height: 140px;
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
          background-color: #0a2540;
          border: 2px solid #c5a059;
          border-radius: 8px;
          padding: 1.1rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .price-row-item {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 1.1rem;
        }

        .price-label-text {
          font-weight: 700;
          color: #ffffff;
        }

        .price-value-text {
          font-weight: 700;
          color: #c5a059;
        }

        .price-total-text {
          font-size: 1.55rem;
          font-weight: 800;
          color: #c5a059;
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
          height: 140px; /* Giant height */
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

      {/* Page 1: Overview Cover Sheet & Services */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="cover-photo-wrapper">
          <Image src="/goa.png" alt="Goa Cover" width={515} height={230} className="cover-photo" />
          <div className="cover-overlay">
            <h2>{(data.destination || "").toUpperCase()}</h2>
            <span className="cover-badge">PREMIUM QUOTATION</span>
          </div>
        </div>

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
            <div className="details-value-cell">{data.vehicleType || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Pick & Drop Point</div>
            <div className="details-value-cell">{data.pickDrop || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Meal Plan</div>
            <div className="details-value-cell">{data.mealPlan || ""}</div>
          </div>
          <div className="details-grid-row">
            <div className="details-label-cell">Hotel (Stay Category)</div>
            <div className="details-value-cell">{data.hotelStar || ""}</div>
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
            <span className="footer-col-text">Estd: 2000</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <span className="page-badge">Page 1/6</span>
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
        <div className="price-card-box">
          {data.pricePerPerson && (
            <div className="price-row-item" style={{ marginBottom: "0.25rem" }}>
              <span className="price-label-text">PRICE PER PERSON :</span>
              <span className="price-value-text">Rs. {data.pricePerPerson}/-</span>
            </div>
          )}
          <div className="price-row-item">
            <span className="price-label-text" style={{ fontSize: "1.1rem" }}>TOTAL PACKAGE PRICE :</span>
            <span className="price-total-text">Rs. {data.totalPrice}/-</span>
          </div>
          {data.gstExtra && (
            <div className="price-gst-sub">+ 5% GST EXTRA WILL BE CHARGED</div>
          )}
        </div>

        <div className="page-title">Hotel Stay Details</div>

        {/* Hotel Stay Card - Placed BELOW Pricing Card with HUGE Image */}
        <div className="hotel-detail-card">
          <div className="hotel-text-info">
            <div className="hotel-name-row-preview">
              <div className="hotel-headline">
                <a href="https://www.google.com/search?q=Alvorada+Resort+Arpora+Goa" target="_blank" rel="noopener noreferrer" className="hotel-headline-link">
                  {data.hotelName || ""}
                </a>
              </div>
              {renderStarsHtml(data.hotelStar)}
            </div>
          </div>

          <div className="hotel-img-placeholder">
            <Image src="/hotel.png" alt="Hotel Cover" fill className="hotel-img" />
          </div>

          <div className="hotel-field-grid">
            <div className="hotel-field-row">
              <span className="hotel-field-label">Room Type:</span>
              <span className="hotel-field-value">{data.hotelRoomType || ""}</span>
            </div>
            <div className="hotel-field-row">
              <span className="hotel-field-label">Meal Plan:</span>
              <span className="hotel-field-value">{data.hotelMealPlan || ""}</span>
            </div>
            <div className="hotel-field-row">
              <span className="hotel-field-label">Check-in:</span>
              <span className="hotel-field-value">{formattedCheckIn}</span>
            </div>
            <div className="hotel-field-row">
              <span className="hotel-field-label">Check-out:</span>
              <span className="hotel-field-value">{formattedCheckOut}</span>
            </div>
          </div>
        </div>

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2000</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <span className="page-badge">Page 2/6</span>
        </div>
      </div>

      {/* Page 3: Detailed daily timeline Day 1 & 2 (Giant photos vertically stacked) */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="page-title">Tour Itinerary Details (Day 1 & 2)</div>

        <div className="itinerary-timeline-wrapper">
          {page3Days.map((dayItem, idx) => (
            <div className="itinerary-day-card" key={idx}>
              <div className="itinerary-day-title-row">
                <span className="itinerary-day-label">Day {dayItem.day}: {dayItem.title || ""}</span>
                {dayItem.stay && <span className="itinerary-day-stay-tag">Stay: {dayItem.stay}</span>}
              </div>
              
              {/* Daily big photo block */}
              <div className="itinerary-day-big-img-box">
                <Image src={getDayImagePreview(dayItem.day)} alt={`Day ${dayItem.day}`} fill className="day-itinerary-big-img" />
              </div>

              <p className="itinerary-day-description-text">{dayItem.description || ""}</p>
              
              <div className="itinerary-meta-row-preview">
                {dayItem.mealPlan && <div className="itinerary-day-meal-plan-text">Meals Included: (B) {dayItem.mealPlan}</div>}
                <div className="itinerary-badge-green-preview">
                  {dayItem.day === 4 ? "Departure Transfer" : dayItem.day === 1 ? "Private Transfer" : "Sightseeing Transfer"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2000</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <span className="page-badge">Page 3/6</span>
        </div>
      </div>

      {/* Page 4: Detailed daily timeline Day 3 & 4 (Giant photos vertically stacked) */}
      <div className="pdf-page-mock">
        <div className="pdf-header">
          <div className="pdf-header-main">
            <Image src="/logo.jpg" alt="Mahadev Holidays Logo" width={180} height={52} className="pdf-logo-large" />
          </div>
        </div>

        <div className="page-title">Tour Itinerary Details (Day 3 & 4)</div>

        <div className="itinerary-timeline-wrapper">
          {page4Days.map((dayItem, idx) => (
            <div className="itinerary-day-card" key={idx}>
              <div className="itinerary-day-title-row">
                <span className="itinerary-day-label">Day {dayItem.day}: {dayItem.title || ""}</span>
                {dayItem.stay && <span className="itinerary-day-stay-tag">Stay: {dayItem.stay}</span>}
              </div>
              
              {/* Daily big photo block */}
              <div className="itinerary-day-big-img-box">
                <Image src={getDayImagePreview(dayItem.day)} alt={`Day ${dayItem.day}`} fill className="day-itinerary-big-img" />
              </div>

              <p className="itinerary-day-description-text">{dayItem.description || ""}</p>

              <div className="itinerary-meta-row-preview">
                {dayItem.mealPlan && <div className="itinerary-day-meal-plan-text">Meals Included: (B) {dayItem.mealPlan}</div>}
                <div className="itinerary-badge-green-preview">
                  {dayItem.day === 4 ? "Departure Transfer" : dayItem.day === 1 ? "Private Transfer" : "Sightseeing Transfer"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2000</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <span className="page-badge">Page 4/6</span>
        </div>
      </div>

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
            <span className="footer-col-text">Estd: 2000</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <span className="page-badge">Page 5/6</span>
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

        <div className="pdf-footer">
          <div className="footer-left">
            <Image src="/logo.jpg" alt="Logo" width={80} height={28} className="pdf-logo-small" />
          </div>
          <div className="footer-col">
            <span className="footer-col-title">OUR ACHIEVEMENTS</span>
            <span className="footer-col-text">Estd: 2000</span>
            <span className="footer-col-text">Govt Approved Tour Operator</span>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">LEGAL INFO</span>
            <span className="footer-col-text">Approved by Ministry of Tourism</span>
            <span className="footer-col-text">Government of India</span>
          </div>
          <span className="page-badge">Page 6/6</span>
        </div>
      </div>
    </div>
  );
};
