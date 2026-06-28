"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PackageForm } from "./PackageForm";
import { PDFPreview } from "./PDFPreview";
import { Download, Edit3, Eye } from "lucide-react";

// Default Goa data pre-populated from the user's Goa PDF
const defaultGoaData = {
  guestName: "Mahadev Tour & Travels ( Vishal )",
  destination: "Goa",
  arrivalDate: "2026-08-09", // Standard date format for HTML5 calendar
  durationNights: 3,
  durationDays: 4,
  numPax: "5 Adults",
  numRooms: "2 Rooms",
  vehicleType: "AC Sedan (Ertiga / SUV)",
  pickDrop: "Thivim Railway Station / Madgaon Station",
  mealPlan: "CP (Breakfast Only)",
  hotelStar: "3 Star (Deluxe)",
  services: {
    flights: false,
    hotels: true,
    tours: true,
    transport: true,
    cruise: true,
    addons: false,
  },
  hotelName: "Alvorada Resort (Arpora)",
  hotelRoomType: "Super Deluxe Room Pool View",
  hotelMealPlan: "Breakfast Only (CP)",
  hotelCheckIn: "2026-08-09T14:00",
  hotelCheckOut: "2026-08-12T12:00",
  pricePerPerson: "6860",
  totalPrice: "34300",
  gstExtra: true,
  itinerary: [
    {
      day: 1,
      title: "Pickup From Thivim Railway Station",
      stay: "Alvorada Resort (Arpora)",
      mealPlan: "No Meals (EP)",
      description: "Begin your Goa adventure with convenience and comfort as you arrive at Thivim Railway Station. Our reliable private transfer service ensures a seamless transition from your train journey to your resort, eliminating the hassle of arranging local transport. Spend the rest of the day relaxing at the resort pool or exploring nearby beaches.",
    },
    {
      day: 2,
      title: "01 Day North Goa Sightseeing on PVT Basis",
      stay: "Alvorada Resort (Arpora)",
      mealPlan: "Breakfast Included (CP)",
      description: "After breakfast, depart for a full day of sightseeing in North Goa. Explore famous locations including Baga Beach, Fort Aguada, Sinquerim Fort, Calangute Beach, Candolim Beach, and Anjuna Beach. Optional visit to Snow Park (tickets extra). In the evening, enjoy a shared Dinner Cruise on the Arabian Sea with live entertainment and multi-cuisine buffet.",
    },
    {
      day: 3,
      title: "01 Day South Goa Sightseeing on PVT Basis",
      stay: "Alvorada Resort (Arpora)",
      mealPlan: "Breakfast Included (CP)",
      description: "After breakfast, proceed for South Goa sightseeing on a private basis. Key spots include Mangueshi Temple, Old Goa White Churches, Balaji Temple, ST. Augustine Tower, Miramar Beach, and Dona Paula. Optional activities include a Dolphin Show or Boat Cruise (tickets extra). Return to hotel for overnight stay.",
    },
    {
      day: 4,
      title: "Drop to Madgaon Railway Station",
      stay: "Departure",
      mealPlan: "Breakfast Included (CP)",
      description: "Enjoy breakfast at the resort. Pack your bags and check out (by 12:00 PM). Our driver will pick you up from the resort lobby and drop you to Madgaon Railway Station for your return train. Return home with beautiful memories of your luxury Goa trip.",
    },
  ],
  inclusions: [
    "3 Nights accommodation in 3 Star Alvorada Resort",
    "Daily buffet breakfast at hotel (CP plan)",
    "Private pickup from Thivim Railway Station (Ertiga/SUV)",
    "Private drop to Madgaon Railway Station (Ertiga/SUV)",
    "North Goa sightseeing in private AC vehicle",
    "South Goa sightseeing in private AC vehicle",
    "Shared Dinner Cruise (Princessa or Paradise) with buffet dinner & music",
    "All taxes, tolls, parking, driver batta, and fuel charges included",
  ],
  exclusions: [
    "Flight, train, or bus tickets from home town",
    "Lunch and Dinner (except cruise dinner)",
    "Entrance fees to monuments, camera charges, and guide fees",
    "Portage, tips, laundry, alcoholic/non-alcoholic drinks, phone calls, etc.",
    "Additional vehicle usage not specified in the itinerary",
  ],
  paymentPolicies: [
    "50% booking deposit required at time of reservation.",
    "Remaining 50% balance to be paid before travel date or at check-in.",
  ],
  cancellationPolicies: [
    "Package is fully non-refundable once booked.",
    "Date changes subject to hotel availability and charge updates.",
  ],
  bookingTerms: [
    "Rates are dynamic and subject to change without prior notice.",
    "Standard check-in time is 2:00 PM; checkout is 12:00 PM.",
  ],
};

