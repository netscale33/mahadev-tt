"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PackageForm, PDFData, HotelItem } from "./PackageForm";
import { PDFPreview } from "./PDFPreview";
import { Download, Edit3, Eye, Menu, Plus, Trash2, X, Smartphone } from "lucide-react";
import { loadDestinations, saveDestinations, saveTrackingHistory, loadTrackingHistory } from "./db";
import { getPrepopulatedHotels } from "./hotelLookup";

// Default Goa data pre-populated from the user's Goa PDF
const defaultGoaData: PDFData = {
  guestName: "Name of Client",
  destination: "Goa",
  arrivalDate: "2026-08-09", // Standard date format for HTML5 calendar
  durationNights: 3,
  durationDays: 4,
  numPax: "5 Adults",
  numRooms: "2 Rooms",
  vehicleType: "SEDAN CAB (AC CAR)",
  transferBasis: "PRIVATE BASIS (PVT)",
  customTransferBasis: "",
  pickupPoint: "Thivim Railway Station",
  dropPoint: "Madgaon Station",
  mealPlan: "CP (Breakfast Only)",
  hotelStar: "3 Star (Deluxe)",
  services: {
    flights: false,
    train: false,
    hotels: true,
    tours: true,
    transport: true,
    cruise: true,
    addons: false,
  },
  hotels: [
    {
      id: "hotel-default",
      hotelName: "Alvorada Resort (Arpora)",
      hotelStar: "3 Star (Deluxe)",
      hotelRoomType: "Super Deluxe Room Pool View",
      hotelMealPlan: "Breakfast Only (CP)",
      hotelCheckIn: "2026-08-09T14:00",
      hotelCheckOut: "2026-08-12T12:00",
      hotelImage: "",
    }
  ],
  hotelLibrary: [
    {
      id: "hotel-default",
      hotelName: "Alvorada Resort (Arpora)",
      hotelStar: "3 Star (Deluxe)",
      hotelRoomType: "Super Deluxe Room Pool View",
      hotelMealPlan: "Breakfast Only (CP)",
      hotelCheckIn: "2026-08-09T14:00",
      hotelCheckOut: "2026-08-12T12:00",
      hotelImage: "",
    }
  ],
  pricePerPerson: "",
  totalPrice: "34300",
  advancePrice: "0",
  gstExtra: false,
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
  version: 1,
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

const PRELOADED_DESTINATIONS = [
  "Nainital",
  "Srinagar",
  "Gulmarg",
  "Pahalgam",
  "Sonamarg",
  "Ladakh",
  "Jaisalmer",
  "Haridwar",
  "Nepal",
  "Kerala"
];

const generateDefaultDestination = (name: string, id: string): PDFData => {
  const dest: PDFData = JSON.parse(JSON.stringify(defaultGoaData));
  dest.id = id;
  if (typeof window !== "undefined") {
    let tcCounter = parseInt(localStorage.getItem("mahadev_tour_code_counter") || "1");
    if (isNaN(tcCounter) || tcCounter <= 0) tcCounter = 1;
    dest.tourCode = tcCounter.toString().padStart(7, "0");
    localStorage.setItem("mahadev_tour_code_counter", (tcCounter + 1).toString());

    let qnCounter = parseInt(localStorage.getItem("mahadev_quotation_no_counter") || "1011");
    if (isNaN(qnCounter) || qnCounter < 1011) qnCounter = 1011;
    dest.quotationNo = qnCounter.toString();
    localStorage.setItem("mahadev_quotation_no_counter", (qnCounter + 1).toString());
  }
  dest.destination = name;
  dest.guestName = "Name of Client";
  dest.arrivalDate = new Date().toISOString().split('T')[0];
  dest.pickupPoint = "";
  dest.dropPoint = "";
  delete dest.pickDrop;
  dest.vehicleType = "SEDAN CAB (AC CAR)";
  dest.transferBasis = "PRIVATE BASIS (PVT)";
  dest.customTransferBasis = "";
  dest.advancePrice = "0";
  dest.coverImage = "";
  
  const prefilled = getPrepopulatedHotels(name);
  if (prefilled && prefilled.length > 0) {
    dest.hotelLibrary = prefilled;
    const firstLib = prefilled[0];
    dest.hotels = [
      {
        id: `hotel-${Date.now()}-${Math.random()}`,
        hotelName: firstLib.hotelName,
        hotelStar: firstLib.hotelStar,
        hotelRoomType: firstLib.hotelRoomType,
        hotelMealPlan: firstLib.hotelMealPlan,
        hotelCheckIn: `${dest.arrivalDate}T14:00`,
        hotelCheckOut: `${calculateCheckOutDate(dest.arrivalDate, 3)}T12:00`,
        hotelImage: firstLib.hotelImage,
      }
    ];
    dest.itinerary = [
      {
        day: 1,
        title: "Arrival & Transfer to Hotel",
        stay: firstLib.hotelName,
        mealPlan: "No Meals (EP)",
        description: `Arrive at ${name}. Our driver will pick you up and transfer you to the hotel/resort. Enjoy the rest of the day at leisure.`,
        image: "",
      }
    ];
  } else {
    const defaultHotel = {
      id: `hotel-${Date.now()}`,
      hotelName: "Standard Deluxe Stay",
      hotelStar: "3 Star (Deluxe)",
      hotelRoomType: "Standard Room",
      hotelMealPlan: "Breakfast Only (CP)",
      hotelCheckIn: `${dest.arrivalDate}T14:00`,
      hotelCheckOut: `${calculateCheckOutDate(dest.arrivalDate, 3)}T12:00`,
      hotelImage: "",
    };
    dest.hotels = [defaultHotel];
    dest.hotelLibrary = [{ ...defaultHotel, id: `lib-hotel-${Date.now()}` }];
    dest.itinerary = [
      {
        day: 1,
        title: "Arrival & Transfer to Hotel",
        stay: "Standard Deluxe Stay",
        mealPlan: "No Meals (EP)",
        description: `Arrive at ${name}. Our driver will pick you up and transfer you to the hotel/resort. Enjoy the rest of the day at leisure.`,
        image: "",
      }
    ];
  }
  // Customize inclusions for this specific destination
  dest.inclusions = [
    `3 Nights accommodation in selected hotel (${name})`,
    "Daily buffet breakfast at hotel (CP plan)",
    "Private pickup from airport or railway station",
    "Private drop to airport or railway station",
    `Local sightseeing at ${name} in private AC vehicle`,
    "All taxes, tolls, parking, driver batta, and fuel charges included",
  ];
  return dest;
};

export default function TravelPortal() {
  const [destinations, setDestinations] = useState<PDFData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [workspaceTab, setWorkspaceTab] = useState<"quotation" | "voucher">("quotation");
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [sidebarTab, setSidebarTab] = useState<"templates" | "tracking">("templates");
  const [activeMode, setActiveMode] = useState<"template" | "tracked">("template");
  const [activeTrackedIndex, setActiveTrackedIndex] = useState<number>(0);
  const [formStep, setFormStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfLibrary, setPdfLibrary] = useState<any>(null);

  // PWA Install state
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissedIOSBanner, setDismissedIOSBanner] = useState(false);

  // Sidebar and Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDestName, setNewDestName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameIndex, setRenameIndex] = useState(-1);
  const [renameName, setRenameName] = useState("");

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");

  // Drag resizer width state (percentage, starts at 65% for form, 35% for preview)
  const [leftWidth, setLeftWidth] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load @react-pdf/renderer and local data dynamically on client-side
  useEffect(() => {
    setIsMounted(true);
    
    // Load destinations from IndexedDB (with localStorage fallback)
    async function initData() {
      try {
        const saved = await loadDestinations();
        if (saved && saved.length > 0) {
          const migrated = saved.map((dest: any) => {
            if (!dest.tourCode) {
              let tcCounter = parseInt(localStorage.getItem("mahadev_tour_code_counter") || "1");
              if (isNaN(tcCounter) || tcCounter <= 0) tcCounter = 1;
              dest.tourCode = tcCounter.toString().padStart(7, "0");
              localStorage.setItem("mahadev_tour_code_counter", (tcCounter + 1).toString());
            }
            if (!dest.quotationNo) {
              let qnCounter = parseInt(localStorage.getItem("mahadev_quotation_no_counter") || "1011");
              if (isNaN(qnCounter) || qnCounter < 1011) qnCounter = 1011;
              dest.quotationNo = qnCounter.toString();
              localStorage.setItem("mahadev_quotation_no_counter", (qnCounter + 1).toString());
            }
            if (dest.version === undefined) {
              dest.version = 1;
            }
            const prefilled = getPrepopulatedHotels(dest.destination);
            if (!dest.hotelLibrary || dest.hotelLibrary.length <= 1) {
              if (prefilled && prefilled.length > 0) {
                dest.hotelLibrary = prefilled;
              } else {
                dest.hotelLibrary = (dest.hotels || []).map((h: any) => ({
                  ...h,
                  id: `lib-${h.id || Date.now()}-${Math.random()}`
                }));
              }
            } else if (dest.destination.toLowerCase().includes("goa") && dest.hotelLibrary.length <= 2) {
              if (prefilled && prefilled.length > 0) {
                dest.hotelLibrary = prefilled;
              }
            }
            if (!dest.pickupPoint || !dest.dropPoint) {
              const str = dest.pickDrop || "";
              if (str.includes(" / ")) {
                const parts = str.split(" / ");
                dest.pickupPoint = parts[0]?.trim() || "";
                dest.dropPoint = parts[1]?.trim() || "";
              } else if (str.includes("/")) {
                const parts = str.split("/");
                dest.pickupPoint = parts[0]?.trim() || "";
                dest.dropPoint = parts[1]?.trim() || "";
              } else {
                dest.pickupPoint = str;
                dest.dropPoint = str;
              }
            }
            if (!dest.transferBasis) {
              dest.transferBasis = "PRIVATE BASIS (PVT)";
            }
            if (dest.customTransferBasis === undefined) {
              dest.customTransferBasis = "";
            }
            if (dest.advancePrice === undefined) {
              dest.advancePrice = "0";
            }
            if (dest.services) {
              if (dest.services.train === undefined) {
                dest.services.train = false;
              }
            }
            // Pre-populate terms & policies if missing or empty
            if (!dest.inclusions || dest.inclusions.length === 0) {
              dest.inclusions = [
                `3 Nights accommodation in selected hotel (${dest.destination})`,
                "Daily buffet breakfast at hotel (CP plan)",
                "Private pickup from airport or railway station",
                "Private drop to airport or railway station",
                `Local sightseeing at ${dest.destination} in private AC vehicle`,
                "All taxes, tolls, parking, driver batta, and fuel charges included",
              ];
            }
            if (!dest.exclusions || dest.exclusions.length === 0) {
              dest.exclusions = [...defaultGoaData.exclusions];
            }
            if (!dest.paymentPolicies || dest.paymentPolicies.length === 0) {
              dest.paymentPolicies = [...defaultGoaData.paymentPolicies];
            }
            if (!dest.cancellationPolicies || dest.cancellationPolicies.length === 0) {
              dest.cancellationPolicies = [...defaultGoaData.cancellationPolicies];
            }
            if (!dest.bookingTerms || dest.bookingTerms.length === 0) {
              dest.bookingTerms = [...defaultGoaData.bookingTerms];
            }
            return dest;
          });

          // Merge missing preloaded destinations into list
          const existingNames = migrated.map((d: any) => d.destination.toLowerCase());
          const newItems: PDFData[] = [];
          PRELOADED_DESTINATIONS.forEach((name) => {
            if (!existingNames.some((en: string) => en.includes(name.toLowerCase()) || name.toLowerCase().includes(en))) {
              newItems.push(generateDefaultDestination(name, `preloaded-${name.toLowerCase()}-${Date.now()}-${Math.random()}`));
            }
          });
          const merged = [...migrated, ...newItems];
          setDestinations(merged);
          await saveDestinations(merged);
        } else {
          // Check for legacy localStorage data
          const legacySaved = localStorage.getItem("mahadev_destinations_v1");
          if (legacySaved) {
            const parsed = JSON.parse(legacySaved);
            const migrated = parsed.map((dest: any) => {
              if (!dest.hotels) {
                dest.hotels = [
                  {
                    id: `hotel-${Date.now()}-${Math.random()}`,
                    hotelName: dest.hotelName || "Alvorada Resort (Arpora)",
                    hotelStar: dest.hotelStar || "3 Star (Deluxe)",
                    hotelRoomType: dest.hotelRoomType || "Super Deluxe Room Pool View",
                    hotelMealPlan: dest.hotelMealPlan || "Breakfast Only (CP)",
                    hotelCheckIn: dest.hotelCheckIn || "2026-08-09T14:00",
                    hotelCheckOut: dest.hotelCheckOut || "2026-08-12T12:00",
                    hotelImage: dest.hotelImage || "",
                  }
                ];
                delete dest.hotelName;
                delete dest.hotelStar;
                delete dest.hotelRoomType;
                delete dest.hotelMealPlan;
                delete dest.hotelCheckIn;
                delete dest.hotelCheckOut;
                delete dest.hotelImage;
              }
              const prefilled = getPrepopulatedHotels(dest.destination);
              if (!dest.hotelLibrary || dest.hotelLibrary.length <= 1) {
                if (prefilled && prefilled.length > 0) {
                  dest.hotelLibrary = prefilled;
                } else {
                  dest.hotelLibrary = dest.hotels.map((h: any) => ({
                    ...h,
                    id: `lib-${h.id || Date.now()}-${Math.random()}`
                  }));
                }
              } else if (dest.destination.toLowerCase().includes("goa") && dest.hotelLibrary.length <= 2) {
                if (prefilled && prefilled.length > 0) {
                  dest.hotelLibrary = prefilled;
                }
              }
              if (!dest.pickupPoint || !dest.dropPoint) {
                const str = dest.pickDrop || "";
                if (str.includes(" / ")) {
                  const parts = str.split(" / ");
                  dest.pickupPoint = parts[0]?.trim() || "";
                  dest.dropPoint = parts[1]?.trim() || "";
                } else if (str.includes("/")) {
                  const parts = str.split("/");
                  dest.pickupPoint = parts[0]?.trim() || "";
                  dest.dropPoint = parts[1]?.trim() || "";
                } else {
                  dest.pickupPoint = str;
                  dest.dropPoint = str;
                }
              }
              if (!dest.transferBasis) {
                dest.transferBasis = "PRIVATE BASIS (PVT)";
              }
              if (dest.customTransferBasis === undefined) {
                dest.customTransferBasis = "";
              }
              if (dest.advancePrice === undefined) {
                dest.advancePrice = "0";
              }
              if (dest.services) {
                if (dest.services.train === undefined) {
                  dest.services.train = false;
                }
              }
              // Pre-populate terms & policies if missing or empty
              if (!dest.inclusions || dest.inclusions.length === 0) {
                dest.inclusions = [
                  `3 Nights accommodation in selected hotel (${dest.destination})`,
                  "Daily buffet breakfast at hotel (CP plan)",
                  "Private pickup from airport or railway station",
                  "Private drop to airport or railway station",
                  `Local sightseeing at ${dest.destination} in private AC vehicle`,
                  "All taxes, tolls, parking, driver batta, and fuel charges included",
                ];
              }
              if (!dest.exclusions || dest.exclusions.length === 0) {
                dest.exclusions = [...defaultGoaData.exclusions];
              }
              if (!dest.paymentPolicies || dest.paymentPolicies.length === 0) {
                dest.paymentPolicies = [...defaultGoaData.paymentPolicies];
              }
              if (!dest.cancellationPolicies || dest.cancellationPolicies.length === 0) {
                dest.cancellationPolicies = [...defaultGoaData.cancellationPolicies];
              }
              if (!dest.bookingTerms || dest.bookingTerms.length === 0) {
                dest.bookingTerms = [...defaultGoaData.bookingTerms];
              }
              return dest;
            });

            // Merge missing preloaded destinations into legacy list
            const existingNames = migrated.map((d: any) => d.destination.toLowerCase());
            const newItems: PDFData[] = [];
            PRELOADED_DESTINATIONS.forEach((name) => {
              if (!existingNames.some((en: string) => en.includes(name.toLowerCase()) || name.toLowerCase().includes(en))) {
                newItems.push(generateDefaultDestination(name, `preloaded-${name.toLowerCase()}-${Date.now()}-${Math.random()}`));
              }
            });
            const merged = [...migrated, ...newItems];
            setDestinations(merged);
            await saveDestinations(merged);
            localStorage.removeItem("mahadev_destinations_v1"); // Cleanup legacy
          } else {
            const defaultList = [
              { ...defaultGoaData, id: "goa-default", isDefault: true },
              ...PRELOADED_DESTINATIONS.map((name, i) => 
                generateDefaultDestination(name, `preloaded-${name.toLowerCase()}-${Date.now()}-${i}`)
              )
            ];
            setDestinations(defaultList);
            await saveDestinations(defaultList);
          }
        }
        
        // Load tracking history
        const history = await loadTrackingHistory();
        if (history && history.length > 0) {
          setTrackingHistory(history);
        }
      } catch (e) {
        console.error("Failed to initialize destinations from storage:", e);
        const defaultList = [
          { ...defaultGoaData, id: "goa-default", isDefault: true },
          ...PRELOADED_DESTINATIONS.map((name, i) => 
            generateDefaultDestination(name, `preloaded-${name.toLowerCase()}-${Date.now()}-${i}`)
          )
        ];
        setDestinations(defaultList);
        await saveDestinations(defaultList);
      }
    }
    initData();

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      }).catch((err) => console.error("SW registration failed:", err));
    }

    // PWA install prompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Detect iOS and standalone mode
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !((window as any).MSStream)
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    import("@react-pdf/renderer").then((mod) => {
      setPdfLibrary(mod);
    });

    // Check screen size for responsive layout
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const formData = activeMode === "template"
    ? (destinations[activeIndex] || defaultGoaData)
    : (trackingHistory[activeTrackedIndex]?.data || defaultGoaData);

  const handleAddDestination = () => {
    if (!newDestName.trim()) return;
    const newDest: PDFData = JSON.parse(JSON.stringify(defaultGoaData));
    newDest.id = `dest-${Date.now()}`;
    if (typeof window !== "undefined") {
      let tcCounter = parseInt(localStorage.getItem("mahadev_tour_code_counter") || "1");
      if (isNaN(tcCounter) || tcCounter <= 0) tcCounter = 1;
      newDest.tourCode = tcCounter.toString().padStart(7, "0");
      localStorage.setItem("mahadev_tour_code_counter", (tcCounter + 1).toString());

      let qnCounter = parseInt(localStorage.getItem("mahadev_quotation_no_counter") || "1011");
      if (isNaN(qnCounter) || qnCounter < 1011) qnCounter = 1011;
      newDest.quotationNo = qnCounter.toString();
      localStorage.setItem("mahadev_quotation_no_counter", (qnCounter + 1).toString());
    }
    newDest.destination = newDestName.trim();
    newDest.guestName = "Name of Client";
    newDest.arrivalDate = new Date().toISOString().split('T')[0];
    newDest.pickupPoint = "";
    newDest.dropPoint = "";
    delete newDest.pickDrop;
    newDest.vehicleType = "SEDAN CAB (AC CAR)";
    newDest.coverImage = "";
    const defaultHotel = {
      id: `hotel-${Date.now()}`,
      hotelName: "Standard Deluxe Stay",
      hotelStar: "3 Star (Deluxe)",
      hotelRoomType: "Standard Room",
      hotelMealPlan: "Breakfast Only (CP)",
      hotelCheckIn: `${new Date().toISOString().split('T')[0]}T14:00`,
      hotelCheckOut: `${calculateCheckOutDate(new Date().toISOString().split('T')[0], 3)}T12:00`,
      hotelImage: "",
    };
    newDest.hotels = [defaultHotel];
    
    // Attempt to pre-populate database from hotelLookup
    const prefilled = getPrepopulatedHotels(newDest.destination);
    if (prefilled && prefilled.length > 0) {
      newDest.hotelLibrary = prefilled;
      const firstLib = prefilled[0];
      newDest.hotels[0] = {
        ...newDest.hotels[0],
        hotelName: firstLib.hotelName,
        hotelStar: firstLib.hotelStar,
        hotelRoomType: firstLib.hotelRoomType,
        hotelMealPlan: firstLib.hotelMealPlan,
        hotelImage: firstLib.hotelImage,
      };
      newDest.itinerary = [
        {
          day: 1,
          title: "Arrival & Transfer to Hotel",
          stay: firstLib.hotelName,
          mealPlan: "No Meals (EP)",
          description: "Arrive at destination. Our driver will pick you up and transfer you to the hotel/resort. Enjoy the rest of the day at leisure.",
          image: "",
        }
      ];
    } else {
      newDest.hotelLibrary = [{ ...defaultHotel, id: `lib-hotel-${Date.now()}` }];
      newDest.itinerary = [
        {
          day: 1,
          title: "Arrival & Transfer to Hotel",
          stay: "Standard Deluxe Stay",
          mealPlan: "No Meals (EP)",
          description: "Arrive at destination. Our driver will pick you up and transfer you to the hotel/resort. Enjoy the rest of the day at leisure.",
          image: "",
        }
      ];
    }
    
    const updated = [...destinations, newDest];
    setDestinations(updated);
    saveDestinations(updated).catch(err => console.error("Failed to save destination to IndexedDB:", err));
    setActiveIndex(updated.length - 1);
    setNewDestName("");
    setShowAddModal(false);
  };

  const handleDeleteDestination = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const dest = destinations[index];
    if (dest?.isDefault) {
      alert("The default template destination cannot be deleted.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${dest.destination}"?`)) {
      const updated = destinations.filter((_, idx) => idx !== index);
      setDestinations(updated);
      saveDestinations(updated).catch(err => console.error("Failed to save destinations to IndexedDB:", err));
      if (activeIndex >= updated.length) {
        setActiveIndex(Math.max(0, updated.length - 1));
      } else if (activeIndex === index) {
        setActiveIndex(0);
      }
    }
  };

  const handleRenameDestination = () => {
    if (!renameName.trim() || renameIndex === -1) return;
    const updated = [...destinations];
    updated[renameIndex].destination = renameName.trim();
    setDestinations(updated);
    saveDestinations(updated).catch(err => console.error("Failed to save destinations to IndexedDB:", err));
    setShowRenameModal(false);
    setRenameIndex(-1);
    setRenameName("");
  };

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

  const handleDeleteTrackedItem = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this PDF record from history?")) return;
    
    const updatedHistory = trackingHistory.filter((_, i) => i !== idx);
    setTrackingHistory(updatedHistory);
    saveTrackingHistory(updatedHistory).catch(err => console.error("Failed to save tracking history:", err));
    
    // Fallback if we deleted the currently active tracked item
    if (activeMode === "tracked") {
      if (updatedHistory.length === 0) {
        setActiveMode("template");
        setSidebarTab("templates");
      } else if (activeTrackedIndex >= updatedHistory.length) {
        setActiveTrackedIndex(updatedHistory.length - 1);
      }
    }
  };

  // Update check-in, check-out dates and itinerary when arrivalDate changes
  const handleDataChange = (newData: PDFData) => {
    const prevArrival = formData.arrivalDate;
    const newArrival = newData.arrivalDate;
    const nights = newData.durationNights;

    // Check if arrival date changed and is valid
    if (newArrival !== prevArrival && newArrival.includes("-")) {
      const checkoutDateStr = calculateCheckOutDate(newArrival, nights);
      
      if (newData.hotels && newData.hotels[0]) {
        newData.hotels[0].hotelCheckIn = `${newArrival}T14:00`;
        newData.hotels[0].hotelCheckOut = `${checkoutDateStr}T12:00`;
      }
      
      // Update check-in date inside Day 1 hotel stay if present
      if (newData.itinerary[0] && newData.hotels && newData.hotels[0]) {
        newData.itinerary[0].stay = newData.hotels[0].hotelName;
      }
    }

    if (activeMode === "template") {
      const updated = [...destinations];
      updated[activeIndex] = newData;
      setDestinations(updated);
      saveDestinations(updated).catch(err => console.error("Failed to save destinations to IndexedDB:", err));
    } else {
      const updatedHistory = [...trackingHistory];
      if (updatedHistory[activeTrackedIndex]) {
        updatedHistory[activeTrackedIndex] = {
          ...updatedHistory[activeTrackedIndex],
          clientName: newData.guestName || "Client",
          destination: newData.destination || "Destination",
          data: newData
        };
        setTrackingHistory(updatedHistory);
        saveTrackingHistory(updatedHistory).catch(err => console.error("Failed to save tracking history to IndexedDB:", err));
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfLibrary) return;
    setIsGenerating(true);

    try {
      const nextVersion = (formData.version || 1) + 1;
      const updatedData = { ...formData, version: nextVersion };

      // Save version increment to state/db
      if (activeMode === "template") {
        const updated = [...destinations];
        updated[activeIndex] = updatedData;
        setDestinations(updated);
        await saveDestinations(updated);
      } else {
        const updatedHistory = [...trackingHistory];
        if (updatedHistory[activeTrackedIndex]) {
          updatedHistory[activeTrackedIndex] = {
            ...updatedHistory[activeTrackedIndex],
            data: updatedData
          };
          setTrackingHistory(updatedHistory);
          await saveTrackingHistory(updatedHistory);
        }
      }

      const { PDFDocumentComponent } = await import("./PDFDocument");
      const blob = await pdfLibrary.pdf(<PDFDocumentComponent data={updatedData} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const sanitizedName = updatedData.guestName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const sanitizedDest = updatedData.destination.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `Mahadev_Holidays_${sanitizedDest}_${sanitizedName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Track this PDF download
      const newTrackedItem = {
        id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }),
        clientName: updatedData.guestName || "Client",
        destination: updatedData.destination || "Destination",
        data: JSON.parse(JSON.stringify(updatedData)) // Deep clone data snapshot!
      };
      
      setTrackingHistory(prev => {
        const updated = [newTrackedItem, ...prev];
        saveTrackingHistory(updated).catch(err => console.error("Failed to save tracking history to DB:", err));
        return updated;
      });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Error compiling PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadVoucherPDF = async () => {
    if (!pdfLibrary) return;
    setIsGenerating(true);

    try {
      const nextVersion = (formData.version || 1) + 1;
      const updatedData = { ...formData, version: nextVersion };

      // Save version increment to state/db
      if (activeMode === "template") {
        const updated = [...destinations];
        updated[activeIndex] = updatedData;
        setDestinations(updated);
        await saveDestinations(updated);
      } else {
        const updatedHistory = [...trackingHistory];
        if (updatedHistory[activeTrackedIndex]) {
          updatedHistory[activeTrackedIndex] = {
            ...updatedHistory[activeTrackedIndex],
            data: updatedData
          };
          setTrackingHistory(updatedHistory);
          await saveTrackingHistory(updatedHistory);
        }
      }

      const { VoucherPDFDocumentComponent } = await import("./PDFDocument");
      const blob = await pdfLibrary.pdf(<VoucherPDFDocumentComponent data={updatedData} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const sanitizedName = (updatedData.paymentPaidBy || updatedData.guestName).replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const sanitizedDest = updatedData.destination.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `Mahadev_Voucher_${sanitizedDest}_${sanitizedName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Track this PDF download (Voucher downloads also get tracked inside the Tracking History!)
      const newTrackedItem = {
        id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }),
        clientName: (updatedData.paymentPaidBy || updatedData.guestName) + " (Voucher)",
        destination: updatedData.destination || "Destination",
        data: JSON.parse(JSON.stringify(updatedData)) // Deep clone data snapshot!
      };
      
      setTrackingHistory(prev => {
        const updated = [newTrackedItem, ...prev];
        saveTrackingHistory(updated).catch(err => console.error("Failed to save tracking history to DB:", err));
        return updated;
      });
    } catch (err) {
      console.error("Failed to generate Voucher PDF:", err);
      alert("Error compiling Voucher PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAction = async () => {
    if (workspaceTab === "voucher") {
      await handleDownloadVoucherPDF();
    } else {
      await handleDownloadPDF();
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

      {/* PWA Install Prompt Banner */}
      {!isStandalone && installPrompt && (
        <div className="pwa-install-banner">
          <div className="pwa-install-content">
            <Smartphone size={18} />
            <span>Install <strong>Mahadev Holidays</strong> for app-like experience</span>
          </div>
          <div className="pwa-install-actions">
            <button
              className="pwa-install-btn"
              onClick={async () => {
                installPrompt.prompt();
                const result = await installPrompt.userChoice;
                if (result.outcome === "accepted") {
                  setInstallPrompt(null);
                }
              }}
            >
              Install
            </button>
            <button
              className="pwa-dismiss-btn"
              onClick={() => setInstallPrompt(null)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      {!isStandalone && isIOS && !dismissedIOSBanner && (
        <div className="pwa-install-banner ios">
          <div className="pwa-install-content">
            <Smartphone size={18} />
            <span>
              Install on iOS: Tap Share <span style={{ fontSize: "1.1rem" }}>⎋</span> then "Add to Home Screen" <span style={{ fontSize: "1.1rem" }}>➕</span>
            </span>
          </div>
          <button className="pwa-dismiss-btn" onClick={() => setDismissedIOSBanner(true)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="workspace-view-wrapper">
          {/* Top Workspace Bar */}
          <div className="workspace-header-bar">
            <div className="workspace-title-info">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Menu size={14} />
                <span>Destinations ({destinations.length})</span>
              </button>
              <span className="divider-dot"></span>
              <strong>Mahadev Holidays Quotation Builder</strong>
              <span className="divider-dot"></span>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{formData.destination} Package</span>
            </div>

            <div className="workspace-tabs" style={{ display: "flex", gap: "0.5rem", borderBottom: "none", margin: "0 auto 0 1.5rem" }}>
              <button
                className={`workspace-tab-btn ${workspaceTab === "quotation" ? "active" : ""}`}
                onClick={() => setWorkspaceTab("quotation")}
                style={{
                  padding: "0.4rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: workspaceTab === "quotation" ? "var(--accent)" : "transparent",
                  color: workspaceTab === "quotation" ? "var(--primary)" : "var(--text-muted)",
                  transition: "all 0.2s ease"
                }}
              >
                Quotation Brochure
              </button>
              <button
                className={`workspace-tab-btn ${workspaceTab === "voucher" ? "active" : ""}`}
                onClick={() => setWorkspaceTab("voucher")}
                style={{
                  padding: "0.4rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: workspaceTab === "voucher" ? "var(--accent)" : "transparent",
                  color: workspaceTab === "voucher" ? "var(--primary)" : "var(--text-muted)",
                  transition: "all 0.2s ease"
                }}
              >
                Voucher & Receipt
              </button>
            </div>

            <button
              className="btn btn-accent"
              onClick={handleDownloadAction}
              disabled={isGenerating || !pdfLibrary}
            >
              <Download size={16} />
              <span className="btn-text-desktop">
                {isGenerating ? "Generating..." : workspaceTab === "voucher" ? "Download Voucher PDF" : "Download PDF Quotation"}
              </span>
              <span className="btn-text-mobile">
                {isGenerating ? "PDF..." : "PDF"}
              </span>
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

          {/* Main workspace container wrapping Sidebar & Panels */}
          <div className="main-portal-workspace">
            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
              <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Destinations Sidebar */}
            <div className={`destinations-sidebar ${isSidebarOpen ? "open" : ""}`}>
              <div className="sidebar-header">
                <h3>{sidebarTab === "templates" ? "Destinations" : "PDF History"}</h3>
                {sidebarTab === "templates" && (
                  <button 
                    className="btn btn-accent btn-sm" 
                    onClick={() => setShowAddModal(true)}
                    style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>

              <div className="sidebar-tabs-row" style={{ display: "flex", borderBottom: "1px solid var(--border-color)", marginBottom: "0.5rem", padding: "0 0.5rem" }}>
                <button
                  className={`sidebar-tab-btn ${sidebarTab === "templates" ? "active" : ""}`}
                  onClick={() => {
                    setSidebarTab("templates");
                    setActiveMode("template");
                  }}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "none",
                    background: "transparent",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: sidebarTab === "templates" ? "var(--accent)" : "var(--text-muted)",
                    borderBottom: sidebarTab === "templates" ? "2px solid var(--accent)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  Templates
                </button>
                <button
                  className={`sidebar-tab-btn ${sidebarTab === "tracking" ? "active" : ""}`}
                  onClick={() => {
                    setSidebarTab("tracking");
                    if (trackingHistory.length > 0) {
                      setActiveMode("tracked");
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "none",
                    background: "transparent",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: sidebarTab === "tracking" ? "var(--accent)" : "var(--text-muted)",
                    borderBottom: sidebarTab === "tracking" ? "2px solid var(--accent)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  PDF History
                </button>
              </div>

              <div className="sidebar-list" style={{ overflowY: "auto", flex: 1 }}>
                {sidebarTab === "templates" ? (
                  destinations.map((dest, idx) => (
                    <div 
                      key={dest.id || idx} 
                      className={`dest-card ${activeMode === "template" && idx === activeIndex ? "active" : ""}`}
                      onClick={() => {
                        setActiveIndex(idx);
                        setActiveMode("template");
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                    >
                      <div className="dest-card-img">
                        <img src={dest.coverImage || "/goa.png"} alt={dest.destination} />
                      </div>
                      <div className="dest-card-info">
                        <div className="dest-card-name">{dest.destination}</div>
                        <div className="dest-card-meta">
                          {dest.durationNights}N / {dest.durationDays}D
                        </div>
                      </div>
                      <div className="dest-card-actions">
                        <button 
                          className="action-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameIndex(idx);
                            setRenameName(dest.destination);
                            setShowRenameModal(true);
                          }}
                          title="Rename Destination"
                        >
                          <Edit3 size={12} />
                        </button>
                        {!dest.isDefault && (
                          <button 
                            className="action-btn delete" 
                            onClick={(e) => handleDeleteDestination(idx, e)}
                            title="Delete Destination"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  trackingHistory.length === 0 ? (
                    <div style={{ padding: "1.5rem 1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: "1.4" }}>
                      No PDFs downloaded yet. Downloaded PDF quotes will automatically appear here for tracking!
                    </div>
                  ) : (
                    trackingHistory.map((item, idx) => (
                      <div 
                        key={item.id || idx} 
                        className={`dest-card ${activeMode === "tracked" && idx === activeTrackedIndex ? "active" : ""}`}
                        onClick={() => {
                          setActiveTrackedIndex(idx);
                          setActiveMode("tracked");
                          if (isMobile) setIsSidebarOpen(false);
                        }}
                      >
                        <div className="dest-card-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(197, 160, 89, 0.1)", borderRadius: "4px" }}>
                          <span style={{ fontSize: "1.25rem" }}>📄</span>
                        </div>
                        <div className="dest-card-info" style={{ overflow: "hidden" }}>
                          <div className="dest-card-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: "bold" }}>
                            {item.clientName}_{item.destination}
                          </div>
                          <div className="dest-card-meta" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            {item.timestamp}
                          </div>
                          <div style={{ fontSize: "0.65rem", color: "var(--accent)", marginTop: "2px", fontWeight: "bold" }}>
                            Bal: ₹{(parseFloat(item.data.totalPrice || "0") - parseFloat(item.data.advancePrice || "0")).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="dest-card-actions">
                          <button 
                            className="action-btn delete" 
                            onClick={(e) => handleDeleteTrackedItem(idx, e)}
                            title="Delete PDF Record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>

            {/* Workspace Panels (Responsive logic) */}
            <div className="split-workspace-panels" ref={containerRef} style={{ flex: 1 }}>
              {isMobile ? (
                // Mobile Single Tab View
                activeMobileTab === "edit" ? (
                  <div className="workspace-panel-form" style={{ width: "100%" }}>
                    <PackageForm
                      data={formData}
                      onChange={handleDataChange}
                      activeStep={formStep}
                      setActiveStep={setFormStep}
                      onDownload={handleDownloadAction}
                      isGenerating={isGenerating}
                      mode={workspaceTab}
                    />
                  </div>
                ) : (
                  <div className="workspace-panel-preview" style={{ width: "100%" }}>
                    <PDFPreview data={formData} type={workspaceTab} />
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
                      onDownload={handleDownloadAction}
                      isGenerating={isGenerating}
                      mode={workspaceTab}
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
                    <PDFPreview data={formData} type={workspaceTab} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MODALS */}
        {showAddModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h4 style={{ fontFamily: "var(--font-sans)", color: "var(--primary)", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Create New Destination</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.5rem 0 1rem 0" }}>
                Enter the name of your destination. We will prefill it with standard template details to help you get started.
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="E.g. Manali, Maldives, Kerala..."
                value={newDestName}
                onChange={(e) => setNewDestName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDestination()}
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-main)",
                  outline: "none"
                }}
              />
              <div className="modal-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleAddDestination} disabled={!newDestName.trim()}>Create</button>
              </div>
            </div>
          </div>
        )}

        {showRenameModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h4 style={{ fontFamily: "var(--font-sans)", color: "var(--primary)", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>Rename Destination</h4>
              <input
                type="text"
                className="form-input"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRenameDestination()}
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-main)",
                  outline: "none",
                  marginTop: "1rem"
                }}
              />
              <div className="modal-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowRenameModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleRenameDestination} disabled={!renameName.trim()}>Rename</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        /* WORKSPACE PANELS */
        .workspace-view-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .workspace-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 2rem;
          background-color: var(--bg-secondary);
          border-bottom: 1.5px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .workspace-title-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.9rem;
        }

        .divider-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--accent);
          opacity: 0.6;
        }

        .split-workspace-panels {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
          min-height: 0;
        }

        .workspace-panel-form {
          height: 100%;
          overflow: hidden;
        }

        .workspace-panel-preview {
          height: 100%;
          background-color: #f1f5f9;
          overflow-y: auto;
        }

        /* Resizer Bar Styling */
        .workspace-resizer-bar {
          width: 10px;
          background-color: var(--border-color);
          cursor: col-resize;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          border-right: 1px solid rgba(0, 0, 0, 0.05);
        }

        .workspace-resizer-bar:hover,
        .workspace-resizer-bar.active {
          background-color: var(--accent);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.35);
        }

        .grab-handle {
          width: 4px;
          height: 32px;
          background-color: var(--text-muted);
          border-radius: var(--radius-full);
          opacity: 0.6;
          position: relative;
        }

        .grab-handle::before,
        .grab-handle::after {
          content: "";
          position: absolute;
          width: 2px;
          height: 12px;
          background-color: var(--text-muted);
          border-radius: 1px;
          top: 10px;
          opacity: 0.5;
        }

        .grab-handle::before {
          left: -4px;
        }

        .grab-handle::after {
          right: -4px;
        }

        .workspace-resizer-bar:hover .grab-handle,
        .workspace-resizer-bar.active .grab-handle {
          background-color: var(--primary-dark);
          opacity: 0.95;
        }

        .workspace-resizer-bar:hover .grab-handle::before,
        .workspace-resizer-bar:hover .grab-handle::after,
        .workspace-resizer-bar.active .grab-handle::before,
        .workspace-resizer-bar.active .grab-handle::after {
          background-color: var(--primary-dark);
          opacity: 0.8;
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
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn-accent {
          background: linear-gradient(135deg, #d4af37 0%, #c5a059 100%);
          color: #0f172a;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.25);
        }

        .btn-accent:hover {
          background: linear-gradient(135deg, #e5c158 0%, #d4af37 100%);
          box-shadow: 0 6px 14px rgba(212, 175, 55, 0.4);
        }

        .btn-accent:active {
          transform: translateY(0);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* MOBILE TAB SYSTEM */
        .mobile-tabs-container {
          display: flex;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 30px;
          margin: 0.5rem 0.75rem 0.25rem 0.75rem;
          padding: 4px;
          gap: 0;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
          z-index: 10;
        }

        .mobile-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.45rem;
          border-radius: 25px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-tab-btn.active {
          background-color: var(--accent);
          color: var(--primary) !important;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(197, 160, 89, 0.25);
        }

        .btn-text-mobile {
          display: none;
        }

        /* Responsive items */
        @media (max-width: 1024px) {
          .portal-header {
            padding: 0.3rem 0.75rem;
          }

          .brand-tagline {
            display: none !important;
          }

          .logo-image {
            height: 24px;
          }

          .brand-name {
            font-size: 0.95rem;
          }

          .user-info {
            display: none !important;
          }

          .user-badge {
            padding: 0.25rem !important;
            border: none !important;
            background: transparent !important;
          }

          .workspace-header-bar {
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: stretch !important;
            padding: 0.6rem 0.75rem !important;
            gap: 0.5rem !important;
            height: auto !important;
          }

          .workspace-title,
          .breadcrumb-separator,
          .active-destination-badge {
            display: none !important;
          }

          .workspace-title-info {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            gap: 0.4rem !important;
          }

          .workspace-tabs {
            margin: 0 !important;
            display: flex !important;
            justify-content: space-between !important;
            width: 100% !important;
            gap: 0.35rem !important;
          }

          .workspace-tab-btn {
            flex: 1 !important;
            text-align: center !important;
            padding: 0.45rem !important;
            font-size: 0.75rem !important;
          }

          .mobile-menu-btn {
            display: flex !important;
            align-items: center !important;
            gap: 0.4rem !important;
            padding: 0.35rem 0.75rem !important;
            background-color: var(--primary) !important;
            color: #ffffff !important;
            border-radius: var(--radius-sm) !important;
            font-size: 0.78rem !important;
            font-weight: 700 !important;
          }

          .mobile-menu-btn::after {
            content: " Destinations" !important;
          }

          .btn-accent {
            width: 100% !important;
            padding: 0.5rem 1rem !important;
            font-size: 0.82rem !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }

          .btn-text-desktop {
            display: none !important;
          }

          .btn-text-mobile {
            display: inline !important;
          }

          .workspace-view-wrapper {
            flex: 1;
            min-height: 0;
          }

          .workspace-header-bar {
            flex-wrap: wrap !important;
            padding: 0.5rem 0.75rem !important;
            gap: 0.4rem !important;
          }

          .workspace-tabs {
            order: 3 !important;
            width: 100% !important;
            justify-content: center !important;
            margin: 0 !important;
          }
        }
        /* DESTINATIONS SIDEBAR */
        .main-portal-workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
          min-height: 0;
        }

        .destinations-sidebar {
          width: 260px;
          min-width: 260px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100%;
          z-index: 10;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-primary);
        }

        .sidebar-header h3 {
          font-size: 1.05rem;
          font-family: var(--font-sans);
          font-weight: 700;
          color: var(--primary);
        }

        .sidebar-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dest-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: var(--bg-primary);
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .dest-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .dest-card.active {
          border-color: var(--accent);
          background-color: rgba(212, 175, 55, 0.06);
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.12);
        }

        .dest-card-img {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: #cbd5e1;
          flex-shrink: 0;
          border: 1px solid var(--border-color);
        }

        .dest-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dest-card:hover .dest-card-img img {
          transform: scale(1.08);
        }

        .dest-card-info {
          flex: 1;
          overflow: hidden;
        }

        .dest-card-name {
          font-weight: 700;
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-main);
        }

        .dest-card-meta {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 0.1rem;
        }

        .dest-card-actions {
          display: flex;
          gap: 0.15rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .dest-card:hover .dest-card-actions {
          opacity: 1;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0.2rem;
          border-radius: 4px;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
        }

        .action-btn:hover {
          color: var(--accent);
          background-color: rgba(212, 175, 55, 0.1);
        }

        .action-btn.delete:hover {
          color: var(--error);
          background-color: rgba(239, 68, 68, 0.1);
        }

        /* MODALS STYLE */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background-color: var(--bg-secondary);
          border: 1.5px solid var(--accent);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
        }

        .sidebar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          z-index: 9;
          backdrop-filter: blur(6px);
          animation: overlayFade 0.25s ease-out;
        }

        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .destinations-sidebar {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .destinations-sidebar.open {
            transform: translateX(0);
          }
        }

        /* PWA INSTALL BANNER */
        .pwa-install-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #0a2540 0%, #1e3a8a 100%);
          color: #ffffff;
          font-size: 0.85rem;
          gap: 1rem;
          flex-wrap: wrap;
          border-bottom: 2px solid var(--accent);
        }

        .pwa-install-banner.ios {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }

        .pwa-install-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #f1f5f9;
        }

        .pwa-install-content svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .pwa-install-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pwa-install-btn {
          padding: 0.35rem 1rem;
          background-color: var(--accent);
          color: var(--primary-dark);
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pwa-install-btn:hover {
          background-color: var(--accent-hover);
          transform: translateY(-1px);
        }

        .pwa-dismiss-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #cbd5e1;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pwa-dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
