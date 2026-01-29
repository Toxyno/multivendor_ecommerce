import { SendIcon } from "@/components/store/icons";

const NewsLetter = () => {
  return (
    <div className="bg-gradient-to-r from-slate-500 to-slate-800 p-5">
      {/* <div className="max-w-357.5 mx-auto"> */}
      <div className="flex flex-col gap-y-4 xl:flex-row items-center text-white ">
        {/* left */}
        <div className="flex items-center xl:w-[58%]">
          <h5 className="flex items-center gap-x-2">
            <div className="scale-125 mr-2">
              <SendIcon />
            </div>
            <span className="md:text-xl">Sign up to Newsletter</span>
            <span className="ml-10">
              ...and receive &nbsp; <b>$20 coupon for first shopping</b>
            </span>
          </h5>
        </div>
        {/* right */}
        <div className="w-full xl:flex-1">
          <div className="flex flex-nowrap overflow-hidden rounded-full bg-white ring-1 ring-slate-300">
            <input
              type="text"
              placeholder="Enter your email address"
              className="min-w-0 flex-1 h-10 px-6 text-black outline-none bg-transparent"
            />
            <span className="h-10 px-6 shrink-0 text-sm grid place-content-center bg-slate-600 text-white cursor-pointer">
              Sign Up
            </span>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default NewsLetter;
