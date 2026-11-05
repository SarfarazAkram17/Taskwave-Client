import {
  LuCode, LuPalette, LuPenLine, LuMegaphone, LuSmartphone,
  LuClapperboard, LuSearch, LuHeadset, LuPenTool, LuTable2,
} from "react-icons/lu";

export const CATEGORIES = [
  { name: "Web Development", icon: LuCode },
  { name: "Graphic Design", icon: LuPalette },
  { name: "Content Writing", icon: LuPenLine },
  { name: "Digital Marketing", icon: LuMegaphone },
  { name: "Mobile App Development", icon: LuSmartphone },
  { name: "Video Editing", icon: LuClapperboard },
  { name: "SEO Optimization", icon: LuSearch },
  { name: "Virtual Assistance", icon: LuHeadset },
  { name: "UI/UX Design", icon: LuPenTool },
  { name: "Data Entry", icon: LuTable2 },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

/** One source of truth for task status wording and colours. */
export const STATUS = {
  open: { label: "Open", badge: "badge-info", color: "var(--primary)", hint: "Accepting proposals" },
  in_progress: { label: "In progress", badge: "badge-warning", color: "var(--warning)", hint: "Freelancer is working" },
  in_review: { label: "In review", badge: "badge-violet", color: "var(--violet)", hint: "Waiting for client approval" },
  completed: { label: "Completed", badge: "badge-success", color: "var(--success)", hint: "Delivered and approved" },
  cancelled: { label: "Cancelled", badge: "", color: "var(--faint)", hint: "Closed without delivery" },
};

export const BID_STATUS = {
  pending: { label: "Pending", badge: "badge-warning" },
  accepted: { label: "Accepted", badge: "badge-success" },
  rejected: { label: "Not selected", badge: "" },
  withdrawn: { label: "Withdrawn", badge: "" },
};

export const ROLE_LABEL = { client: "Client", freelancer: "Freelancer", admin: "Admin" };

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "deadline", label: "Closest deadline" },
  { value: "budgetHigh", label: "Budget: high to low" },
  { value: "budgetLow", label: "Budget: low to high" },
  { value: "proposals", label: "Most proposals" },
];
