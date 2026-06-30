import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";

import { playfairDisplayBoldBase64, montserratBoldBase64 } from "./fontsBase64";

// Register custom Google Fonts for premium styling
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: montserratBoldBase64, fontWeight: 700 }
  ]
});

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: playfairDisplayBoldBase64, fontWeight: 700 }
  ]
});

// Luxury Color Palette
const colors = {
  primary: "#0a2540",      // Deep Luxury Navy
  secondary: "#1e3a8a",    // Elegant Classic Blue
  accent: "#c5a059",       // Premium Gold Accent
  accentLight: "#faf6eb",  // Soft Gold Cream
  textMain: "#1e293b",     // Slate Dark Body Text
  textMuted: "#475569",    // Muted Slate Text
  bgLight: "#f8fafc",      // Off-White Ice
  border: "#cbd5e1",       // Border Grey
  white: "#ffffff",
  success: "#10b981",      // Success Green
  successBg: "#f0fdf4",
  successBorder: "#bbf7d0",
  error: "#ef4444",        // Danger Red
  errorBg: "#fef2f2",
  errorBorder: "#fecaca",
  link: "#1e40af",         // Classic Anchor Blue
  warning: "#ea580c",      // Warning Orange for Cancellations
  warningBg: "#fff7ed",
  warningBorder: "#fed7aa",
  infoBg: "#eff6ff",       // Light Info Blue for Payments
  infoBorder: "#bfdbfe",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 105,          // Increased to clear larger header logo
    paddingBottom: 85,       // Room for the columns footer
    paddingHorizontal: 40,
    backgroundColor: colors.white,
    fontFamily: "Helvetica",
    fontSize: 10.5,          // Enlarged body text for high readability
    color: colors.textMain,
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    display: "flex",
    flexDirection: "column",
  },
  headerMain: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 3,    // Thicker premium border line
    borderBottomColor: colors.accent,
    paddingBottom: 8,
  },
  logo: {
    height: 70,              // Made bigger prominent logo in header
    width: "auto",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1.5,
    borderTopColor: colors.accent,
    paddingTop: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerLogo: {
    height: 28,              // Footer logo image
    width: "auto",
  },
  footerCol: {
    display: "flex",
    flexDirection: "column",
  },
  footerColTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  footerColText: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.3,
  },
  footerLink: {
    color: colors.link,
    textDecoration: "underline",
  },
  pageBadge: {
    backgroundColor: "#10b981", // Matching page number badge from reference
    color: colors.white,
    padding: "3 8",
    fontSize: 8,
    fontWeight: "bold",
    borderRadius: 3,
    marginTop: 2,
  },
  // Cover Section
  coverImageContainer: {
    position: "relative",
    width: "100%",
    height: 330,             // Enlarged cover image (Flamingo Style)
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.accent,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverTitleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0a2540", // Solid Dark Navy (Flamingo style)
    borderTopWidth: 3,
    borderTopColor: colors.accent, // Gold top border
    padding: "16 22",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  coverTitle: {
    color: colors.white,
    fontSize: 28,            // Significantly larger cover title
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginVertical: 4,
  },
  coverSubtitle: {
    color: colors.accent,
    fontSize: 9.5,
    fontWeight: "bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  // Greeting Section
  greetingSection: {
    marginBottom: 12,
    padding: "8 15",
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    borderLeftWidth: 5,      // Thicker gold border accent
    borderLeftColor: colors.accent,
  },
  greetingTitle: {
    fontSize: 12.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 2,
  },
  greetingSub: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 4,
  },
  greetingText: {
    color: colors.textMain,
    lineHeight: 1.45,
    fontSize: 10.5,
  },
  // Grid Details
  gridTable: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 2,          // Solid primary border
    borderColor: colors.primary,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  gridRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  gridRowLast: {
    display: "flex",
    flexDirection: "row",
  },
  gridHeaderCell: {
    width: "35%",
    backgroundColor: colors.primary,
    padding: "6 12",
    fontWeight: "bold",
    color: colors.white,
    fontSize: 10,
    borderRightWidth: 1.5,
    borderRightColor: "#1e3a8a",
  },
  gridValueCell: {
    width: "65%",
    padding: "6 12",
    fontSize: 10,
    fontWeight: "bold",
    color: colors.secondary,
    backgroundColor: colors.white,
  },
  // Section Headers
  sectionHeader: {
    fontSize: 12.5,          // Larger Section headers
    fontWeight: "bold",
    color: colors.white,
    backgroundColor: colors.primary,
    padding: "6 12",
    borderRadius: 4,
    marginBottom: 12,
    textTransform: "uppercase",
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  // Hotel Card Stacked Vertically (Page 2) - HUGE Image Layout
  hotelCard: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderLeftWidth: 6,      // Gold sidebar highlight
    borderLeftColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.bgLight,
    display: "flex",
    flexDirection: "column",  // Stack details vertically to allow huge photo
  },
  hotelImage: {
    width: "100%",           // Giant full-width hotel image
    height: 180,             // Enlarged height to balance page layout
    borderRadius: 6,
    objectFit: "cover",
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginVertical: 6,
  },
  hotelInfo: {
    display: "flex",
    flexDirection: "column",
    marginTop: 4,
  },
  hotelNameRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  hotelName: {
    fontSize: 14,            // Larger hotel stay headline
    fontWeight: "bold",
    color: colors.primary,
  },
  hotelLink: {
    color: colors.link,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  hotelStarsWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  hotelDetailGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  hotelDetailCol: {
    width: "50%",            // Two column detailed layout
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 10,
  },
  hotelDetailLabel: {
    width: 70,
    color: colors.textMuted,
  },
  hotelDetailValue: {
    flex: 1,
    fontWeight: "bold",
    color: colors.textMain,
  },
  // Services Grid
  servicesTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 6,
    textAlign: "center",
  },
  servicesGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.bgLight,
    padding: "10 15",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.accent,
    marginBottom: 15,
  },
  serviceItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "14%",
  },
  serviceIconWrapper: {
    height: 16,
    marginBottom: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: colors.textMain,
  },
  // Pricing Card Block
  priceContainer: {
    backgroundColor: colors.accentLight, // Cream background
    borderWidth: 4,                      // Thicker gold border
    borderColor: colors.accent,          // Gold
    borderRadius: 12,
    padding: "22 30",                    // Enlarged breathing room
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  priceMainRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  priceLabel: {
    fontSize: 13,                        // Highlighted label size
    color: colors.primary,               // Navy text color
    fontWeight: "bold",
  },
  priceTotal: {
    fontSize: 30,                        // Massive price text size (bohot bada)
    fontWeight: "bold",
    color: colors.primary,               // Navy price color
  },
  priceRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 3,
  },
  priceRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    borderBottomStyle: "dashed",
    width: "100%",
    marginVertical: 4,
  },
  priceLabelSmall: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: "bold",
  },
  priceValueGreen: {
    fontSize: 13.5,
    fontWeight: "bold",
    color: "#047857", // Dark Green
  },
  priceValueRed: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#b91c1c", // Red
  },
  // Vertical Itinerary Layout with HUGE centered photos (Page 3 & 4)
  itineraryBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  itineraryDayCard: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: colors.bgLight,
    padding: 12,
    marginBottom: 15,
    display: "flex",
    flexDirection: "column",
  },
  itineraryDayHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#eff6ff",
    padding: "6 12",
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  itineraryDayTitle: {
    fontSize: 12,            // Larger itinerary title font
    fontWeight: "bold",
    color: colors.primary,
  },
  itineraryDayStay: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.secondary,
    backgroundColor: "#dbeafe",
    padding: "2 6",
    borderRadius: 4,
  },
  itineraryBigImage: {
    width: "100%",           // Giant full-width daily photo
    height: 200,             // Enlarged cinematic photo to eliminate empty page gaps
    borderRadius: 6,
    objectFit: "cover",
    borderWidth: 1.5,
    borderColor: colors.accent,
    marginVertical: 6,
  },
  itineraryDayDesc: {
    fontSize: 10.5,          // Larger description text
    color: colors.textMain,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  itineraryMetaRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
  },
  itineraryDayMeal: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: colors.accent,
  },
  itineraryBadgeGreen: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    fontSize: 8.5,
    fontWeight: "bold",
    padding: "2 8",
    borderRadius: 4,
  },
  // Terms & Conditions Cards (Page 5) - REDESIGNED & BOLD STYLING
  policiesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  policiesGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  policyColumnInclusions: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.successBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.successBg,
  },
  policyColumnExclusions: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.errorBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.errorBg,
  },
  policyCardBlockPayment: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.infoBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.infoBg,
  },
  policyCardBlockCancellation: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.warningBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.warningBg,
  },
  policyTitlePayment: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#bfdbfe",
    paddingBottom: 4,
  },
  policyTitleCancellation: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: colors.warning,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fed7aa",
    paddingBottom: 4,
  },
  policyTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 4,
  },
  policyItem: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  policyBulletWrapper: {
    width: 12,
    marginRight: 6,
    marginTop: 2,
  },
  policyText: {
    flex: 1,
    fontSize: 9.8,
    color: colors.textMain,
    lineHeight: 1.45,
  },
  // Bank Details Card
  bankCard: {
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.bgLight,
    marginBottom: 8,
  },
  bankTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  bankRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 5,
  },
  bankLabel: {
    width: 110,
    fontSize: 10,
    color: colors.textMuted,
  },
  bankValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textMain,
  },
  // Brand Card Profile
  brandProfileCard: {
    borderWidth: 2,
    borderColor: colors.accent,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    borderRadius: 6,
    padding: 12,
    backgroundColor: colors.accentLight, // Cream Gold Highlight
    marginBottom: 8,
  },
  brandProfileHeadline: {
    fontSize: 12.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 2,
  },
  brandProfileGovt: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 2,
  },
  brandProfileAddr: {
    fontSize: 8.5,
    color: colors.textMuted,
    marginBottom: 4,
  },
  brandDetailsDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    marginVertical: 4,
  },
  brandListLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 2,
  },
  brandListItems: {
    fontSize: 8.5,
    color: colors.textMain,
    lineHeight: 1.45,
  },
  // Thank you block
  thankYouBlock: {
    marginTop: 10,
    alignItems: "center",
    backgroundColor: colors.bgLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  thankYouTitle: {
    fontSize: 20,            // Extra large title
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  thankYouSub: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: "bold",
  },
  thankYouLinksRow: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  mapsLink: {
    fontSize: 10,
    color: colors.link,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  whatsappLink: {
    fontSize: 10,
    color: colors.link,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  // Abbreviations & Codes Box
  abbrevBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 6,
    backgroundColor: colors.bgLight,
    marginTop: 6,
  },
  abbrevTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 3,
  },
  abbrevText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 1.35,
  },
});

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
  description: string;
  mealPlan: string;
  image?: string;
  transferBasis?: string;
  customTransferBasis?: string;
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
  trainPricePerPerson?: string;
  trainPriceTotal?: string;
  flightPricePerPerson?: string;
  flightPriceTotal?: string;
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

