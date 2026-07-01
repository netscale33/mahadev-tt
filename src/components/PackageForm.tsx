import React, { useRef, useEffect } from "react";
import { Plus, Trash2, ChevronRight, ChevronLeft, Download, Upload, Image as ImageIcon } from "lucide-react";
import { convertNumberToWords } from "./wordsHelper";

interface ServiceStatus {
  flights: boolean;
  train: boolean;
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
  mealPlan: string;
  description: string;
  image?: string;
  transferBasis?: string;
  customTransferBasis?: string;
}
export interface HotelItem {
  id: string;
  hotelName: string;
  hotelStar: string;
  hotelRoomType: string;
  hotelMealPlan: string;
  hotelCheckIn: string;
  hotelCheckOut: string;
  hotelImage: string;
}

export interface PDFData {
  guestName: string;
  destination: string;
  arrivalDate: string;
  durationNights: number;
  durationDays: number;
  numPax: string; // Used for "No. of People"
  numRooms: string;
  vehicleType: string;
  transferBasis?: string;
  customTransferBasis?: string;
  trainPricePerPerson?: string;
  trainPriceTotal?: string;
  flightPricePerPerson?: string;
  flightPriceTotal?: string;
  pickupPoint: string;
  dropPoint: string;
  pickDrop?: string;
  mealPlan: string;
  hotelStar: string;
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
  id?: string;
  isDefault?: boolean;
  tourCode?: string;
  receiptNo?: string;
  paymentDate?: string;
  paymentRefId?: string;
  paymentMode?: string;
  paymentAmountPaid?: string;
  paymentAmountInWords?: string;
  paymentPaidBy?: string;
  voucherPhone?: string;
  voucherConfNo?: string;
  version?: number;
}
interface PackageFormProps {
  data: PDFData;
  onChange: (newData: PDFData) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onDownload: () => void;
  isGenerating: boolean;
  mode?: "quotation" | "voucher";
}

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const getReceiptNo = (receiptNo?: string, tourCode?: string) => {
  if (receiptNo && receiptNo.trim() !== "") {
    return receiptNo;
  }
  const code = tourCode || "1011";
  const seed = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mixed = (seed * 9301 + 49297) % 233280;
  const randSuffix = 1000 + (mixed % 9000);
  return `55${randSuffix}`;
};

