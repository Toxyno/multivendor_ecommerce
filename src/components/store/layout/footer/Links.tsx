import { SubCategory } from "@/types/SubCategory";
import Link from "next/link";

const Links = ({ subcategories }: { subcategories: SubCategory[] }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
      {/* Subcategories */}
      <div className="space-y-4">
        <h1 className="text-lg font-bold ">Find it Fast</h1>
        <ul className="flex flex-col gap-y-1">
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>
              <Link href={`/browse?subCategory=${subcategory.id}`}>
                <span>{subcategory.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Profile Links */}
      <div className="space-y-4 md:mt-10">
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(0, 5).map((item) => (
            <li key={item.title}>
              <Link href={item.link}>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <h1 className="text-lg font-bold ">Customer Care</h1>
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(5).map((item) => (
            <li key={item.title}>
              <Link href={item.link}>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Customare Care */}
    </div>
  );
};

export default Links;

const footer_links = [
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Contact",
    link: "/contact",
  },
  {
    title: "Wishlist",
    link: "/profile/wishlist",
  },
  {
    title: "Compare",
    link: "/compare",
  },
  {
    title: "FAQ",
    link: "/faq",
  },
  {
    title: "Store Directory",
    link: "/profile",
  },
  {
    title: "My Account",
    link: "/profile",
  },
  {
    title: "Track your Order",
    link: "/track-order",
  },
  {
    title: "Customer Service",
    link: "/customer-service",
  },
  {
    title: "Returns/Exchange",
    link: "/returns-exchange",
  },
  {
    title: "FAQs",
    link: "/faqs",
  },
  {
    title: "Product Support",
    link: "/product-support",
  },
];