const getAssetUrl = (path: string) => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
};

// Simple date formatter to convert YYYY-MM-DD to DD MMM YYYY
const formatPDFDate = (dateStr: string) => {
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
    const formattedDate = formatPDFDate(datePart);
    return `${formattedDate} | ${timePart}`;
  }
  if (dateTimeStr.includes(" | ")) {
    const [datePart, timePart] = dateTimeStr.split(" | ");
    return `${formatPDFDate(datePart)} | ${timePart}`;
  }
  return dateTimeStr;
};

// Helper to resolve daily photos in vector PDF
const getDayImage = (dayNum: number) => {
  if (dayNum === 1) return getAssetUrl("/day1.png");
  if (dayNum === 2) return getAssetUrl("/day2.png");
  if (dayNum === 3) return getAssetUrl("/day3.png");
  if (dayNum === 4) return getAssetUrl("/day4.png");
  return getAssetUrl("/goa.png");
};

// Vector SVG Star component for @react-pdf/renderer
const VectorStar = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24" style={{ marginRight: 2 }}>
    <Path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill="#c5a059"
    />
  </Svg>
);

// Helper to render hotel rating stars dynamically
const renderStars = (starStr: string) => {
  let count = 3;
  if (starStr.includes("5")) count = 5;
  else if (starStr.includes("4")) count = 4;
  else if (starStr.includes("3")) count = 3;
  else if (starStr.includes("2")) count = 2;
  else if (starStr.includes("1")) count = 1;
  return (
    <View style={{ display: "flex", flexDirection: "row", marginTop: 2 }}>
      {Array(count).fill(0).map((_, i) => <VectorStar key={i} />)}
    </View>
  );
};

