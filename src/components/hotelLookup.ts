import { HotelItem } from "./PackageForm";

// Helper to create a library hotel item quickly
const createLibHotel = (name: string, rating: string, roomType = "Standard Room", mealPlan = "Breakfast Only (CP)"): HotelItem => ({
  id: `prefilled-${name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`,
  hotelName: name,
  hotelStar: rating,
  hotelRoomType: roomType,
  hotelMealPlan: mealPlan,
  hotelCheckIn: "",
  hotelCheckOut: "",
  hotelImage: "",
});

const prefilledDatabases: Record<string, HotelItem[]> = {
  goa: [
    // 5-Star
    createLibHotel("Taj Exotica Resort & Spa, Goa", "5 Star (Super Luxury)", "Premium Room"),
    createLibHotel("The Leela Goa", "5 Star (Super Luxury)", "Garden Suite"),
    createLibHotel("W Goa", "5 Star (Super Luxury)", "Wonderful Room"),
    createLibHotel("ITC Grand Goa, A Luxury Collection Resort & Spa", "5 Star (Super Luxury)", "Premium Room"),
    createLibHotel("Taj Fort Aguada Resort & Spa", "5 Star (Super Luxury)", "Superior Room Garden View"),
    createLibHotel("The Lalit Golf & Spa Resort", "5 Star (Super Luxury)", "Suite"),
    createLibHotel("Radisson Blu Resort Goa Cavelossim Beach", "5 Star (Super Luxury)", "Superior Room"),
    createLibHotel("Grand Hyatt Goa", "5 Star (Super Luxury)", "Standard Room"),
    // 4-Star
    createLibHotel("Pride Sun Village Resort & Spa", "4 Star (Luxury)", "Standard Suite"),
    createLibHotel("Alcove Resorts (Vagator)", "4 Star (Luxury)", "Standard Room"),
    createLibHotel("Santana Beach Resort", "4 Star (Luxury)", "Standard Deluxe Room"),
    createLibHotel("Fairfield by Marriott Goa Benaulim", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Lemon Tree Amarante Beach Resort, Goa", "4 Star (Luxury)", "Superior Room"),
    // Villas & Stays
    createLibHotel("Villa In Palms by Vianaar", "5 Star (Super Luxury)", "Luxury Private Villa"),
    createLibHotel("Isprava Villas", "5 Star (Super Luxury)", "Exclusive Private Pool Villa"),
    createLibHotel("StayVista Private Pool Villas", "5 Star (Super Luxury)", "Luxury Private Pool Villa"),
    createLibHotel("Lohono Stays Villas", "5 Star (Super Luxury)", "Luxury Private Pool Villa"),
    createLibHotel("Moustache Goa Luxuria", "4 Star (Luxury)", "Premium Cottage Stay"),
    // 3-Star / Budget
    createLibHotel("Beira Mar Alvorada (Colva)", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Sea Horse Resort (Baga)", "3 Star (Deluxe)", "Standard Deluxe Room"),
    createLibHotel("Nazri Resort (Baga)", "3 Star (Deluxe)", "Deluxe Room Pool View"),
    createLibHotel("Ocean Palms Goa (Calangute)", "3 Star (Deluxe)", "Palm Deluxe Room"),
    createLibHotel("Hotel Riverside (Baga)", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Aldeia Santa Rita", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Alvorada Beach Resort", "3 Star (Deluxe)", "Standard Room"),
  ],
  kerala: [
    // Cochin
    createLibHotel("Taj Malabar Resort & Spa [Cochin]", "5 Star (Super Luxury)", "Superior Room"),
    createLibHotel("Ramada by Wyndham Kochi [Cochin]", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Vivanta Ernakulam, Marine Drive [Cochin]", "5 Star (Super Luxury)", "Superior Room"),
    createLibHotel("Grand Hyatt Kochi Bolgatty [Cochin]", "5 Star (Super Luxury)", "Grand King Room"),
    createLibHotel("Kochi Marriott Hotel [Cochin]", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Le Méridien Kochi [Cochin]", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Radisson Blu Hotel, Kochi [Cochin]", "5 Star (Super Luxury)", "Superior Room"),
    createLibHotel("The Gateway Hotel Marine Drive Ernakulam [Cochin]", "5 Star (Super Luxury)", "Standard Room"),
    createLibHotel("Casino Hotel - CGH Earth [Cochin]", "4 Star (Luxury)", "Standard Room"),
    createLibHotel("Fragrant Nature Kochi [Cochin]", "4 Star (Luxury)", "Boutique Deluxe Room"),
    createLibHotel("Holiday Inn Cochin [Cochin]", "4 Star (Luxury)", "Superior Room"),
    createLibHotel("Keys Select by Lemon Tree Hotels, Kochi [Cochin]", "4 Star (Luxury)", "Standard Room"),
    createLibHotel("Hotel International [Cochin]", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Treebo Trend Sreepathi Scion [Cochin]", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Hotel Mermaid Kochi [Cochin]", "Budget / Standard", "Standard Room"),
    createLibHotel("Harbour View Residency [Cochin]", "Budget / Standard", "Budget Room"),

    // Munnar
    createLibHotel("Blanket Hotel & Spa [Munnar]", "5 Star (Super Luxury)", "Blanket Camellia Room"),
    createLibHotel("Amber Dale Munnar [Munnar]", "5 Star (Super Luxury)", "Valley View Room"),
    createLibHotel("Elixir Hills Suites Resort & Spa [Munnar]", "5 Star (Super Luxury)", "Deluxe Suite"),
    createLibHotel("Chandys Windy Woods [Munnar]", "5 Star (Super Luxury)", "Windy Woods Deluxe"),
    createLibHotel("The Fog Munnar Resort & Spa [Munnar]", "5 Star (Super Luxury)", "Fog Villa Room"),
    createLibHotel("Panoramic Getaway Munnar [Munnar]", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Fragrant Nature Munnar [Munnar]", "5 Star (Super Luxury)", "Tropic Green Room"),
    createLibHotel("Hotel White House Munnar [Munnar]", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Munnar Tea Hills Resort [Munnar]", "4 Star (Luxury)", "Premium Cottage"),
    createLibHotel("Swiss County Munnar [Munnar]", "4 Star (Luxury)", "Swiss Regent Room"),
    createLibHotel("Tea Harvester Munnar [Munnar]", "4 Star (Luxury)", "Harvester Room"),
    createLibHotel("Rivulet Resort [Munnar]", "4 Star (Luxury)", "Cottage Stay"),
    createLibHotel("Westwood Riverside Garden Resort [Munnar]", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Blue Haze Resort [Munnar]", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Hotel Green Spaces [Munnar]", "Budget / Standard", "Standard Room"),
    createLibHotel("Bella Vista Resort [Munnar]", "Budget / Standard", "Standard Room"),

    // Thekkady
    createLibHotel("The Elephant Court [Thekkady]", "5 Star (Super Luxury)", "Patio Room"),
    createLibHotel("The Mountain Courtyard [Thekkady]", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("WGH Poetree Thekkady [Thekkady]", "5 Star (Super Luxury)", "Club Room"),
    createLibHotel("Greenwoods Resort [Thekkady]", "5 Star (Super Luxury)", "Aranya Room"),
    createLibHotel("Spice Village - CGH Earth [Thekkady]", "5 Star (Super Luxury)", "Spice Garden Cottage"),
    createLibHotel("Amaana Resort [Thekkady]", "5 Star (Super Luxury)", "Standard Room"),
    createLibHotel("Niraamaya Retreats Cardamom Club [Thekkady]", "4 Star (Luxury)", "Cardamom Club Cabin"),
    createLibHotel("Cardamom County by Xandari [Thekkady]", "4 Star (Luxury)", "Periyar Cottage"),
    createLibHotel("Shalimar Spice Garden [Thekkady]", "4 Star (Luxury)", "Elegant Room"),
    createLibHotel("Peppermint Tree Thekkady [Thekkady]", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("Forest Canopy Resort [Thekkady]", "4 Star (Luxury)", "Tulip Cabin View"),
    createLibHotel("Abad Green Forest [Thekkady]", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Hotel Tree Top [Thekkady]", "3 Star (Deluxe)", "Standard Deluxe"),
    createLibHotel("Periyar Meadows Leisure Hotel [Thekkady]", "Budget / Standard", "Standard Room"),
    createLibHotel("Jungle View Homestay [Thekkady]", "Budget / Standard", "Standard Room"),

    // Alleppey
    createLibHotel("Sterling Lake Palace Alleppey [Alleppey]", "5 Star (Super Luxury)", "Lake View Cottage"),
    createLibHotel("Uday Backwater Resort [Alleppey]", "5 Star (Super Luxury)", "Lake View Deluxe"),
    createLibHotel("Kumarakom Lake Resort [Alleppey]", "5 Star (Super Luxury)", "Luxury Pavilion Room"),
    createLibHotel("The Zuri Kumarakom [Alleppey]", "5 Star (Super Luxury)", "Zuri Deluxe Room"),
    createLibHotel("Vasundhara Sarovar Premiere [Alleppey]", "5 Star (Super Luxury)", "Superior Room"),
    createLibHotel("Ramada by Wyndham Alleppey [Alleppey]", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Lake Canopy [Alleppey]", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("Punnamada Resort [Alleppey]", "4 Star (Luxury)", "Lake View Villa"),
    createLibHotel("Lemon Tree Vembanad Lake Resort [Alleppey]", "4 Star (Luxury)", "Superior Room"),
    createLibHotel("Deshadan Backwater Resort [Alleppey]", "4 Star (Luxury)", "Pavilion Room"),
    createLibHotel("Kondai Lip Backwater Resort [Alleppey]", "4 Star (Luxury)", "Heritage Cottage"),
    createLibHotel("Pagoda Resorts [Alleppey]", "3 Star (Deluxe)", "Standard Cottage"),
    createLibHotel("Alleppey Beach Resort [Alleppey]", "3 Star (Deluxe)", "Sea View Room"),
    createLibHotel("Hotel Arcadia Oasis [Alleppey]", "Budget / Standard", "Standard Room"),
    createLibHotel("Malayalam Lake Resort [Alleppey]", "Budget / Standard", "Budget Cottage"),
  ],
  nainital: [
    // 5 Star
    createLibHotel("The Manu Maharani", "5 Star (Super Luxury)", "Premium Room"),
    createLibHotel("The Naini Retreat, Nainital", "5 Star (Super Luxury)", "Duplex Room"),
    createLibHotel("Shervani Hilltop Resort", "5 Star (Super Luxury)", "Garden Room"),
    createLibHotel("Welcomeheritage Ashdale", "5 Star (Super Luxury)", "Heritage Room"),
    // 4 Star
    createLibHotel("Swiss Hotel and Spa Nainital", "4 Star (Luxury)", "Executive Room"),
    createLibHotel("Alka The Lake Side Hotel", "4 Star (Luxury)", "Lake View Room"),
    createLibHotel("Balrampur House", "4 Star (Luxury)", "Superior Room"),
    createLibHotel("The Pavilion Hotel", "4 Star (Luxury)", "Deluxe Suite"),
    createLibHotel("Vikram Vintage Inn", "4 Star (Luxury)", "Vintage Room"),
    createLibHotel("Elphinstone Hotel", "4 Star (Luxury)", "Standard Deluxe"),
    createLibHotel("The Earl's Court by Leisure Hotels", "4 Star (Luxury)", "Superior Room"),
    // 3 Star
    createLibHotel("Hotel Silverton, By Aspen", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("The Tower Hotel", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Hotel Lake View Nainital", "3 Star (Deluxe)", "Standard Lake View"),
    createLibHotel("Classic The Mall", "3 Star (Deluxe)", "Mall View Room"),
    createLibHotel("Hotel Krishna, The Mall", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Dynasty Resort", "3 Star (Deluxe)", "Executive Lake View"),
    createLibHotel("Hotel Pratap Regency", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("The Corbett Hideaway", "3 Star (Deluxe)", "Garden Cottage"),
    // 2 Star
    createLibHotel("Hotel Lake And Woods", "Budget / Standard", "Budget Room"),
    createLibHotel("Hotel H. K. Legacy", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Green Islet", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Evelyn", "Budget / Standard", "Budget Room"),
    createLibHotel("Hotel Himalaya", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel City Heart", "Budget / Standard", "Budget Room"),
  ],
  srinagar: [
    // 5 Star
    createLibHotel("The Lalit Grand Palace Srinagar", "5 Star (Super Luxury)", "Palace Deluxe Room"),
    createLibHotel("Taj Mahal Palace, Srinagar (Vivanta Dal View)", "5 Star (Super Luxury)", "Superior Lake View"),
    createLibHotel("The Khyber Himalayan Resort & Spa (City Booking Office)", "5 Star (Super Luxury)", "Premier Pine View"),
    // 4 Star
    createLibHotel("Hotel Asian Park", "4 Star (Luxury)", "Executive Room"),
    createLibHotel("Apple Orchard Resort & Spa", "4 Star (Luxury)", "Deluxe Orchard Room"),
    createLibHotel("Fortune Resort Heevan, Srinagar", "4 Star (Luxury)", "Club Room"),
    createLibHotel("Lemon Tree Hotel, Srinagar", "4 Star (Luxury)", "Superior Room"),
    // 3 Star
    createLibHotel("Crown Plaza Residency Srinagar", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Hotel Royal Heritage", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Zostel Srinagar", "3 Star (Deluxe)", "Standard Room / Dorm"),
    createLibHotel("Hotel Heevan Srinagar", "3 Star (Deluxe)", "Deluxe Room"),
    // 2 Star
    createLibHotel("Hotel Standard", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Green Amber", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Boulevard", "Budget / Standard", "Boulevard Facing Room"),
  ],
  gulmarg: [
    // 5 Star
    createLibHotel("The Khyber Himalayan Resort & Spa", "5 Star (Super Luxury)", "Premier Pine View"),
    createLibHotel("The Vintage Gulmarg", "5 Star (Super Luxury)", "Vintage Room"),
    // 4 Star
    createLibHotel("Shaw Inn by Stay Pattern", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Hotel Marina by Stay Pattern", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Grand Mumtaz Resorts Gulmarg", "4 Star (Luxury)", "Executive Room"),
    // 3 Star
    createLibHotel("Welcome Hotel Gulmarg", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Hotel Gulmarg House", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Pine View Resort", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Hotel Snow Glory", "3 Star (Deluxe)", "Deluxe Room"),
    // 2 Star
    createLibHotel("Hotel Royal Park", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Green Top", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Alpine Ridge", "Budget / Standard", "Standard Room"),
  ],
  pahalgam: [
    // 5 Star
    createLibHotel("The Grand Mumtaz Resorts Pahalgam", "5 Star (Super Luxury)", "Executive Suite"),
    createLibHotel("Welcomhotel by ITC Hotels, Pine & Peak", "5 Star (Super Luxury)", "Superior Room"),
    // 4 Star
    createLibHotel("Hotel Heevan Pahalgam", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("Pahalgam Hotel", "4 Star (Luxury)", "Standard Room"),
    createLibHotel("Hotel Senator Pine-N-Peak", "4 Star (Luxury)", "Superior Room"),
    // 3 Star
    createLibHotel("Hotel Fifth Season - Pahalgam", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Hotel Baisaran Pahalgam", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Pahalgam Resorts", "3 Star (Deluxe)", "Premium Cottage"),
    createLibHotel("Hotel Outlook", "3 Star (Deluxe)", "Outlook View Room"),
    createLibHotel("Hotel Himalaya Discover Resort", "3 Star (Deluxe)", "Deluxe Room"),
    // 2 Star
    createLibHotel("Hotel Mountview", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Brown Palace", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Hilltop", "Budget / Standard", "Standard Room"),
  ],
  sonamarg: [
    // 5 Star
    createLibHotel("The Villa Himalaya", "5 Star (Super Luxury)", "River View Deluxe"),
    createLibHotel("Hotel Rah Villas", "5 Star (Super Luxury)", "Pine View Deluxe"),
    // 4 Star
    createLibHotel("Radisson Hotel Sonamarg", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("Hotel Glacier Heights", "4 Star (Luxury)", "Executive Room"),
    createLibHotel("Ahsan Mount Resort", "4 Star (Luxury)", "Luxury Glamping Tent"),
    // 3 Star
    createLibHotel("Hotel Mughal India, Sonmarg", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Hotel Czara Resort Sonmarg", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Imperial Resorts", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Namrose Resorts", "3 Star (Deluxe)", "River View Room"),
    createLibHotel("Hotel Snowland Sonamarg", "3 Star (Deluxe)", "Premium Room"),
    // 2 Star
    createLibHotel("Hotel Soneet", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Hill View", "Budget / Standard", "Standard Room"),
    createLibHotel("Hotel Mountain View", "Budget / Standard", "Budget Room"),
  ],
  ladakh: [
    // 5 Star
    createLibHotel("The Grand Dragon Ladakh", "5 Star (Super Luxury)", "Premier Mountain View"),
    createLibHotel("The Zen Ladakh", "5 Star (Super Luxury)", "Zen Premium Room"),
    createLibHotel("Stok Palace Heritage Hotel", "5 Star (Super Luxury)", "Heritage Suite"),
    // 4 Star
    createLibHotel("Hotel Singge Palace", "4 Star (Luxury)", "Executive Room"),
    createLibHotel("Hotel Lasermo", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("The Indus Valley", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Gomang Boutique Hotel", "4 Star (Luxury)", "Boutique Suite"),
    // 3 Star
    createLibHotel("Hotel City Palace", "3 Star (Deluxe)", "Standard Deluxe"),
    createLibHotel("Hotel Omasila", "3 Star (Deluxe)", "Standard Deluxe"),
    createLibHotel("Hotel Caravan Centre", "3 Star (Deluxe)", "Standard Deluxe"),
    createLibHotel("Spic n Span", "3 Star (Deluxe)", "Deluxe Room"),
  ],
  jaisalmer: [
    // 5 Star
    createLibHotel("Suryagarh Jaisalmer", "5 Star (Super Luxury)", "Fort Room"),
    createLibHotel("Jaisalmer Marriott Resort & Spa", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Taj Gorbandh Palace", "5 Star (Super Luxury)", "Heritage Room"),
    createLibHotel("Fort Rajwada", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("SUJÁN The Serai", "5 Star (Super Luxury)", "Luxury Tent & Camp"),
    createLibHotel("Karwaan Resort", "5 Star (Super Luxury)", "Luxury Resort & Tents"),
    // 4 Star
    createLibHotel("Desert Heritage Camp and Resort", "4 Star (Luxury)", "Premium Desert Camp"),
    createLibHotel("Desert Valley Resort", "4 Star (Luxury)", "Premium Resort & Camp"),
    createLibHotel("WelcomHeritage Mandir Palace", "4 Star (Luxury)", "Heritage Hotel Room"),
    createLibHotel("SKK The Fern, Jaisalmer", "4 Star (Luxury)", "Premium Room"),
    createLibHotel("Rupal Residency", "4 Star (Luxury)", "Boutique Room"),
    createLibHotel("Le Royal Camps", "4 Star (Luxury)", "Premium Desert Tents"),
    createLibHotel("Highness Desert Camp", "4 Star (Luxury)", "Premium Camp & Resort"),
    // 3 Star
    createLibHotel("Chokhi Dhani - The Palace Hotel", "3 Star (Deluxe)", "Ethnic Theme Cottage"),
    createLibHotel("Sterling Rudraksh Jaisalmer", "3 Star (Deluxe)", "Comfort Room"),
  ],
  haridwar: [
    // 5 Star
    createLibHotel("Hari Ganga Niwas (IHCL SeleQtions)", "5 Star (Super Luxury)", "Luxury Room"),
    createLibHotel("Radisson Blu Hotel Haridwar", "5 Star (Super Luxury)", "Premium Room"),
    createLibHotel("Amatra By the Ganges", "5 Star (Super Luxury)", "Luxury Resort Villa"),
    // 4 Star
    createLibHotel("Fortune Park, Haridwar", "4 Star (Luxury)", "Club Room"),
    createLibHotel("Godwin Haridwar", "4 Star (Luxury)", "Executive Room"),
    createLibHotel("Ambrosia Sarovar Portico", "4 Star (Luxury)", "Superior Room"),
    // 3 Star
    createLibHotel("Ganga Lahari", "3 Star (Deluxe)", "Ganga View Room"),
    createLibHotel("Renest Haridwar", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("The Haveli Hari Ganga", "3 Star (Deluxe)", "Heritage Hotel Room"),
    createLibHotel("Hotel Alpana", "3 Star (Deluxe)", "Standard Room"),
    // Ashrams & Dharamshalas
    createLibHotel("Parmarth Ashram", "Resort Stay", "Spiritual Ashram Stay"),
    createLibHotel("Shantikunj Gayatri Parivar", "Resort Stay", "Ashram Room"),
    createLibHotel("Saptarishi Ashram", "Resort Stay", "Ashram Room"),
    createLibHotel("Jai Ram Ashram", "Resort Stay", "Ashram Room"),
    createLibHotel("Bharat Seva Ashram Sangha", "Resort Stay", "Spiritual Ashram Stay"),
    createLibHotel("Paniwala Babaji Ashram", "Resort Stay", "Spiritual Ashram Stay"),
    createLibHotel("Bholagiri Ashram", "Resort Stay", "Spiritual Ashram Stay"),
    createLibHotel("Kankhal Ashram (Ma Anandamayi)", "Resort Stay", "Ashram Stay"),
    createLibHotel("Geeta Kutir Ashram", "Resort Stay", "Ashram Stay"),
    createLibHotel("Kalyan Kalyan Ashram", "Resort Stay", "Ashram Stay"),
    createLibHotel("Pawan Dham Dharamshala", "Budget / Standard", "Dharamshala Room"),
    createLibHotel("Nishkam Chetna Mishra Dharamshala", "Budget / Standard", "Dharamshala Room"),
    createLibHotel("Kutch Lalrameshwar Dharamshala", "Budget / Standard", "Dharamshala Room"),
    createLibHotel("Shri Saryu Das Digambar Dharamshala", "Budget / Standard", "Dharamshala Room"),
    createLibHotel("Manav Kalyan Ashram & Dharamshala", "Budget / Standard", "Dharamshala Room"),
  ],
  yamunotri: [
    createLibHotel("The Char Dham Camp (Barkot)", "3 Star (Deluxe)", "Luxury Tent"),
    createLibHotel("Hotel Necklace Moon (Barkot)", "3 Star (Deluxe)", "Premium Room"),
    createLibHotel("Yamunotri Cottages (Janki Chatti)", "3 Star (Deluxe)", "Deluxe Cottage"),
    createLibHotel("Hotel Atithi Niwas (Barkot)", "Budget / Standard", "Standard Room"),
  ],
  gangotri: [
    createLibHotel("The Char Dham Camp (Harsil)", "3 Star (Deluxe)", "Luxury Tent"),
    createLibHotel("Awana Cottages (Harsil)", "3 Star (Deluxe)", "Premium Room"),
    createLibHotel("Prakriti Retreat (Harsil)", "3 Star (Deluxe)", "Premium Room"),
    createLibHotel("Hotel Shikhar Nature Resort (Uttarkashi)", "Budget / Standard", "Deluxe Cottage"),
  ],
  kedarnath: [
    createLibHotel("Shivalik Valley Resort (Sitapur)", "3 Star (Deluxe)", "Premium Room"),
    createLibHotel("The Char Dham Camp (Guptkashi)", "3 Star (Deluxe)", "Luxury Tent"),
    createLibHotel("Hotel Adiyogi (Sersi)", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("Kedar River Retreat (Guptkashi)", "Budget / Standard", "Standard Room"),
  ],
  badrinath: [
    createLibHotel("Sarovar Portico (Badrinath)", "3 Star (Deluxe)", "Luxury Room"),
    createLibHotel("The Char Dham Camp (Joshimath)", "3 Star (Deluxe)", "Luxury Tent"),
    createLibHotel("Hotel Sapphire Valley", "3 Star (Deluxe)", "Standard Room"),
  ],
  nepal: [
    // 5 Star
    createLibHotel("The Soaltee Kathmandu", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Aloft Kathmandu Thamel", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Radisson Hotel Kathmandu", "5 Star (Super Luxury)", "Superior Room"),
    createLibHotel("The Everest Hotel", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("Kathmandu Marriott Hotel", "5 Star (Super Luxury)", "Deluxe Room"),
    createLibHotel("The Dwarika's Hotel", "5 Star (Super Luxury)", "Luxury Heritage Room"),
    createLibHotel("Pokhara Grande Hotel", "5 Star (Super Luxury)", "Grande Deluxe Room"),
    createLibHotel("Sarangkot Mountain Lodge", "5 Star (Super Luxury)", "Lodge Room"),
    createLibHotel("Mountain Glory Forest Resort", "5 Star (Super Luxury)", "Forest View Room"),
    createLibHotel("Bar Peepal Resort", "5 Star (Super Luxury)", "Resort Room"),
    // 4 Star
    createLibHotel("Hotel Mulberry", "4 Star (Luxury)", "Executive Room"),
    createLibHotel("Aranya Boutique Hotel", "4 Star (Luxury)", "Boutique Deluxe"),
    createLibHotel("Hotel Barahi Kathmandu", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("Temple Tree Resort & Spa", "4 Star (Luxury)", "Deluxe Room"),
    createLibHotel("Mount Kailash Resort", "4 Star (Luxury)", "Standard Deluxe"),
    // 3 Star
    createLibHotel("Hotel Tibet", "3 Star (Deluxe)", "Standard Room"),
    createLibHotel("Fairfield by Marriott Kathmandu", "3 Star (Deluxe)", "Deluxe Room"),
    createLibHotel("DOM Himalaya Hotel", "3 Star (Deluxe)", "Deluxe Room"),
  ],
};

// Main fetcher function
export function getPrepopulatedHotels(destinationName: string): HotelItem[] {
  const destLower = destinationName.toLowerCase();
  
  if (destLower.includes("goa")) return prefilledDatabases.goa;
  if (destLower.includes("kerala") || destLower.includes("cochin") || destLower.includes("kochi") || destLower.includes("munnar") || destLower.includes("thekkady") || destLower.includes("alleppey")) return prefilledDatabases.kerala;
  if (destLower.includes("nainital")) return prefilledDatabases.nainital;
  if (destLower.includes("srinagar")) return prefilledDatabases.srinagar;
  if (destLower.includes("gulmarg")) return prefilledDatabases.gulmarg;
  if (destLower.includes("pahalgam")) return prefilledDatabases.pahalgam;
  if (destLower.includes("sonamarg") || destLower.includes("sonmarg")) return prefilledDatabases.sonamarg;
  if (destLower.includes("ladakh") || destLower.includes("leh")) return prefilledDatabases.ladakh;
  if (destLower.includes("jaisalmer")) return prefilledDatabases.jaisalmer;
  if (destLower.includes("haridwar")) return prefilledDatabases.haridwar;
  if (destLower.includes("yamunotri")) return prefilledDatabases.yamunotri;
  if (destLower.includes("gangotri")) return prefilledDatabases.gangotri;
  if (destLower.includes("kedarnath")) return prefilledDatabases.kedarnath;
  if (destLower.includes("badrinath")) return prefilledDatabases.badrinath;
  if (destLower.includes("nepal") || destLower.includes("kathmandu") || destLower.includes("pokhara")) return prefilledDatabases.nepal;
  
  return [];
}
