import React from "react";
import { Plus, Trash2, ChevronRight, ChevronLeft, Download } from "lucide-react";

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
  numPax: string; // Used for "No. of People"
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

interface PackageFormProps {
  data: PDFData;
  onChange: (newData: PDFData) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export const PackageForm: React.FC<PackageFormProps> = ({
  data,
  onChange,
  activeStep,
  setActiveStep,
  onDownload,
  isGenerating,
}) => {
  const handleInputChange = (
    field: keyof PDFData,
    value: string | number | boolean
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
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

  // Auto calculate total cost if price per adult and number of adults is updated
  React.useEffect(() => {
    const adults = parseInt(data.numPax || "0") || 0;
    const rate = parseFloat(data.pricePerPerson || "0") || 0;
    if (adults > 0 && rate > 0) {
      const calculatedTotal = (adults * rate).toFixed(0);
      if (data.totalPrice !== calculatedTotal) {
        onChange({
          ...data,
          totalPrice: calculatedTotal,
        });
      }
    }
  }, [data.numPax, data.pricePerPerson]);

  const steps = [
    "General Details",
    "Accommodation Info",
    "Pricing & Services Include",
    "Day-by-Day Itinerary",
    "Terms & Policies",
  ];

  return (
    <div className="form-panel-wrapper">
      <style jsx>{`
        .form-panel-wrapper {
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .form-steps-indicator {
          display: flex;
          padding: 1.25rem;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          gap: 0.5rem;
        }

        .step-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .step-badge.active {
          background-color: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }

        .form-scroll-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }

        .step-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .form-nav-footer {
          display: flex;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-color);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: var(--transition-fast);
          border: 1px solid transparent;
        }

        .btn-secondary {
          background-color: var(--bg-secondary);
          border-color: var(--border-color);
          color: var(--text-main);
        }

        .btn-secondary:hover {
          background-color: var(--bg-primary);
          border-color: var(--text-muted);
        }

        .btn-primary {
          background-color: var(--primary);
          color: #ffffff;
        }

        .btn-primary:hover {
          background-color: var(--primary-light);
        }

        .btn-accent {
          background-color: var(--accent);
          color: var(--bg-dark);
        }

        .btn-accent:hover {
          background-color: var(--accent-hover);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .services-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .checkbox-card.checked {
          border-color: var(--accent);
          background-color: rgba(212, 175, 55, 0.05);
        }

        .checkbox-input {
          cursor: pointer;
          accent-color: var(--accent);
          width: 16px;
          height: 16px;
        }

        .array-item-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          align-items: center;
        }

        .day-editor-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          background-color: var(--bg-primary);
        }

        .day-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .delete-btn {
          color: var(--error);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: var(--transition-fast);
        }

        .delete-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>

      {/* Steps indicator */}
      <div className="form-steps-indicator">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`step-badge ${idx === activeStep ? "active" : ""}`}
            onClick={() => setActiveStep(idx)}
          >
            <span>{idx + 1}.</span>
            <span>{step}</span>
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
              <div className="form-group full-width">
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
                  value={data.vehicleType || "AC Sedan (Ertiga / SUV)"}
                  onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                >
                  <option value="AC Sedan (Ertiga / SUV)">AC Sedan (Ertiga / SUV)</option>
                  <option value="AC Sedan (Private Car)">AC Sedan (Private Car)</option>
                  <option value="SUV (Innova / Ertiga)">SUV (Innova / Ertiga)</option>
                  <option value="SUV (Innova Crysta)">SUV (Innova Crysta)</option>
                  <option value="Tempo Traveller (12 Seater)">Tempo Traveller (12 Seater)</option>
                  <option value="AC Traveller (17 Seater)">AC Traveller (17 Seater)</option>
                  <option value="AC Hatchback (WagonR/Similar)">AC Hatchback (WagonR/Similar)</option>
                  <option value="No Transport (Direct Check-in)">No Transport (Direct Check-in)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pick & Drop Point</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.pickDrop || ""}
                  onChange={(e) => handleInputChange("pickDrop", e.target.value)}
                  placeholder="E.g. Thivim / Madgaon Station"
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
            </div>
          </div>
        )}

        {/* STEP 2: Accommodation Details */}
        {activeStep === 1 && (
          <div className="form-step-pane">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Hotel Stay Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.hotelName || ""}
                  onChange={(e) => handleInputChange("hotelName", e.target.value)}
                  placeholder="E.g. Alvorada Resort (Arpora)"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Room Configuration / Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.hotelRoomType || ""}
                  onChange={(e) => handleInputChange("hotelRoomType", e.target.value)}
                  placeholder="E.g. Super Deluxe Room Pool View"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hotel Meal Plan</label>
                <select
                  className="form-select"
                  value={data.hotelMealPlan || "Breakfast Only (CP)"}
                  onChange={(e) => handleInputChange("hotelMealPlan", e.target.value)}
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
                  value={data.hotelCheckIn || ""}
                  onChange={(e) => handleInputChange("hotelCheckIn", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check-out Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={data.hotelCheckOut || ""}
                  onChange={(e) => handleInputChange("hotelCheckOut", e.target.value)}
                />
              </div>
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
            </div>

            <div className="form-grid" style={{ marginTop: "2rem" }}>
              <div className="form-group">
                <label className="form-label">Price Per Person (Rs.)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.pricePerPerson || ""}
                  onChange={(e) => handleInputChange("pricePerPerson", e.target.value)}
                  placeholder="E.g. 6860"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Package Price (Rs.)</label>
                <input
                  type="text"
                  className="form-input"
                  value={data.totalPrice || ""}
                  onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                  placeholder="E.g. 34300"
                />
              </div>

              <div className="form-group full-width" style={{ flexDirection: "row", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="gstExtra"
                  className="checkbox-input"
                  checked={data.gstExtra || false}
                  onChange={(e) => handleInputChange("gstExtra", e.target.checked)}
                />
                <label htmlFor="gstExtra" className="form-label" style={{ margin: 0, cursor: "pointer", paddingLeft: "0.5rem" }}>
                  Add "+ 5% GST EXTRA WILL BE CHARGED" to PDF
                </label>
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
                      <label className="form-label">Day Itinerary Description</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        value={dayItem.description || ""}
                        onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                        placeholder="Describe the day's events, visits, transfers..."
                      />
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
