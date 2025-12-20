import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <div className="w-100 flex justify-end">
        {/* Theme Toggle Button */}
        <UserButton />
        <ThemeToggle />
      </div>

      <h1 className="font-bold text-blue-800">
        Welcome to GoShop MultiVendor_Ecommerce
        <Button variant={"link"}>Click Me</Button>
      </h1>
    </div>
  );
}
