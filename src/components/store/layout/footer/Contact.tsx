import { Headset } from "lucide-react";
//import { SocialLogo } from "social-logos";
import { SocialIcon } from "react-social-icons";

const Contact = () => {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="space-y-2">
        <div className="flex items.center gap-x-6">
          <Headset className="scale-[190%] stroke-slate-400" />

          <div className="flex flex-col">
            <span className="text-[#59645f] text-sm">
              Got Questions? Call us 24/7!
            </span>
            <span className="text-lg font-bold text-black">+447733782181</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <b>Contact Info</b>
        <span className="text-sm text-[#59645f]">
          1234 Street Name, City, Country
        </span>

        <div className="flex flex-wrap gap-2 mt-4 justify-start items-center">
          {/* <SocialLogo icon="facebook" size={28} fill="#7C7C7C" /> */}
          <SocialIcon url="https://www.facebook.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.twitter.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.instagram.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.linkedin.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.youtube.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.pinterest.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.tiktok.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.snapchat.com/" bgColor="#7C7C7C" />
          <SocialIcon url="https://www.reddit.com/" bgColor="#7C7C7C" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
