import { AppIcon } from "@/components/store/icons";
import Link from "next/link";
import PlayStoreImg from "@/public/assets/icons/google-play.webp";
import AppStoreImg from "@/public/assets/icons/app-store.webp";
import Image from "next/image";

const DownloadApp = () => {
  return (
    <div className="relative group">
      {/* Trigger */}
      <div className="flex h-11 items-center px-2 cursor-pointer">
        <span className="text-[32px] inline-block">
          <AppIcon />
        </span>
        <div className="ml-2">
          <b className="max-w-[90px] inline-block font-medium text-xs text-white leading-4">
            Download the GoShop App
          </b>
        </div>
      </div>

      {/* Content */}
      <div className="hidden absolute top-full right-0 mt-0 group-hover:block z-50">
        {/* Triangle */}
        <div className="absolute -top-2 right-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white" />

        {/* Dropdown box */}
        <div className="w-[340px] rounded-3xl bg-white shadow-lg p-5 text-main-primary">
          <h3 className="font-bold text-[18px] text-center text-cyan-900">
            Download the GoShop App
          </h3>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="#"
              className="rounded-2xl bg-black grid place-items-center px-4 py-3"
            >
              <Image src={AppStoreImg} alt="App Store" />
            </Link>

            <Link
              href="#"
              className="rounded-2xl bg-black grid place-items-center px-4 py-3"
            >
              <Image src={PlayStoreImg} alt="Play Store" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