// Add days to date helper
const calculateCheckOutDate = (arrivalDateStr: string, nights: number) => {
  if (!arrivalDateStr) return "";
  const date = new Date(arrivalDateStr);
  if (isNaN(date.getTime())) return arrivalDateStr;
  date.setDate(date.getDate() + nights);
  
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function TravelPortal() {
  const [formData, setFormData] = useState<typeof defaultGoaData>(defaultGoaData);
  const [formStep, setFormStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfLibrary, setPdfLibrary] = useState<any>(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");

  // Drag resizer width state (percentage, starts at 65% for form, 35% for preview)
  const [leftWidth, setLeftWidth] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load @react-pdf/renderer dynamically on client-side
  useEffect(() => {
    setIsMounted(true);
    import("@react-pdf/renderer").then((mod) => {
      setPdfLibrary(mod);
    });

    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mouse Move resize handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain width percentage between 25% and 75% to prevent collapse
      if (newLeftWidth >= 25 && newLeftWidth <= 75) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDoubleClick = () => {
    // Reset to default 65% width split
    setLeftWidth(65);
  };

  // Update check-in, check-out dates and itinerary when arrivalDate changes
  const handleDataChange = (newData: typeof defaultGoaData) => {
    const prevArrival = formData.arrivalDate;
    const newArrival = newData.arrivalDate;
    const nights = newData.durationNights;

    // Check if arrival date changed and is valid
    if (newArrival !== prevArrival && newArrival.includes("-")) {
      const checkoutDateStr = calculateCheckOutDate(newArrival, nights);
      
      newData.hotelCheckIn = `${newArrival}T14:00`;
      newData.hotelCheckOut = `${checkoutDateStr}T12:00`;
      
      // Update check-in date inside Day 1 hotel stay if present
      if (newData.itinerary[0]) {
        newData.itinerary[0].stay = newData.hotelName;
      }
    }

    setFormData(newData);
  };

  const handleDownloadPDF = async () => {
    if (!pdfLibrary) return;
    setIsGenerating(true);

    try {
      const { PDFDocumentComponent } = await import("./PDFDocument");
      
      const blob = await pdfLibrary.pdf(<PDFDocumentComponent data={formData} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const sanitizedName = formData.guestName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `Mahadev_Holidays_Goa_${sanitizedName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Error compiling PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Mahadev Holidays Engine...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #0f172a;
            color: #ffffff;
            gap: 1.5rem;
          }
          .loading-spinner {
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top: 3px solid #d4af37;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ userSelect: isDragging ? "none" : "auto" }}>
      {/* Header */}
      <header className="portal-header">
        <div className="logo-container">
          <Image
            src="/logo.jpg"
            alt="Mahadev Holidays Logo"
            width={150}
            height={40}
            className="logo-image"
          />
          <div className="brand-details">
            <span className="brand-name">Mahadev Holidays</span>
            <span className="brand-tagline">Explore • Experience • Enjoy</span>
          </div>
        </div>

        <div className="user-badge">
          <div className="user-avatar">V</div>
          <div className="brand-details">
            <span className="user-name">Vishal Chauhan</span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>Tour Advisor</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="workspace-view-wrapper">
          {/* Top Workspace Bar */}
          <div className="workspace-header-bar">
            <div className="workspace-title-info">
              <strong>Mahadev Holidays Quotation Builder</strong>
              <span className="divider-dot"></span>
              <span>Goa Destination Package</span>
            </div>

            <button 
              className="btn btn-accent" 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
            >
              <Download size={16} />
              {isGenerating ? "Compiling..." : "Download PDF Quotation"}
            </button>
          </div>

          {/* Segmented Mobile Tab Switcher */}
          {isMobile && (
            <div className="mobile-tabs-container">
              <button 
                className={`mobile-tab-btn ${activeMobileTab === "edit" ? "active" : ""}`}
                onClick={() => setActiveMobileTab("edit")}
              >
                <Edit3 size={16} />
                <span>Edit Details</span>
              </button>
              <button 
                className={`mobile-tab-btn ${activeMobileTab === "preview" ? "active" : ""}`}
                onClick={() => setActiveMobileTab("preview")}
              >
                <Eye size={16} />
                <span>View Preview</span>
              </button>
            </div>
          )}

          {/* Workspace Panels (Responsive logic) */}
          <div className="split-workspace-panels" ref={containerRef}>
            {isMobile ? (
              // Mobile Single Tab View
              activeMobileTab === "edit" ? (
                <div className="workspace-panel-form" style={{ width: "100%" }}>
                  <PackageForm
                    data={formData}
                    onChange={handleDataChange}
                    activeStep={formStep}
                    setActiveStep={setFormStep}
                    onDownload={handleDownloadPDF}
                    isGenerating={isGenerating}
                  />
                </div>
              ) : (
                <div className="workspace-panel-preview" style={{ width: "100%" }}>
                  <PDFPreview data={formData} />
                </div>
              )
            ) : (
              // Desktop Dual-Split View with Resizer
              <>
                {/* Left Pane - Form */}
                <div className="workspace-panel-form" style={{ width: `${leftWidth}%` }}>
                  <PackageForm
                    data={formData}
                    onChange={handleDataChange}
                    activeStep={formStep}
                    setActiveStep={setFormStep}
                    onDownload={handleDownloadPDF}
                    isGenerating={isGenerating}
                  />
                </div>

                {/* Draggable Resizer Bar */}
                <div 
                  className={`workspace-resizer-bar ${isDragging ? "active" : ""}`}
                  onMouseDown={handleMouseDown}
                  onDoubleClick={handleDoubleClick}
                  title="Drag to resize, Double-click to reset"
                >
                  <div className="grab-handle"></div>
                </div>

                {/* Right Pane - High fidelity preview */}
                <div className="workspace-panel-preview" style={{ width: `${100 - leftWidth}%` }}>
                  <PDFPreview data={formData} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        /* WORKSPACE PANELS */
        .workspace-view-wrapper {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 81px); /* Header height sub */
        }

        .workspace-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 2rem;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .workspace-title-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
        }

        .divider-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--border-color);
        }

        .split-workspace-panels {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .workspace-panel-form {
          height: 100%;
          overflow: hidden;
        }

        .workspace-panel-preview {
          height: 100%;
          background-color: #f1f5f9;
        }

        /* Resizer Bar Styling */
        .workspace-resizer-bar {
          width: 8px;
          background-color: var(--border-color);
          cursor: col-resize;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s ease;
        }

        .workspace-resizer-bar:hover,
        .workspace-resizer-bar.active {
          background-color: var(--accent);
        }

        .grab-handle {
          width: 4px;
          height: 24px;
          background-color: var(--text-muted);
          border-radius: 2px;
          opacity: 0.5;
        }

        .workspace-resizer-bar:hover .grab-handle,
        .workspace-resizer-bar.active .grab-handle {
          background-color: var(--bg-dark);
          opacity: 0.9;
        }

        /* PREMIUM BUTTON STYLING */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .btn-accent {
          background: linear-gradient(135deg, #d4af37 0%, #c5a059 100%);
          color: #0f172a;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
        }

        .btn-accent:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(212, 175, 55, 0.35);
        }

        .btn-accent:active {
          transform: translateY(0);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* MOBILE TAB SYSTEM */
        .mobile-tabs-container {
          display: flex;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 0.5rem;
          gap: 0.5rem;
          z-index: 10;
        }

        .mobile-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          background-color: var(--bg-primary);
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-tab-btn.active {
          background-color: var(--primary);
          color: #ffffff;
          box-shadow: var(--shadow-md);
        }

        /* Responsive items */
        @media (max-width: 1024px) {
          .portal-header {
            padding: 1rem 1.25rem;
          }

          .brand-name {
            font-size: 1.25rem;
          }

          .workspace-header-bar {
            padding: 0.75rem 1.25rem;
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
            text-align: center;
          }

          .workspace-title-info {
            justify-content: center;
            font-size: 0.85rem;
          }

          .btn-accent {
            width: 100%;
            padding: 0.8rem;
            font-size: 0.95rem;
          }

          .workspace-view-wrapper {
            height: calc(100vh - 71px); /* Sub Header height on mobile */
          }
        }
      `}</style>
    </div>
  );
}
