import { DashBoardSideBarMenuInterface } from "@/lib/type";

export const adminDashBoardSidebarLinks: DashBoardSideBarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: "dashboard",
    link: "/dashboard/admin",
  },
  {
    label: "Stores",
    icon: "store",
    link: "/dashboard/admin/stores",
  },
  {
    label: "Orders",
    icon: "box-list",
    link: "/dashboard/admin/orders",
  },
  {
    label: "Categories",
    icon: "categories",
    link: "/dashboard/admin/categories",
  },
  {
    label: "Sub-Categories",
    icon: "categories",
    link: "/dashboard/admin/subcategories",
  },
  {
    label: "Coupons",
    icon: "coupon",
    link: "/dashboard/admin/coupons",
  },
];