// Vector SVG Tick Icon component for @react-pdf/renderer
const VectorCheck = ({ size = 12 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#e6f4ea" />
    <Path
      d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
      fill="#10b981"
    />
  </Svg>
);

// Vector SVG Cross Icon component for @react-pdf/renderer
const VectorCross = ({ size = 12 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#fce8e6" />
    <Path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="#ef4444"
    />
  </Svg>
);

const getDayItineraryTransferText = (dayItem: ItineraryDay | null | undefined, data: PDFData) => {
  const selectedBasis = (dayItem && dayItem.transferBasis) || data.transferBasis || "PRIVATE BASIS (PVT)";
  const selectedCustom = (dayItem && dayItem.transferBasis) ? (dayItem.customTransferBasis || "") : (data.customTransferBasis || "");
  
  const basis = selectedBasis === "CUSTOM BASIS"
    ? (selectedCustom || "Custom")
    : selectedBasis;
  
  if (selectedBasis === "TRAIN BASIS (RAIL)") {
    return "RAIL: TRAIN BASIS (RAIL)";
  }
  
  if (selectedBasis === "FLIGHT BASIS (AIR)") {
    return "AIR: FLIGHT BASIS (AIR)";
  }
  
  if (basis === "NONE") {
    return `Cab: ${data.vehicleType}`;
  }
  
  if (data.vehicleType === "No Transport (Direct Check-in)") {
    return `Cab: ${basis}`;
  }
  return `Cab: ${data.vehicleType} (${basis})`;
};

export const PDFDocumentComponent: React.FC<{ data: PDFData }> = ({ data }) => {
  const formattedArrival = formatPDFDate(data.arrivalDate);

  return (
    <Document>
      {/* PAGE 1: DEDICATED LUXURY COVER PAGE */}
      <Page size="A4" style={{ ...styles.page, paddingTop: 45, paddingBottom: 45 }}>
        {/* Center Logo */}
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
          <Image src={getAssetUrl("/logo.jpg")} style={{ height: 90, width: "auto" }} />
        </View>

        {/* Large Cover Photo */}
        <View style={{ ...styles.coverImageContainer, height: 330, marginBottom: 15 }}>
          <Image src={data.coverImage || getAssetUrl("/goa.png")} style={styles.coverImage} />
          <View style={styles.coverTitleOverlay}>
            <Text style={{ fontSize: 9.5, color: "#cbd5e1", letterSpacing: 0.5, marginBottom: 2 }}>Here is your package for</Text>
            <Text style={{ ...styles.coverTitle, fontFamily: "Playfair Display", fontSize: 36, fontWeight: "bold", color: colors.white, letterSpacing: 1.5, textTransform: "uppercase", marginVertical: 3 }}>
              {data.destination.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 10, color: colors.accent, fontWeight: "bold", letterSpacing: 0.5 }}>
              {(data.durationNights ?? 0)} Nights {(data.durationDays ?? 0)} Days - Custom Tour Package
            </Text>
          </View>
        </View>

        {/* Trip Summary Box */}
        <View style={{ borderWidth: 2, borderColor: colors.accent, borderRadius: 8, padding: 15, backgroundColor: colors.accentLight, marginTop: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: colors.primary, marginBottom: 8, borderBottomWidth: 1.5, borderBottomColor: colors.accent, paddingBottom: 4 }}>
            QUOTATION DETAILS
          </Text>
          
          <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 9.5, color: colors.textMuted, fontWeight: "bold" }}>PREPARED FOR :</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>{data.guestName}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 9.5, color: colors.textMuted, fontWeight: "bold" }}>DURATION :</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>
                {(data.durationNights ?? 0).toString().padStart(2, "0")} Nights / {(data.durationDays ?? 0).toString().padStart(2, "0")} Days
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 9.5, color: colors.textMuted, fontWeight: "bold" }}>TRAVEL DATE :</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>{formattedArrival}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 9.5, color: colors.textMuted, fontWeight: "bold" }}>TOTAL TRAVELERS :</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>{data.numPax}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 9.5, color: colors.textMuted, fontWeight: "bold" }}>ACCOMMODATION :</Text>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>{data.numRooms}</Text>
            </View>
          </View>
        </View>

        {/* Footer info */}
        <View style={{ position: "absolute", bottom: 45, left: 40, right: 40, borderTopWidth: 1.5, borderTopColor: colors.accent, paddingTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontSize: 8.5, fontWeight: "bold", color: colors.primary }}>MAHADEV HOLIDAYS</Text>
            <Text style={{ fontSize: 7.5, color: colors.textMuted }}>Explore • Experience • Enjoy</Text>
            <Text style={{ fontSize: 7.5, color: colors.textMuted }}>Estd: 2022</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8.5, fontWeight: "bold", color: colors.primary }}>TOUR ADVISOR: VISHAL CHAUHAN (DARJI)</Text>
            <Text style={{ fontSize: 7.5, color: colors.textMuted }}>Ph: 9328151481</Text>
            <Text style={{ fontSize: 7.5, color: colors.textMuted }}>Email: mahadevholidays2000@gmail.com</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 2: CLIENT OVERVIEW & SERVICES CHECKLIST */}
      <Page size="A4" style={styles.page}>
        {/* Logo Header */}
        <View style={styles.header} fixed>
          <View style={styles.headerMain}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.logo} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Welcome Greeting & Package Overview</Text>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Dear Sir/Madam,</Text>
          <Text style={styles.greetingSub}>Greetings From Mahadev Holidays,</Text>
          <Text style={styles.greetingText}>
            Thanks for your query & as per our telephonic conversation, I am sending you the package details. Kindly check the details given below & for any clarifications feel free to mail or call.
          </Text>
        </View>

        {/* Metadata Table */}
        <View style={styles.gridTable}>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Guest / Client Name</Text>
            <Text style={styles.gridValueCell}>{data.guestName}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Arrival Date</Text>
            <Text style={styles.gridValueCell}>{formattedArrival}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Duration</Text>
            <Text style={styles.gridValueCell}>
              {(data.durationNights ?? 0).toString().padStart(2, "0")} Nights and {(data.durationDays ?? 0).toString().padStart(2, "0")} Days
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>No. of People</Text>
            <Text style={styles.gridValueCell}>{data.numPax}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Rooms Requested</Text>
            <Text style={styles.gridValueCell}>{data.numRooms}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Vehicle Type (Transfers)</Text>
            <Text style={styles.gridValueCell}>
              {getDayItineraryTransferText(null, data).replace("Cab: ", "")}
            </Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Pickup Point</Text>
            <Text style={styles.gridValueCell}>{data.pickupPoint || "Not Specified"}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Drop Point</Text>
            <Text style={styles.gridValueCell}>{data.dropPoint || "Not Specified"}</Text>
          </View>
          <View style={styles.gridRow}>
            <Text style={styles.gridHeaderCell}>Meal Plan</Text>
            <Text style={styles.gridValueCell}>{data.mealPlan}</Text>
          </View>
          <View style={styles.gridRowLast}>
            <Text style={styles.gridHeaderCell}>Hotel (Stay Category)</Text>
            <Text style={styles.gridValueCell}>
              {data.hotels ? data.hotels.map(h => h.hotelStar).filter((v, i, a) => a.indexOf(v) === i).join(", ") : ""}
            </Text>
          </View>
        </View>

        {/* Services Checklist */}
        <Text style={styles.servicesTitle}>Services Include</Text>
        <View style={styles.servicesGrid}>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.flights ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Flights</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.train ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Train</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.hotels ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Hotels</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.tours ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Tours</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.transport ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Transfers</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.cruise ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Cruise</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconWrapper}>
              {data.services?.addons ? <VectorCheck size={16} /> : <VectorCross size={16} />}
            </View>
            <Text style={styles.serviceName}>Add-ons</Text>
          </View>
        </View>

        {/* Footer with Columns Layout (GSTIN removed) */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.footerLogo} />
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>OUR ACHIEVEMENTS</Text>
            <Text style={styles.footerColText}>Estd: 2022</Text>
            <Text style={styles.footerColText}>Govt Approved Tour Operator</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>LEGAL INFO</Text>
            <Text style={styles.footerColText}>Approved by Ministry of Tourism</Text>
            <Text style={styles.footerColText}>Government of India</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>TOUR ADVISOR</Text>
            <Text style={styles.footerColText}>VISHAL CHAUHAN (DARJI)</Text>
            <Text style={styles.footerColText}>Ph: 9328151481</Text>
            <Text style={styles.footerColText}>mahadevholidays2000@gmail.com</Text>
          </View>
          <Text style={styles.pageBadge} render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
        </View>
      </Page>

      {/* PAGE 2: PRICING & HOTEL STAY DETAILS (HOTEL BELOW PRICING BANNERS) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerMain}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.logo} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Package Pricing Details</Text>

        {/* Pricing Panel - Placed FIRST on Page 2 */}
        {(() => {
          const baseTotal = parseFloat(data.totalPrice || "0") || 0;
          const trainTotal = parseFloat(data.trainPriceTotal || "0") || 0;
          const flightTotal = parseFloat(data.flightPriceTotal || "0") || 0;
          const overallTotal = baseTotal + trainTotal + flightTotal;

          const basePerPerson = parseFloat(data.pricePerPerson || "0") || 0;
          const trainPerPerson = parseFloat(data.trainPricePerPerson || "0") || 0;
          const flightPerPerson = parseFloat(data.flightPricePerPerson || "0") || 0;
          const overallPerPerson = basePerPerson + trainPerPerson + flightPerPerson;

          const advance = parseFloat(data.advancePrice || "0") || 0;
          const balance = overallTotal - advance;

          return (
            <View style={styles.priceContainer}>
              <View style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginBottom: 6 }}>
                <Text style={{ fontSize: 9.5, fontWeight: "bold", letterSpacing: 1, textTransform: "uppercase", color: colors.textMuted, marginBottom: 3 }}>
                  OVERALL PACKAGE PRICE (TOTAL)
                </Text>
                <Text style={[styles.priceTotal, { textAlign: "center" }]}>
                  Rs. {overallTotal.toLocaleString("en-IN")}/-
                </Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", color: colors.accent, marginTop: 2, letterSpacing: 0.5 }}>
                  Overall Per Person: Rs. {overallPerPerson.toLocaleString("en-IN")}/-
                </Text>
                {data.gstExtra && (
                  <Text style={{ fontSize: 8.5, fontWeight: "bold", color: colors.accent, marginTop: 2, letterSpacing: 0.5 }}>
                    (GST 5% EXTRA APPLICABLE)
                  </Text>
                )}
              </View>

              <View style={[styles.priceRowDivider, { borderBottomColor: "#cbd5e1" }]} />
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabelSmall}>1. LAND PACKAGE PRICE :</Text>
                <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>
                  Rs. {basePerPerson.toLocaleString("en-IN")} PP | Total: Rs. {baseTotal.toLocaleString("en-IN")}/-
                </Text>
              </View>

              {trainTotal > 0 && (
                <>
                  <View style={[styles.priceRowDivider, { borderBottomColor: "#cbd5e1" }]} />
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabelSmall}>2. TRAIN TICKET PRICE :</Text>
                    <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>
                      Rs. {trainPerPerson.toLocaleString("en-IN")} PP | Total: Rs. {trainTotal.toLocaleString("en-IN")}/-
                    </Text>
                  </View>
                </>
              )}

              {flightTotal > 0 && (
                <>
                  <View style={[styles.priceRowDivider, { borderBottomColor: "#cbd5e1" }]} />
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabelSmall}>3. FLIGHT TICKET PRICE :</Text>
                    <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.primary }}>
                      Rs. {flightPerPerson.toLocaleString("en-IN")} PP | Total: Rs. {flightTotal.toLocaleString("en-IN")}/-
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.priceRowDivider} />
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabelSmall}>ADVANCE PAYMENT RECEIVED :</Text>
                <Text style={styles.priceValueGreen}>Rs. {advance.toLocaleString("en-IN")}/-</Text>
              </View>

              <View style={[styles.priceRowDivider, { borderBottomColor: "#cbd5e1" }]} />
              
              <View style={styles.priceRow}>
                <Text style={{ ...styles.priceLabel, fontSize: 11.5 }}>BALANCE PAYMENT DUE :</Text>
                <Text style={styles.priceValueRed}>
                  Rs. {balance.toLocaleString("en-IN")}/-
                  {data.gstExtra && " + 5% GST EXTRA"}
                </Text>
              </View>
            </View>
          );
        })()}

        <Text style={styles.sectionHeader}>Hotel Stay Details</Text>

        {/* Hotel stay detailed cards */}
        {data.hotels && data.hotels.map((hotel, idx) => {
          const hotelCheckInFormatted = formatDateTime(hotel.hotelCheckIn);
          const hotelCheckOutFormatted = formatDateTime(hotel.hotelCheckOut);
          return (
            <View key={idx} style={styles.hotelCard} wrap={false}>
              <View style={styles.hotelInfo}>
                <View style={styles.hotelNameRow}>
                  <Text style={styles.hotelName}>
                    <Link style={styles.hotelLink} src={`https://www.google.com/search?q=${encodeURIComponent(hotel.hotelName)}`}>
                      {hotel.hotelName} (View)
                    </Link>
                  </Text>
                  <View style={styles.hotelStarsWrapper}>
                    {renderStars(hotel.hotelStar)}
                  </View>
                </View>
              </View>
              
              <Image src={hotel.hotelImage || getAssetUrl("/hotel.png")} style={styles.hotelImage} />

              <View style={styles.hotelDetailGrid}>
                <View style={styles.hotelDetailCol}>
                  <Text style={styles.hotelDetailLabel}>Room Type:</Text>
                  <Text style={styles.hotelDetailValue}>{hotel.hotelRoomType}</Text>
                </View>
                <View style={styles.hotelDetailCol}>
                  <Text style={styles.hotelDetailLabel}>Meal Plan:</Text>
                  <Text style={styles.hotelDetailValue}>{hotel.hotelMealPlan}</Text>
                </View>
                <View style={styles.hotelDetailCol}>
                  <Text style={styles.hotelDetailLabel}>Check-in:</Text>
                  <Text style={styles.hotelDetailValue}>{hotelCheckInFormatted}</Text>
                </View>
                <View style={styles.hotelDetailCol}>
                  <Text style={styles.hotelDetailLabel}>Check-out:</Text>
                  <Text style={styles.hotelDetailValue}>{hotelCheckOutFormatted}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Footer with Columns Layout (GSTIN removed) */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.footerLogo} />
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>OUR ACHIEVEMENTS</Text>
            <Text style={styles.footerColText}>Estd: 2022</Text>
            <Text style={styles.footerColText}>Govt Approved Tour Operator</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>LEGAL INFO</Text>
            <Text style={styles.footerColText}>Approved by Ministry of Tourism</Text>
            <Text style={styles.footerColText}>Government of India</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>TOUR ADVISOR</Text>
            <Text style={styles.footerColText}>VISHAL CHAUHAN (DARJI)</Text>
            <Text style={styles.footerColText}>Ph: 9328151481</Text>
            <Text style={styles.footerColText}>mahadevholidays2000@gmail.com</Text>
          </View>
          <Text style={styles.pageBadge} render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
        </View>
      </Page>

      {/* DETAILED DAILY TIMELINE (ONE PAGE PER DAY) */}
      {(data.itinerary || []).map((item, idx) => (
        <Page key={idx} size="A4" style={styles.page}>
          <View style={styles.header} fixed>
            <View style={styles.headerMain}>
              <Image src={getAssetUrl("/logo.jpg")} style={styles.logo} />
            </View>
          </View>

          <Text style={styles.sectionHeader}>Tour Itinerary Details (Day {item.day})</Text>

          <View style={styles.itineraryBlock}>
            <View style={styles.itineraryDayCard}>
              <View style={styles.itineraryDayHeader}>
                <Text style={styles.itineraryDayTitle}>Day {item.day}: {item.title}</Text>
                {item.stay && <Text style={styles.itineraryDayStay}>Stay: {item.stay}</Text>}
              </View>
              {/* Daily big photo block */}
              <Image src={item.image || getDayImage(item.day)} style={styles.itineraryBigImage} />
              <Text style={styles.itineraryDayDesc}>{item.description}</Text>
              
              <View style={styles.itineraryMetaRow}>
                {item.mealPlan && <Text style={styles.itineraryDayMeal}>Meals: {item.mealPlan}</Text>}
                <Text style={styles.itineraryBadgeGreen}>
                  {getDayItineraryTransferText(item, data)}
                </Text>
              </View>
            </View>
          </View>

          {/* Footer with Columns Layout (GSTIN removed) */}
          <View style={styles.footer} fixed>
            <View style={styles.footerLeft}>
              <Image src={getAssetUrl("/logo.jpg")} style={styles.footerLogo} />
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>OUR ACHIEVEMENTS</Text>
              <Text style={styles.footerColText}>Estd: 2022</Text>
              <Text style={styles.footerColText}>Govt Approved Tour Operator</Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>LEGAL INFO</Text>
              <Text style={styles.footerColText}>Approved by Ministry of Tourism</Text>
              <Text style={styles.footerColText}>Government of India</Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>TOUR ADVISOR</Text>
              <Text style={styles.footerColText}>VISHAL CHAUHAN (DARJI)</Text>
              <Text style={styles.footerColText}>Ph: 9328151481</Text>
              <Text style={styles.footerColText}>mahadevholidays2000@gmail.com</Text>
            </View>
            <Text style={styles.pageBadge} render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
          </View>
        </Page>
      ))}

      {/* PAGE 5: TERMS & POLICIES (INCLUSIONS, EXCLUSIONS, PAYMENTS, CANCELLATIONS) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerMain}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.logo} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Terms & policies</Text>

        <View style={styles.policiesContainer}>
          <View style={styles.policiesGrid}>
            {/* Inclusions */}
            <View style={styles.policyColumnInclusions}>
              <Text style={{ ...styles.policyTitle, color: colors.success }}>Inclusions</Text>
              {(data.inclusions || []).map((item, idx) => (
                <View key={idx} style={styles.policyItem}>
                  <View style={styles.policyBulletWrapper}>
                    <VectorCheck size={12} />
                  </View>
                  <Text style={styles.policyText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Exclusions */}
            <View style={styles.policyColumnExclusions}>
              <Text style={{ ...styles.policyTitle, color: colors.error }}>Exclusions</Text>
              {(data.exclusions || []).map((item, idx) => (
                <View key={idx} style={styles.policyItem}>
                  <View style={styles.policyBulletWrapper}>
                    <VectorCross size={12} />
                  </View>
                  <Text style={styles.policyText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Payment & Booking Terms Grid */}
          <View style={styles.policiesGrid}>
            {/* Booking & Payment Policies */}
            <View style={styles.policyCardBlockPayment}>
              <Text style={styles.policyTitlePayment}>Payment Policies</Text>
              {(data.paymentPolicies || []).map((item, idx) => (
                <View key={idx} style={styles.policyItem}>
                  <View style={styles.policyBulletWrapper}>
                    <VectorCheck size={10} />
                  </View>
                  <Text style={styles.policyText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Cancellation Policies */}
            <View style={styles.policyCardBlockCancellation}>
              <Text style={styles.policyTitleCancellation}>Cancellation Policies</Text>
              {(data.cancellationPolicies || []).map((item, idx) => (
                <View key={idx} style={styles.policyItem}>
                  <View style={styles.policyBulletWrapper}>
                    <VectorCross size={10} />
                  </View>
                  <Text style={styles.policyText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Abbreviations */}
        <View style={{ ...styles.abbrevBox, marginTop: 15 }}>
          <Text style={styles.abbrevTitle}>ABBREVIATIONS & PLAN CODES</Text>
          <Text style={styles.abbrevText}>
            EBA: Extra Bed Adult | CWB: Extra Bed Child | CNB: Child sharing Bed | SGL: Single Occupancy{"\n"}
            EP: Room Only (No Meals) | CP: Breakfast Only | MAP: Breakfast + Dinner | AP: Breakfast + Lunch + Dinner
          </Text>
        </View>

        {/* Footer with Columns Layout (GSTIN removed) */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.footerLogo} />
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>OUR ACHIEVEMENTS</Text>
            <Text style={styles.footerColText}>Estd: 2022</Text>
            <Text style={styles.footerColText}>Govt Approved Tour Operator</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>LEGAL INFO</Text>
            <Text style={styles.footerColText}>Approved by Ministry of Tourism</Text>
            <Text style={styles.footerColText}>Government of India</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>TOUR ADVISOR</Text>
            <Text style={styles.footerColText}>VISHAL CHAUHAN (DARJI)</Text>
            <Text style={styles.footerColText}>Ph: 9328151481</Text>
            <Text style={styles.footerColText}>mahadevholidays2000@gmail.com</Text>
          </View>
          <Text style={styles.pageBadge} render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
        </View>
      </Page>

      {/* PAGE 6: BANK DETAILS, WORK PROFILE & THANK YOU */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerMain}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.logo} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>Account & booking information</Text>

        {/* Bank Account Info Card */}
        <View style={styles.bankCard}>
          <Text style={styles.bankTitle}>CURRENT ACCOUNT DETAILS</Text>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Bank Name:</Text>
            <Text style={styles.bankValue}>Indusind Bank</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Number:</Text>
            <Text style={styles.bankValue}>259328151481</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>IFSC Code:</Text>
            <Text style={styles.bankValue}>INDB0001669</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Name:</Text>
            <Text style={styles.bankValue}>Mahadev Online</Text>
          </View>
          <View style={{ ...styles.bankRow, borderBottomWidth: 0 }}>
            <Text style={styles.bankLabel}>UPI / GooglePay / PhonePe:</Text>
            <Text style={{ ...styles.bankValue, color: colors.secondary }}>
              9664545613 | 9328151481
            </Text>
          </View>
        </View>

        {/* Brand Work Profile Section */}
        <View style={styles.brandProfileCard}>
          <Text style={styles.brandProfileHeadline}>Mahadev Holidays,</Text>
          <Text style={styles.brandProfileGovt}>Approved by the Ministry of Tourism Government of India.</Text>
          <Text style={styles.brandProfileAddr}>Shop.no-26, Above Alex Tailor, Bus Station Road, Gurunanak Chowk, Palanpur, B.K, Guj (385001)</Text>
          
          <View style={styles.brandDetailsDivider} />
          
          <Text style={styles.brandListLabel}>SERVICES OFFERED :</Text>
          <Text style={styles.brandListItems}>
            FLIGHT TICKETS | HOTEL BOOKING | RAIL TICKET | BUS BOOKING | CAB BOOKING | HOLIDAY PACKAGES | HONEYMOON PACKAGES | FAMILY PACKAGES | ADVENTURE TOURS | WILDLIFE TOURS | CORPORATE TOURS | GROUP TOURS | HERITAGE & CULTURE TOURS | TREKKING PACKAGES
          </Text>

          <Text style={{ ...styles.brandListLabel, marginTop: 4 }}>DESTINATIONS COVERED :</Text>
          <Text style={styles.brandListItems}>
            HIMACHAL | SPITI VALLEY | UTTRAKHAND | LADAKH | KASHMIR | NORTH EAST INDIA | RAJASTHAN | KERALA | GOA | BHUTAN | NEPAL | SRI LANKA | GUJARAT
          </Text>
        </View>

        {/* Thank You section */}
        <View style={styles.thankYouBlock}>
          <Text style={styles.thankYouTitle}>THANK YOU</Text>
          <Text style={styles.thankYouSub}>MAHADEV ONLINE AND HOLIDAYS</Text>
          
          <View style={styles.thankYouLinksRow}>
            <Link src="https://share.google/uKI9joTM9gh5KYzWR" style={styles.mapsLink}>
              View Location on Google Maps
            </Link>
            <Text style={{ fontSize: 9.5, color: colors.textMuted }}>|</Text>
            <Link src="https://wa.me/919328151481" style={styles.whatsappLink}>
              Chat on WhatsApp (9328151481)
            </Link>
          </View>
        </View>

        {/* Tour Advisor Details Card on Last Page */}
        <View style={{ marginTop: 10, padding: 10, backgroundColor: colors.accentLight, borderWidth: 1.5, borderColor: colors.accent, borderRadius: 6, alignItems: "center" }}>
          <Text style={{ fontSize: 9.5, fontWeight: "bold", color: colors.primary, marginBottom: 3, letterSpacing: 0.5 }}>
            YOUR TOUR ADVISOR
          </Text>
          <Text style={{ fontSize: 10.5, fontWeight: "bold", color: colors.secondary, marginBottom: 2 }}>
            VISHAL CHAUHAN (DARJI)
          </Text>
          <Text style={{ fontSize: 9, color: colors.primary, fontWeight: "bold" }}>
            Phone: +91 9328151481   |   Email: mahadevholidays2000@gmail.com
          </Text>
        </View>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Image src={getAssetUrl("/logo.jpg")} style={{ height: 50, width: "auto" }} />
        </View>

        {/* Footer with Columns Layout (GSTIN removed) */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Image src={getAssetUrl("/logo.jpg")} style={styles.footerLogo} />
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>OUR ACHIEVEMENTS</Text>
            <Text style={styles.footerColText}>Estd: 2022</Text>
            <Text style={styles.footerColText}>Govt Approved Tour Operator</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>LEGAL INFO</Text>
            <Text style={styles.footerColText}>Approved by Ministry of Tourism</Text>
            <Text style={styles.footerColText}>Government of India</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerColTitle}>TOUR ADVISOR</Text>
            <Text style={styles.footerColText}>VISHAL CHAUHAN (DARJI)</Text>
            <Text style={styles.footerColText}>Ph: 9328151481</Text>
            <Text style={styles.footerColText}>mahadevholidays2000@gmail.com</Text>
          </View>
          <Text style={styles.pageBadge} render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
