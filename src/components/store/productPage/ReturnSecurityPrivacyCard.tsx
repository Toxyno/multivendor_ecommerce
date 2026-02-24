import { ShieldCheck, Undo } from "lucide-react";

type ReturnSecurityPrivacyCardProps = {
  returnPolicy: string;
};

const ReturnSecurityPrivacyCard = ({
  returnPolicy,
}: ReturnSecurityPrivacyCardProps) => {
  return (
    <div className="mt-2 space-y-2">
      <Returns returnPolicy={returnPolicy} />
      <SecurityPrivacyCard />
    </div>
  );
};

export default ReturnSecurityPrivacyCard;

export const Returns = ({ returnPolicy }: ReturnSecurityPrivacyCardProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <Undo className="w-4 ml-4" />
          <span className="text-sm font-bold flex items-center">
            Returns Policy
          </span>
        </div>
      </div>
      <div>
        <span className="text-xs  ml-5 text-[#979797] flex">
          {returnPolicy}
        </span>
      </div>
    </div>
  );
};

export const SecurityPrivacyCard = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <ShieldCheck className="w-4 ml-4" />
          <span className="text-sm font-bold flex items-center">
            Security & Privacy
          </span>
        </div>
      </div>
      <p className="text-xs text-[#979797] ml-5 flex gap-x-1">
        Safe payments: We do not share your personal information with any third
        parties without your consent. Secure personal details: We protect your
        privacy and keep your personal details safe and secure.
      </p>
    </div>
  );
};
