import { Briefcase, Truck, Home, Car, Tag, Users, Factory, Zap, Sofa, Smartphone, type LucideIcon } from "lucide-react";

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  key: string;
  icon: LucideIcon;
  color: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "jobs",
    key: "category.jobs",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    subcategories: [
      { id: "oil-gas", name: "Oil and Gas" },
      { id: "construction", name: "Construction" },
      { id: "engineering", name: "Engineering" },
      { id: "accounting-finance", name: "Accounting / Finance" },
      { id: "manufacturing", name: "Manufacturing" },
      { id: "logistics", name: "Logistics" },
      { id: "sales-biz-dev", name: "Sales / Business Development" },
    ],
  },
  {
    id: "heavy-equipment",
    key: "category.heavyEquipment",
    icon: Truck,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    subcategories: [
      { id: "trucks", name: "Trucks" },
      { id: "buses", name: "Buses" },
      { id: "trailers", name: "Trailers" },
      { id: "cranes", name: "Cranes" },
      { id: "forklifts", name: "Forklifts" },
      { id: "tankers", name: "Tankers" },
      { id: "parts-engines", name: "Parts & Engines" },
    ],
  },
  {
    id: "property",
    key: "category.property",
    icon: Home,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    subcategories: [
      { id: "rent-residential", name: "For Rent — Residential" },
      { id: "rent-commercial", name: "For Rent — Commercial" },
      { id: "rent-room-bedspace", name: "Private Room / Bedspace For Rent" },
      { id: "sale-residential", name: "For Sale — Residential" },
      { id: "sale-commercial", name: "For Sale — Commercial" },
      { id: "sale-new-projects", name: "New Projects" },
      { id: "sale-off-plan", name: "Off-Plan" },
    ],
  },
  {
    id: "motors",
    key: "category.motors",
    icon: Car,
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    subcategories: [
      { id: "used-cars", name: "Used Cars" },
      { id: "rental-cars", name: "Rental Cars" },
      { id: "new-cars", name: "New Cars" },
    ],
  },
  {
    id: "classifieds",
    key: "category.classifieds",
    icon: Tag,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    subcategories: [
      { id: "electronics", name: "Electronics" },
      { id: "computers-networking", name: "Computers & Networking" },
      { id: "clothing-accessories", name: "Clothing & Accessories" },
      { id: "jewelry-watches", name: "Jewelry & Watches" },
    ],
  },
  {
    id: "community",
    key: "category.community",
    icon: Users,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    subcategories: [
      { id: "freelancers", name: "Freelancers" },
      { id: "home-maintenance", name: "Home Maintenance" },
      { id: "other-services", name: "Other Services" },
      { id: "tutors-classes", name: "Tutors & Classes" },
    ],
  },
  {
    id: "business-industrial",
    key: "category.businessIndustrial",
    icon: Factory,
    color: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
    subcategories: [
      { id: "businesses-for-sale", name: "Businesses for Sale" },
      { id: "industrial-supplies", name: "Industrial Supplies" },
      { id: "construction-materials", name: "Construction Materials" },
      { id: "kitchen-equipment", name: "Kitchen Equipment" },
    ],
  },
  {
    id: "home-appliances",
    key: "category.homeAppliances",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    subcategories: [
      { id: "large-appliances", name: "Large Appliances / White Goods" },
      { id: "kitchen-appliances", name: "Kitchen Appliances" },
      { id: "outdoor-appliances", name: "Outdoor Appliances" },
      { id: "bathroom-appliances", name: "Bathroom Appliances" },
    ],
  },
  {
    id: "furniture-home-garden",
    key: "category.furnitureHomeGarden",
    icon: Sofa,
    color: "bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400",
    subcategories: [
      { id: "furniture", name: "Furniture" },
      { id: "home-accessories", name: "Home Accessories" },
      { id: "garden-outdoor", name: "Garden & Outdoor" },
      { id: "lighting-fans", name: "Lighting & Fans" },
    ],
  },
  {
    id: "mobiles-tablets-laptops",
    key: "category.mobilesTabletsLaptops",
    icon: Smartphone,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    subcategories: [
      { id: "mobile-phones", name: "Mobile Phones" },
      { id: "tablets", name: "Tablets" },
      { id: "mobile-accessories", name: "Mobile Phone & Tablet Accessories" },
      { id: "desktop-laptop", name: "Desktop and Laptop" },
    ],
  },
];

export const getCategoryById = (id: string) => categories.find(c => c.id === id);
export const getSubcategoryName = (catId: string, subId: string) => {
  const cat = getCategoryById(catId);
  return cat?.subcategories.find(s => s.id === subId)?.name || subId;
};