export const PackageForm: React.FC<PackageFormProps> = ({
  data,
  onChange,
  activeStep,
  setActiveStep,
  onDownload,
  isGenerating,
  mode = "quotation",
}) => {
  const stepsIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stepsIndicatorRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (mode === "voucher" && (!data.receiptNo || data.receiptNo.trim() === "")) {
      onChange({
        ...data,
        receiptNo: getReceiptNo(undefined, data.tourCode),
      });
    }
  }, [mode, data.tourCode, data.receiptNo]);
  const handleInputChange = (
    field: keyof PDFData,
    value: string | number | boolean
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const getPaxCount = (): number => {
    const parsed = parseInt(data.numPax);
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  };

  const handlePriceChange = (field: string, value: string) => {
    const paxCount = getPaxCount();
    const cleanVal = value.replace(/[^0-9]/g, ""); // Keep only digits
    const numVal = parseFloat(cleanVal) || 0;

    const updatedData = { ...data };

    if (field === "pricePerPerson") {
      updatedData.pricePerPerson = cleanVal;
      updatedData.totalPrice = cleanVal ? (numVal * paxCount).toString() : "";
    } else if (field === "totalPrice") {
      updatedData.totalPrice = cleanVal;
      updatedData.pricePerPerson = cleanVal ? Math.round(numVal / paxCount).toString() : "";
    } else if (field === "trainPricePerPerson") {
      updatedData.trainPricePerPerson = cleanVal;
      updatedData.trainPriceTotal = cleanVal ? (numVal * paxCount).toString() : "";
    } else if (field === "trainPriceTotal") {
      updatedData.trainPriceTotal = cleanVal;
      updatedData.trainPricePerPerson = cleanVal ? Math.round(numVal / paxCount).toString() : "";
    } else if (field === "flightPricePerPerson") {
      updatedData.flightPricePerPerson = cleanVal;
      updatedData.flightPriceTotal = cleanVal ? (numVal * paxCount).toString() : "";
    } else if (field === "flightPriceTotal") {
      updatedData.flightPriceTotal = cleanVal;
      updatedData.flightPricePerPerson = cleanVal ? Math.round(numVal / paxCount).toString() : "";
    } else {
      (updatedData as any)[field] = cleanVal;
    }

    onChange(updatedData);
  };

  const handleServiceChange = (service: keyof ServiceStatus, value: boolean) => {
    onChange({
      ...data,
      services: {
        ...data.services,
        [service]: value,
      },
    });
  };

  const handleHotelChange = (
    index: number,
    field: keyof HotelItem,
    value: string
  ) => {
    const updatedHotels = [...(data.hotels || [])];
    updatedHotels[index] = {
      ...updatedHotels[index],
      [field]: value,
    };
    onChange({
      ...data,
      hotels: updatedHotels,
    });
  };

  const addHotelStay = () => {
    const newHotel: HotelItem = {
      id: `hotel-${Date.now()}`,
      hotelName: "Standard Deluxe Stay",
      hotelStar: "3 Star (Deluxe)",
      hotelRoomType: "Standard Room",
      hotelMealPlan: "Breakfast Only (CP)",
      hotelCheckIn: data.arrivalDate ? `${data.arrivalDate}T14:00` : "",
      hotelCheckOut: data.arrivalDate ? `${data.arrivalDate}T12:00` : "",
      hotelImage: "",
    };
    onChange({
      ...data,
      hotels: [...(data.hotels || []), newHotel],
    });
  };

  const removeHotelStay = (index: number) => {
    const currentHotels = data.hotels || [];
    if (currentHotels.length <= 1) return;
    const updatedHotels = currentHotels.filter((_, i) => i !== index);
    onChange({
      ...data,
      hotels: updatedHotels,
    });
  };

  const [showDbManager, setShowDbManager] = React.useState(false);

  const addHotelToLibrary = () => {
    const newLibHotel: HotelItem = {
      id: `lib-hotel-${Date.now()}`,
      hotelName: "New Stored Hotel",
      hotelStar: "3 Star (Deluxe)",
      hotelRoomType: "Standard Room",
      hotelMealPlan: "Breakfast Only (CP)",
      hotelCheckIn: "",
      hotelCheckOut: "",
      hotelImage: "",
    };
    onChange({
      ...data,
      hotelLibrary: [...(data.hotelLibrary || []), newLibHotel],
    });
  };

  const removeHotelFromLibrary = (libIndex: number) => {
    const updatedLib = (data.hotelLibrary || []).filter((_, i) => i !== libIndex);
    onChange({
      ...data,
      hotelLibrary: updatedLib,
    });
  };

  const handleLibraryHotelChange = (
    libIndex: number,
    field: keyof HotelItem,
    value: string
  ) => {
    const updatedLib = [...(data.hotelLibrary || [])];
    updatedLib[libIndex] = {
      ...updatedLib[libIndex],
      [field]: value,
    };
    onChange({
      ...data,
      hotelLibrary: updatedLib,
    });
  };

  const prefillStayFromLibrary = (stayIndex: number, libHotelId: string) => {
    if (!libHotelId) return;
    const selectedLibHotel = (data.hotelLibrary || []).find(h => h.id === libHotelId);
    if (!selectedLibHotel) return;
    
    const updatedHotels = [...(data.hotels || [])];
    updatedHotels[stayIndex] = {
      ...updatedHotels[stayIndex],
      hotelName: selectedLibHotel.hotelName,
      hotelStar: selectedLibHotel.hotelStar,
      hotelRoomType: selectedLibHotel.hotelRoomType,
      hotelMealPlan: selectedLibHotel.hotelMealPlan,
      hotelImage: selectedLibHotel.hotelImage,
    };
    
    onChange({
      ...data,
      hotels: updatedHotels,
    });
  };

  const handleItineraryChange = (
    index: number,
    field: keyof ItineraryDay,
    value: string | number
  ) => {
    const updatedItinerary = [...(data.itinerary || [])];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value,
    };
    onChange({
      ...data,
      itinerary: updatedItinerary,
    });
  };

  const addItineraryDay = () => {
    const currentItinerary = data.itinerary || [];
    const nextDay = currentItinerary.length + 1;
    const newDay: ItineraryDay = {
      day: nextDay,
      title: `Day {nextDay} Sightseeing`,
      stay: data.destination || "Goa",
      description: "Sightseeing and leisure activities in Goa.",
      mealPlan: "CP",
    };
    onChange({
      ...data,
      durationDays: nextDay,
      durationNights: nextDay - 1,
      itinerary: [...currentItinerary, newDay],
    });
  };

  const removeItineraryDay = (index: number) => {
    const currentItinerary = data.itinerary || [];
    if (currentItinerary.length <= 1) return;
    const updatedItinerary = currentItinerary
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, day: idx + 1 }));
    
    onChange({
      ...data,
      durationDays: updatedItinerary.length,
      durationNights: updatedItinerary.length - 1,
      itinerary: updatedItinerary,
    });
  };

  const handleArrayChange = (
    field: "inclusions" | "exclusions",
    index: number,
    value: string
  ) => {
    const updatedArray = [...(data[field] || [])];
    updatedArray[index] = value;
    onChange({
      ...data,
      [field]: updatedArray,
    });
  };

  const addArrayItem = (field: "inclusions" | "exclusions") => {
    onChange({
      ...data,
      [field]: [...(data[field] || []), ""],
    });
  };

  const removeArrayItem = (field: "inclusions" | "exclusions", index: number) => {
    onChange({
      ...data,
      [field]: (data[field] || []).filter((_, i) => i !== index),
    });
  };



  const steps = [
    "General Details",
    "Accommodation Info",
    "Pricing & Services Include",
    "Day-by-Day Itinerary",
    "Terms & Policies",
  ];

  if (mode === "voucher") {
    return (
      <div className="form-panel-wrapper">
        <style jsx>{`
          .form-panel-wrapper {
            background-color: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            height: 100%;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow-sm);
          }
          .form-scroll-content {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            margin-bottom: 1.25rem;
          }
          .form-label {
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .form-input, .form-select {
            padding: 0.55rem 0.75rem;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            background-color: var(--bg-primary);
            color: var(--text-main);
            font-size: 0.9rem;
            transition: all 0.2s ease;
          }
          .form-input:focus, .form-select:focus {
            border-color: var(--accent);
            outline: none;
            box-shadow: 0 0 0 2px rgba(197, 160, 89, 0.15);
          }
          .form-nav-footer {
            padding: 1rem 1.25rem;
            background-color: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: center;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.6rem 1.25rem;
            font-weight: 700;
            font-size: 0.88rem;
            border-radius: var(--radius-sm);
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-accent {
            background-color: var(--accent);
            color: var(--primary);
            box-shadow: var(--shadow-sm);
          }
          .btn-accent:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
        `}</style>

        <div className="form-scroll-content">
          <div style={{ fontSize: "1.15rem", borderBottom: "2px solid var(--accent)", paddingBottom: "0.5rem", marginBottom: "1.5rem", fontWeight: "bold", color: "var(--primary)" }}>
            Booking Voucher & Payment Receipt Editor
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Row 1: Tour Code & Receipt No */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Quotation No.</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.tourCode || ""}
                  onChange={(e) => handleInputChange("tourCode", e.target.value)}
                  placeholder="E.g. 1011"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Receipt Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.receiptNo || ""}
                  onChange={(e) => handleInputChange("receiptNo", e.target.value)}
                  placeholder={`E.g. RCP-${data.tourCode || "1011"}`}
                />
              </div>
            </div>

            {/* Row 2: Payment Date & Reference ID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Payment Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={data.paymentDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Reference ID / Transaction ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.paymentRefId || "-"}
                  onChange={(e) => handleInputChange("paymentRefId", e.target.value)}
                  placeholder="E.g. UPI Ref Number or -"
                />
              </div>
            </div>

            {/* Row 3: Mode of Payment & Paid By */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Mode of Payment</label>
                <select
                  className="form-select"
                  value={data.paymentMode || "UPI"}
                  onChange={(e) => handleInputChange("paymentMode", e.target.value)}
                >
                  <option value="UPI">UPI / Google Pay / PhonePe</option>
                  <option value="CASH">CASH</option>
                  <option value="BANK TRANSFER">BANK TRANSFER (IMPS/NEFT/RTGS)</option>
                  <option value="CARD">CREDIT / DEBIT CARD</option>
                  <option value="CHEQUE">CHEQUE</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Paid By (Client Name)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.paymentPaidBy !== undefined ? data.paymentPaidBy : data.guestName}
                  onChange={(e) => handleInputChange("paymentPaidBy", e.target.value)}
                  placeholder="Client Name"
                />
              </div>
            </div>

            {/* Row 4: Client Phone & Amount Paid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Client Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.voucherPhone || ""}
                  onChange={(e) => handleInputChange("voucherPhone", e.target.value)}
                  placeholder="E.g. 9664545613"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Amount Paid (Rs.)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.paymentAmountPaid !== undefined ? data.paymentAmountPaid : (data.advancePrice || "")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    onChange({
                      ...data,
                      paymentAmountPaid: val,
                      paymentAmountInWords: convertNumberToWords(val),
                    });
                  }}
                  placeholder="E.g. 12000"
                />
              </div>
            </div>

            {/* Row 5: Amount in Words & Hotel Confirmation Details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Amount in Words</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.paymentAmountInWords !== undefined ? data.paymentAmountInWords : convertNumberToWords(data.advancePrice || "0")}
                  onChange={(e) => handleInputChange("paymentAmountInWords", e.target.value)}
                  placeholder="INR: Twelve Thousand Rupees Only"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: "bold" }}>Hotel Confirmation Number (Conf No)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.voucherConfNo || "-"}
                  onChange={(e) => handleInputChange("voucherConfNo", e.target.value)}
                  placeholder="E.g. CONF-889312 or -"
                />
              </div>
            </div>

            {/* Voucher Inclusions List Editor */}
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Voucher Inclusions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                {(data.inclusions || []).map((inc, index) => (
                  <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      className="form-input"
                      value={inc}
                      onChange={(e) => handleArrayChange("inclusions", index, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("inclusions", index)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fca5a5",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => addArrayItem("inclusions")}
                style={{
                  fontSize: "0.8rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "rgba(197, 160, 89, 0.1)",
                  color: "var(--accent)",
                  border: "1px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                <Plus size={12} /> Add Inclusion Item
              </button>
            </div>

            {/* Voucher Exclusions List Editor */}
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Voucher Exclusions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                {(data.exclusions || []).map((exc, index) => (
                  <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      className="form-input"
                      value={exc}
                      onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("exclusions", index)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fca5a5",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn"
                onClick={() => addArrayItem("exclusions")}
                style={{
                  fontSize: "0.8rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "rgba(197, 160, 89, 0.1)",
                  color: "var(--accent)",
                  border: "1px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                <Plus size={12} /> Add Exclusion Item
              </button>
            </div>
            
            <div style={{ backgroundColor: "#faf6eb", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px dashed var(--accent)", marginTop: "0.5rem" }}>
              <h4 style={{ color: "var(--primary)", fontWeight: "bold", margin: "0 0 0.5rem 0", fontSize: "0.85rem" }}>VOUCHER LINKED DETAILS:</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.45 }}>
                This voucher pulls hotel names, dates, rooms, passenger counts, itineraries, and terms directly from the Quotation builder. Modifying these fields updates only the receipt/payment information.
              </p>
            </div>
          </div>
        </div>

        <div className="form-nav-footer">
          <button
            type="button"
            className="btn btn-accent"
            onClick={onDownload}
            disabled={isGenerating}
            style={{ width: "100%" }}
          >
            <Download size={16} />
            {isGenerating ? "Generating Booking Voucher..." : "Download Booking Voucher PDF"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-panel-wrapper">
      <style jsx>{`
        .form-panel-wrapper {
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }

        .form-steps-indicator {
          display: flex;
          padding: 1rem 1.25rem;
          padding-bottom: 0.75rem;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          gap: 0.6rem;
          scrollbar-width: thin;
          scrollbar-color: var(--accent) var(--bg-primary);
        }

        .form-steps-indicator::-webkit-scrollbar {
          height: 4px;
          display: block;
        }

        .form-steps-indicator::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }

        .form-steps-indicator::-webkit-scrollbar-thumb {
          background-color: var(--accent);
          border-radius: 2px;
        }

        .form-steps-indicator::-webkit-scrollbar-thumb:hover {
          background-color: var(--accent-hover);
        }

        .step-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.95rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
          background-color: var(--bg-secondary);
          border: 1.5px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-badge:hover {
          border-color: var(--accent);
          color: var(--primary);
          background-color: rgba(212, 175, 55, 0.04);
          transform: translateY(-1px);
        }
        .step-badge.active {
          background-color: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 4px 10px rgba(10, 37, 64, 0.15);
        }

        .step-text-mobile {
          display: none;
        }

        @media (max-width: 1024px) {
          .step-text-desktop {
            display: none;
          }
          .step-text-mobile {
            display: inline;
          }
        }

        .form-scroll-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.75rem;
          animation: stepFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          scrollbar-width: thin;
          scrollbar-color: var(--accent) var(--bg-primary);
        }

        .form-scroll-content::-webkit-scrollbar {
          width: 8px;
          display: block;
        }

        .form-scroll-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: var(--radius-sm);
        }

        .form-scroll-content::-webkit-scrollbar-thumb {
          background-color: var(--accent);
          border-radius: 4px;
          border: 1.5px solid var(--bg-secondary);
        }

        .form-scroll-content::-webkit-scrollbar-thumb:hover {
          background-color: var(--accent-hover);
        }

        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1.5px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .step-title-row h2 {
          font-size: 1.3rem;
          color: var(--primary);
          font-family: var(--font-serif);
          font-weight: 700;
        }

        .form-nav-footer {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.75rem;
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-color);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1.35rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1.5px solid transparent;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background-color: var(--bg-secondary);
          border-color: var(--border-color);
          color: var(--text-main);
          box-shadow: var(--shadow-sm);
        }

        .btn-secondary:hover {
          background-color: var(--bg-primary);
          border-color: var(--text-muted);
        }

        .btn-primary {
          background-color: var(--primary);
          color: #ffffff;
          box-shadow: 0 4px 6px rgba(10, 37, 64, 0.1);
        }

        .btn-primary:hover {
          background-color: var(--primary-light);
          box-shadow: 0 6px 12px rgba(10, 37, 64, 0.2);
        }

        .btn-accent {
          background-color: var(--accent);
          color: var(--primary-dark);
          font-weight: 700;
          box-shadow: 0 4px 6px rgba(212, 175, 55, 0.15);
        }

        .btn-accent:hover {
          background-color: var(--accent-hover);
          box-shadow: 0 6px 12px rgba(212, 175, 55, 0.25);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .services-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: var(--bg-secondary);
        }

        .checkbox-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .checkbox-card.checked {
          border-color: var(--accent);
          background-color: rgba(212, 175, 55, 0.05);
          font-weight: 700;
        }

        .checkbox-input {
          cursor: pointer;
          accent-color: var(--accent);
          width: 17px;
          height: 17px;
        }

        .array-item-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          align-items: center;
          animation: itemRowSlide 0.25s ease-out;
        }

        @keyframes itemRowSlide {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .day-editor-card {
          border: 1.5px solid var(--border-color);
          border-left: 5px solid var(--accent);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          background-color: var(--bg-secondary);
          box-shadow: var(--shadow-sm);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .day-editor-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
          border-color: var(--accent-light);
        }

        .day-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .delete-btn {
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
        }

        .delete-btn:hover {
          color: var(--error);
          background-color: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.15);
        }

        .image-upload-group {
          margin-top: 0.5rem;
        }

        .image-upload-control {
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1.5px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.25rem;
          background-color: var(--bg-primary);
          transition: all 0.2s ease;
        }

        .image-upload-control:hover {
          border-color: var(--accent);
          background-color: rgba(212, 175, 55, 0.02);
        }

        .upload-label-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.15rem;
          background-color: var(--primary);
          color: #ffffff;
          border: 1px solid var(--primary);
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
        }

        .upload-label-btn:hover {
          background-color: var(--primary-light);
          border-color: var(--primary-light);
          transform: translateY(-1px);
        }

        .image-preview-wrapper {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.6rem;
          background-color: var(--bg-primary);
        }

        .preview-thumb {
          width: 88px;
          height: 56px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .image-info-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .btn-remove-img {
          align-self: flex-start;
          padding: 0.25rem 0.6rem;
          font-size: 0.7rem;
          color: var(--error);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.15s ease;
        }

        .btn-remove-img:hover {
          color: #ffffff;
          background-color: var(--error);
          border-color: var(--error);
        }

        @media (max-width: 768px) {
          .form-scroll-content {
            padding: 1.25rem;
          }
          .day-editor-card {
            padding: 1.25rem;
          }
          .services-checkbox-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="form-steps-indicator" ref={stepsIndicatorRef}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`step-badge ${idx === activeStep ? "active" : ""}`}
            onClick={() => setActiveStep(idx)}
          >
            <span>{idx + 1}.</span>
            <span className="step-text-desktop">{step}</span>
            <span className="step-text-mobile">
              {idx === 0 && "General"}
              {idx === 1 && "Stays"}
              {idx === 2 && "Price"}
              {idx === 3 && "Itinerary"}
              {idx === 4 && "Policies"}
            </span>
          </div>
        ))}
      </div>

      {/* Main scrolling content pane */}
      <div className="form-scroll-content">
        <div className="step-title-row">
          <h2 className="form-section-title">{steps[activeStep]}</h2>
        </div>

        {/* STEP 1: General Info */}
        {activeStep === 0 && (
          <div className="form-step-pane">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Client / Guest Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.guestName || ""}
                  onChange={(e) => handleInputChange("guestName", e.target.value)}
                  placeholder="E.g. Mahadev Tour & Travels ( Vishal )"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quotation No.</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.tourCode || ""}
                  onChange={(e) => handleInputChange("tourCode", e.target.value)}
                  placeholder="E.g. 1011"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Arrival Date (Select from Calendar)</label>
                <input
                  type="date"
                  className="form-input"
                  value={(data.arrivalDate && data.arrivalDate.includes("-")) ? data.arrivalDate : ""}
                  onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nights</label>
                <input
                  type="number"
                  className="form-input"
                  value={data.durationNights ?? 0}
                  onChange={(e) => handleInputChange("durationNights", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Days</label>
                <input
                  type="number"
                  className="form-input"
                  value={data.durationDays ?? 0}
                  onChange={(e) => handleInputChange("durationDays", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">No. of People</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.numPax || ""}
                  onChange={(e) => handleInputChange("numPax", e.target.value)}
                  placeholder="E.g. 5 Adults"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rooms Requested</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.numRooms || ""}
                  onChange={(e) => handleInputChange("numRooms", e.target.value)}
                  placeholder="E.g. 2 Rooms"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select
                  className="form-select"
                  value={data.vehicleType || "SEDAN CAB (AC CAR)"}
                  onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                >
                  <option value="SEDAN CAB (AC CAR)">SEDAN CAB (AC CAR)</option>
                  <option value="ERTIGA CAB (AC CAR)">ERTIGA CAB (AC CAR)</option>
                  <option value="SUV CAB (AC CAR)">SUV CAB (AC CAR)</option>
                  <option value="Tempo Traveller (12 Seater)">Tempo Traveller (12 Seater)</option>
                  <option value="AC Traveller (17 Seater)">AC Traveller (17 Seater)</option>
                  <option value="FLIGHT">FLIGHT</option>
                  <option value="TRAIN">TRAIN</option>
                  <option value="No Transport (Direct Check-in)">No Transport (Direct Check-in)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Basis</label>
                <select
                  className="form-select"
                  value={data.transferBasis || "PRIVATE BASIS (PVT)"}
                  onChange={(e) => {
                    onChange({
                      ...data,
                      transferBasis: e.target.value,
                      customTransferBasis: e.target.value !== "CUSTOM BASIS" ? "" : (data.customTransferBasis || ""),
                    });
                  }}
                >
                  <option value="PRIVATE BASIS (PVT)">PRIVATE BASIS (PVT)</option>
                  <option value="SHARED BASIS (SHARING)">SHARED BASIS (SHARING)</option>
                  <option value="SIC (SEAT IN COACH)">SIC (SEAT IN COACH)</option>
                  <option value="SELF DRIVE / DIRECT">SELF DRIVE / DIRECT</option>
                  <option value="TRAIN BASIS (RAIL)">TRAIN BASIS (RAIL)</option>
                  <option value="FLIGHT BASIS (AIR)">FLIGHT BASIS (AIR)</option>
                  <option value="NONE">NONE</option>
                  <option value="CUSTOM BASIS">CUSTOM BASIS (WRITE IN)</option>
                </select>
              </div>

              {data.transferBasis === "CUSTOM BASIS" && (
                <div className="form-group full-width">
                  <label className="form-label">Custom Transfer Details</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.customTransferBasis || ""}
                    onChange={(e) => handleInputChange("customTransferBasis", e.target.value)}
                    placeholder="E.g. Volvo AC Sleeper Bus, Shatabdi Express Train"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Pickup Point</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.pickupPoint || ""}
                  onChange={(e) => handleInputChange("pickupPoint", e.target.value)}
                  placeholder="E.g. Delhi Airport / Railway Station"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Drop Point</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.dropPoint || ""}
                  onChange={(e) => handleInputChange("dropPoint", e.target.value)}
                  placeholder="E.g. Delhi Airport / Railway Station"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meal Plan</label>
                <select
                  className="form-select"
                  value={data.mealPlan || "CP (Breakfast Only)"}
                  onChange={(e) => handleInputChange("mealPlan", e.target.value)}
                >
                  <option value="CP (Breakfast Only)">CP (Breakfast Only)</option>
                  <option value="MAP (Breakfast + Dinner)">MAP (Breakfast + Dinner)</option>
                  <option value="AP (Breakfast + Lunch + Dinner)">AP (Breakfast + Lunch + Dinner)</option>
                  <option value="EP (Room Only)">EP (Room Only)</option>
                  <option value="CP + MAP (Mixed Plan)">CP + MAP (Mixed Plan)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hotel Rating Category</label>
                <select
                  className="form-select"
                  value={data.hotelStar || "3 Star (Deluxe)"}
                  onChange={(e) => handleInputChange("hotelStar", e.target.value)}
                >
                  <option value="3 Star (Deluxe)">3 Star (Deluxe)</option>
                  <option value="3 Star (Premium)">3 Star (Premium)</option>
                  <option value="4 Star (Luxury)">4 Star (Luxury)</option>
                  <option value="5 Star (Super Luxury)">5 Star (Super Luxury)</option>
                  <option value="Budget / Standard">Budget / Standard</option>
                  <option value="Resort Stay">Resort Stay</option>
                  <option value="Heritage Stay">Heritage Stay</option>
                </select>
              </div>

              <div className="form-group full-width image-upload-group">
                <label className="form-label">Destination Cover Image (Optional)</label>
                {data.coverImage ? (
                  <div className="image-preview-wrapper">
                    <img src={data.coverImage} alt="Cover Preview" className="preview-thumb" />
                    <div className="image-info-text">
                      <strong>Custom cover image loaded</strong>
                      <button
                        type="button"
                        className="btn-remove-img"
                        onClick={() => handleInputChange("coverImage", "")}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-upload-control">
                    <label className="upload-label-btn">
                      <Upload size={14} />
                      Choose Image File
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const base64 = await convertToBase64(file);
                              handleInputChange("coverImage", base64);
                            } catch (err) {
                              console.error("Failed to upload cover image:", err);
                            }
                          }
                        }}
                      />
                    </label>
                    <span className="image-info-text">Select a landscape photo for the PDF cover page</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Accommodation Details */}
        {activeStep === 1 && (
          <div className="form-step-pane">
            {/* COLLAPSIBLE HOTEL DATABASE MANAGER */}
            <div className="hotel-db-manager-card" style={{ marginBottom: "2rem" }}>
              <div 
                className="hotel-db-header" 
                onClick={() => setShowDbManager(!showDbManager)}
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  cursor: "pointer", 
                  padding: "1rem", 
                  backgroundColor: "var(--bg-secondary)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: showDbManager ? "var(--radius-md) var(--radius-md) 0 0" : "var(--radius-md)",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ImageIcon size={18} style={{ color: "var(--accent)" }} />
                  <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                    Manage Hotel Database for {data.destination} ({(data.hotelLibrary || []).length})
                  </strong>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700 }}>
                  {showDbManager ? "Hide Database [-]" : "Manage Database [+]"}
                </span>
              </div>

              {showDbManager && (
                <div 
                  className="hotel-db-content" 
                  style={{ 
                    padding: "1rem", 
                    backgroundColor: "var(--bg-primary)", 
                    border: "1.5px solid var(--accent)", 
                    borderTop: "none", 
                    borderRadius: "0 0 var(--radius-md) var(--radius-md)" 
                  }}
                >
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    Add hotels here to build your database for this destination. You can easily prefill any quotation hotel stay using this database.
                  </p>

                  {(data.hotelLibrary || []).map((libHotel, libIndex) => (
                    <div 
                      key={libHotel.id || libIndex} 
                      className="day-editor-card" 
                      style={{ 
                        marginBottom: "1rem", 
                        padding: "0.85rem", 
                        border: "1px dashed var(--border-color)",
                        backgroundColor: "var(--bg-secondary)"
                      }}
                    >
                      <div className="day-editor-header" style={{ marginBottom: "0.5rem" }}>
                        <h4 style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: 700 }}>
                          Stored Hotel #{libIndex + 1}: {libHotel.hotelName}
                        </h4>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => removeHotelFromLibrary(libIndex)}
                          title="Delete from Database"
                          style={{ padding: "0.15rem 0.3rem" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Hotel Name</label>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                            value={libHotel.hotelName || ""}
                            onChange={(e) => handleLibraryHotelChange(libIndex, "hotelName", e.target.value)}
                            placeholder="E.g. Alvorada Resort (Arpora)"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Rating Category</label>
                          <select
                            className="form-select"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                            value={libHotel.hotelStar || "3 Star (Deluxe)"}
                            onChange={(e) => handleLibraryHotelChange(libIndex, "hotelStar", e.target.value)}
                          >
                            <option value="3 Star (Deluxe)">3 Star (Deluxe)</option>
                            <option value="3 Star (Premium)">3 Star (Premium)</option>
                            <option value="4 Star (Luxury)">4 Star (Luxury)</option>
                            <option value="5 Star (Super Luxury)">5 Star (Super Luxury)</option>
                            <option value="Budget / Standard">Budget / Standard</option>
                            <option value="Resort Stay">Resort Stay</option>
                            <option value="Heritage Stay">Heritage Stay</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Room Type</label>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                            value={libHotel.hotelRoomType || ""}
                            onChange={(e) => handleLibraryHotelChange(libIndex, "hotelRoomType", e.target.value)}
                            placeholder="E.g. Super Deluxe Room Pool View"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Meal Plan</label>
                          <select
                            className="form-select"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                            value={libHotel.hotelMealPlan || "Breakfast Only (CP)"}
                            onChange={(e) => handleLibraryHotelChange(libIndex, "hotelMealPlan", e.target.value)}
                          >
                            <option value="Breakfast Only (CP)">Breakfast Only (CP)</option>
                            <option value="Breakfast + Dinner (MAP)">Breakfast + Dinner (MAP)</option>
                            <option value="Breakfast + Lunch + Dinner (AP)">Breakfast + Lunch + Dinner (AP)</option>
                            <option value="Room Only (EP)">Room Only (EP)</option>
                          </select>
                        </div>

                        <div className="form-group full-width image-upload-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Hotel Image (Optional)</label>
                          {libHotel.hotelImage ? (
                            <div className="image-preview-wrapper" style={{ padding: "0.35rem" }}>
                              <img src={libHotel.hotelImage} alt="Hotel Preview" className="preview-thumb" style={{ height: "40px", width: "60px" }} />
                              <div className="image-info-text">
                                <button
                                  type="button"
                                  className="btn-remove-img"
                                  style={{ padding: "0.1rem 0.3rem", fontSize: "0.65rem" }}
                                  onClick={() => handleLibraryHotelChange(libIndex, "hotelImage", "")}
                                >
                                  Remove Image
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="image-upload-control" style={{ padding: "0.5rem" }}>
                              <label className="upload-label-btn" style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}>
                                <Upload size={12} />
                                Choose Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const base64 = await convertToBase64(file);
                                        handleLibraryHotelChange(libIndex, "hotelImage", base64);
                                      } catch (err) {
                                        console.error("Failed to upload hotel library image:", err);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={addHotelToLibrary}
                    style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.35rem", padding: "0.5rem" }}
                  >
                    <Plus size={14} /> Add Hotel to Database
                  </button>
                </div>
              )}
            </div>

            <div className="hotels-timeline-editor">
              {(data.hotels || []).map((hotel, index) => (
                <div className="day-editor-card" key={hotel.id || index} style={{ marginBottom: "1.5rem" }}>
                  <div className="day-editor-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <h3 style={{ fontSize: "1rem", margin: 0 }}>Hotel Stay #{index + 1}</h3>
                      {data.hotelLibrary && data.hotelLibrary.length > 0 && (
                        <select
                          className="form-select"
                          style={{ 
                            padding: "0.25rem 0.5rem", 
                            fontSize: "0.75rem", 
                            width: "auto", 
                            minWidth: "150px", 
                            borderColor: "var(--accent)", 
                            backgroundColor: "var(--bg-secondary)",
                            fontWeight: 600,
                            color: "var(--text-main)",
                            outline: "none"
                          }}
                          value=""
                          onChange={(e) => prefillStayFromLibrary(index, e.target.value)}
                        >
                          <option value="" disabled>⚡ Load from Hotel Library...</option>
                          {data.hotelLibrary.map((libHotel) => (
                            <option key={libHotel.id} value={libHotel.id}>
                              {libHotel.hotelName} ({libHotel.hotelStar})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {data.hotels.length > 1 && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeHotelStay(index)}
                        title="Remove Hotel Stay"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Hotel Stay Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={hotel.hotelName || ""}
                        onChange={(e) => handleHotelChange(index, "hotelName", e.target.value)}
                        placeholder="E.g. Alvorada Resort (Arpora)"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hotel Rating Category</label>
                      <select
                        className="form-select"
                        value={hotel.hotelStar || "3 Star (Deluxe)"}
                        onChange={(e) => handleHotelChange(index, "hotelStar", e.target.value)}
                      >
                        <option value="3 Star (Deluxe)">3 Star (Deluxe)</option>
                        <option value="3 Star (Premium)">3 Star (Premium)</option>
                        <option value="4 Star (Luxury)">4 Star (Luxury)</option>
                        <option value="5 Star (Super Luxury)">5 Star (Super Luxury)</option>
                        <option value="Budget / Standard">Budget / Standard</option>
                        <option value="Resort Stay">Resort Stay</option>
                        <option value="Heritage Stay">Heritage Stay</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Room Configuration / Type</label>
                      <input
                        type="text"
                        className="form-input"
                        value={hotel.hotelRoomType || ""}
                        onChange={(e) => handleHotelChange(index, "hotelRoomType", e.target.value)}
                        placeholder="E.g. Super Deluxe Room Pool View"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Hotel Meal Plan</label>
                      <select
                        className="form-select"
                        value={hotel.hotelMealPlan || "Breakfast Only (CP)"}
                        onChange={(e) => handleHotelChange(index, "hotelMealPlan", e.target.value)}
                      >
                        <option value="Breakfast Only (CP)">Breakfast Only (CP)</option>
                        <option value="Breakfast + Dinner (MAP)">Breakfast + Dinner (MAP)</option>
                        <option value="Breakfast + Lunch + Dinner (AP)">Breakfast + Lunch + Dinner (AP)</option>
                        <option value="Room Only (EP)">Room Only (EP)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Check-in Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={hotel.hotelCheckIn || ""}
                        onChange={(e) => handleHotelChange(index, "hotelCheckIn", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Check-out Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={hotel.hotelCheckOut || ""}
                        onChange={(e) => handleHotelChange(index, "hotelCheckOut", e.target.value)}
                      />
                    </div>

                    <div className="form-group full-width image-upload-group">
                      <label className="form-label">Hotel Stay Image (Optional)</label>
                      {hotel.hotelImage ? (
                        <div className="image-preview-wrapper">
                          <img src={hotel.hotelImage} alt="Hotel Preview" className="preview-thumb" />
                          <div className="image-info-text">
                            <strong>Custom hotel image loaded</strong>
                            <button
                              type="button"
                              className="btn-remove-img"
                              onClick={() => handleHotelChange(index, "hotelImage", "")}
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="image-upload-control">
                          <label className="upload-label-btn">
                            <Upload size={14} />
                            Choose Image File
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const base64 = await convertToBase64(file);
                                    handleHotelChange(index, "hotelImage", base64);
                                  } catch (err) {
                                    console.error(`Failed to upload hotel image:`, err);
                                  }
                                }
                              }}
                            />
                          </label>
                          <span className="image-info-text">Select a hotel preview photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={addHotelStay}
                style={{ width: "100%", marginTop: "1rem" }}
              >
                <Plus size={16} /> Add Hotel Stay
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Checklist */}
        {activeStep === 2 && (
          <div className="form-step-pane">
            <div className="services-section-title">Included Services Status</div>
            <div className="services-checkbox-grid">
              {Object.keys(data.services || {}).map((key) => {
                const serviceKey = key as keyof ServiceStatus;
                const isChecked = data.services?.[serviceKey] ?? false;
                return (
                  <div
                    key={key}
                    className={`checkbox-card ${isChecked ? "checked" : ""}`}
                    onClick={() => handleServiceChange(serviceKey, !isChecked)}
                  >
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={isChecked}
                      onChange={() => {}} // Handled by div click
                    />
                    <span className="form-label" style={{ margin: 0, cursor: "pointer" }}>
                      {key.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>            {/* Passenger Count Indicator */}
            <div style={{ backgroundColor: "var(--primary-light)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "1.5rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="form-label" style={{ margin: 0, fontWeight: "bold" }}>Active Passenger Count (Pax):</span>
              <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: "1rem" }}>{getPaxCount()} {getPaxCount() === 1 ? "Person" : "People"}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Row 1: Base Package Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-secondary)" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: "bold" }}>Base Land Package (Per Person - Rs.)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.pricePerPerson || ""}
                    onChange={(e) => handlePriceChange("pricePerPerson", e.target.value)}
                    placeholder="E.g. 12500"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: "bold" }}>Base Land Package (Total - Rs.)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.totalPrice || ""}
                    onChange={(e) => handlePriceChange("totalPrice", e.target.value)}
                    placeholder="E.g. 50000"
                  />
                </div>
              </div>

              {/* Row 2: Train Price (Optional) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-secondary)" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Train Ticket Price (Per Person - Rs. - Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.trainPricePerPerson || ""}
                    onChange={(e) => handlePriceChange("trainPricePerPerson", e.target.value)}
                    placeholder="E.g. 1800"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Train Ticket Price (Total - Rs.)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.trainPriceTotal || ""}
                    onChange={(e) => handlePriceChange("trainPriceTotal", e.target.value)}
                    placeholder="E.g. 7200"
                  />
                </div>
              </div>

              {/* Row 3: Flight Price (Optional) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-secondary)" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Flight Ticket Price (Per Person - Rs. - Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.flightPricePerPerson || ""}
                    onChange={(e) => handlePriceChange("flightPricePerPerson", e.target.value)}
                    placeholder="E.g. 5400"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Flight Ticket Price (Total - Rs.)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={data.flightPriceTotal || ""}
                    onChange={(e) => handlePriceChange("flightPriceTotal", e.target.value)}
                    placeholder="E.g. 21600"
                  />
                </div>
              </div>

              {/* Calculated Overall Price & Payments */}
              <div style={{ padding: "1rem", border: "2px solid var(--accent)", borderRadius: "var(--radius-md)", backgroundColor: "#faf6eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px dashed var(--accent)" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--primary)" }}>CALCULATED OVERALL TOTAL:</span>
                  <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--primary)" }}>
                    Rs. {(
                      (parseFloat(data.totalPrice || "0") || 0) +
                      (parseFloat(data.trainPriceTotal || "0") || 0) +
                      (parseFloat(data.flightPriceTotal || "0") || 0)
                    ).toLocaleString("en-IN")}/-
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <span>Overall Per Person:</span>
                  <span style={{ fontWeight: "bold", color: "var(--primary)" }}>
                    Rs. {(
                      (parseFloat(data.pricePerPerson || "0") || 0) +
                      (parseFloat(data.trainPricePerPerson || "0") || 0) +
                      (parseFloat(data.flightPricePerPerson || "0") || 0)
                    ).toLocaleString("en-IN")}/-
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: "bold" }}>Advance Payment Received (Rs.)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.advancePrice || ""}
                      onChange={(e) => handleInputChange("advancePrice", e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="E.g. 15000"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0, display: "flex", alignItems: "center", height: "100%", paddingTop: "1.4rem" }}>
                    <label className="checkbox-card" style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.6rem 1rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", margin: 0, backgroundColor: "#ffffff" }}>
                      <input
                        type="checkbox"
                        checked={data.gstExtra || false}
                        onChange={(e) => handleInputChange("gstExtra", e.target.checked)}
                        style={{ margin: 0, width: "auto", height: "auto" }}
                      />
                      <span className="form-label" style={{ margin: 0, fontSize: "0.82rem", cursor: "pointer" }}>5% GST Extra Applicable</span>
                    </label>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", padding: "0.6rem 0.85rem", backgroundColor: "var(--bg-secondary)", borderRadius: "6px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="form-label" style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0, fontWeight: "bold" }}>
                    Calculated Balance Payment Due (Rs.):
                  </span>
                  <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--error)" }}>
                    Rs. {(() => {
                      const totalBase = parseFloat(data.totalPrice || "0") || 0;
                      const totalTrain = parseFloat(data.trainPriceTotal || "0") || 0;
                      const totalFlight = parseFloat(data.flightPriceTotal || "0") || 0;
                      const overall = totalBase + totalTrain + totalFlight;
                      const advance = parseFloat(data.advancePrice || "0") || 0;
                      return (overall - advance).toLocaleString("en-IN");
                    })()}/-
                    {data.gstExtra && <span style={{ fontSize: "0.75rem" }}> + 5% GST Extra</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Itinerary details */}
        {activeStep === 3 && (
          <div className="form-step-pane">
            <div className="itinerary-timeline-editor">
              {(data.itinerary || []).map((dayItem, index) => (
                <div className="day-editor-card" key={index}>
                  <div className="day-editor-header">
                    <h3 style={{ fontSize: "1rem" }}>Day {dayItem.day}</h3>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => removeItineraryDay(index)}
                      title="Remove Day"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Day Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={dayItem.title || ""}
                        onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                        placeholder="E.g. Pickup and Hotel Check-in"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Stay Point</label>
                      <input
                        type="text"
                        className="form-input"
                        value={dayItem.stay || ""}
                        onChange={(e) => handleItineraryChange(index, "stay", e.target.value)}
                        placeholder="E.g. Classikfort Inn / Arbour"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Meal Plan</label>
                      <input
                        type="text"
                        className="form-input"
                        value={dayItem.mealPlan || ""}
                        onChange={(e) => handleItineraryChange(index, "mealPlan", e.target.value)}
                        placeholder="E.g. MAP / CP"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Transfer Basis for this Day</label>
                      <select
                        className="form-select"
                        value={dayItem.transferBasis || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = (data.itinerary || []).map((item, idx) => {
                            if (idx === index) {
                              return {
                                ...item,
                                transferBasis: val,
                                customTransferBasis: val !== "CUSTOM BASIS" ? "" : (item.customTransferBasis || ""),
                              };
                            }
                            return item;
                          });
                          onChange({
                            ...data,
                            itinerary: updated,
                          });
                        }}
                      >
                        <option value="">Inherit default ({data.transferBasis || "PRIVATE BASIS (PVT)"})</option>
                        <option value="PRIVATE BASIS (PVT)">PRIVATE BASIS (PVT)</option>
                        <option value="SHARED BASIS (SHARING)">SHARED BASIS (SHARING)</option>
                        <option value="SIC (SEAT IN COACH)">SIC (SEAT IN COACH)</option>
                        <option value="SELF DRIVE / DIRECT">SELF DRIVE / DIRECT</option>
                        <option value="TRAIN BASIS (RAIL)">TRAIN BASIS (RAIL)</option>
                        <option value="FLIGHT BASIS (AIR)">FLIGHT BASIS (AIR)</option>
                        <option value="NONE">NONE</option>
                        <option value="CUSTOM BASIS">CUSTOM BASIS (WRITE IN)</option>
                      </select>
                    </div>

                    {dayItem.transferBasis === "CUSTOM BASIS" && (
                      <div className="form-group full-width">
                        <label className="form-label">Custom Transfer Details for this Day</label>
                        <input
                          type="text"
                          className="form-input"
                          value={dayItem.customTransferBasis || ""}
                          onChange={(e) => handleItineraryChange(index, "customTransferBasis", e.target.value)}
                          placeholder="E.g. Volvo AC Sleeper Bus, Shatabdi Express Train"
                        />
                      </div>
                    )}

                    <div className="form-group full-width">
                      <label className="form-label">Day Itinerary Description</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        value={dayItem.description || ""}
                        onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                        placeholder="Describe the day's events, visits, transfers..."
                      />
                    </div>

                    <div className="form-group full-width image-upload-group">
                      <label className="form-label">Day Itinerary Image (Optional)</label>
                      {dayItem.image ? (
                        <div className="image-preview-wrapper">
                          <img src={dayItem.image} alt={`Day ${dayItem.day} Preview`} className="preview-thumb" />
                          <div className="image-info-text">
                            <strong>Custom Day {dayItem.day} image loaded</strong>
                            <button
                              type="button"
                              className="btn-remove-img"
                              onClick={() => handleItineraryChange(index, "image", "")}
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="image-upload-control">
                          <label className="upload-label-btn">
                            <Upload size={14} />
                            Choose Image File
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const base64 = await convertToBase64(file);
                                    handleItineraryChange(index, "image", base64);
                                  } catch (err) {
                                    console.error(`Failed to upload Day ${dayItem.day} image:`, err);
                                  }
                                }
                              }}
                            />
                          </label>
                          <span className="image-info-text">Select a sightseeing/transfer photo for this day</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={addItineraryDay}
                style={{ width: "100%" }}
              >
                <Plus size={16} /> Add Day to Itinerary
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Inclusions & Exclusions */}
        {activeStep === 4 && (
          <div className="form-step-pane">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--success)" }}>Inclusions</h3>
            {(data.inclusions || []).map((inc, index) => (
              <div className="array-item-row" key={index}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  value={inc || ""}
                  onChange={(e) => handleArrayChange("inclusions", index, e.target.value)}
                  placeholder="E.g. 3 Nights Stay in AC Deluxe Room"
                />
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeArrayItem("inclusions", index)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => addArrayItem("inclusions")}
              style={{ marginBottom: "2rem" }}
            >
              <Plus size={14} /> Add Inclusion Item
            </button>

            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--error)" }}>Exclusions</h3>
            {(data.exclusions || []).map((exc, index) => (
              <div className="array-item-row" key={index}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  value={exc || ""}
                  onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                  placeholder="E.g. Flight / Train Tickets"
                />
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeArrayItem("exclusions", index)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => addArrayItem("exclusions")}
            >
              <Plus size={14} /> Add Exclusion Item
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="form-nav-footer">
        <div>
          {activeStep > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveStep(activeStep - 1)}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActiveStep(activeStep + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-accent"
              onClick={onDownload}
              disabled={isGenerating}
            >
              <Download size={16} />
              {isGenerating ? "Generating..." : "Download PDF Quotation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
