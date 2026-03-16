// src/components/shared/Modal.tsx
"use client";

import { X } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";

interface ModalProps {
  title: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

const Modal = ({ title, show, setShow, children }: ModalProps) => {
  useEffect(() => {
    if (!show) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show, setShow]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-[1px] flex items-center justify-center px-4"
      onMouseDown={() => setShow(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl rounded-xl bg-white shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <button
            type="button"
            aria-label="Close modal"
            onClick={() => setShow(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

// "use client";

// import { X } from "lucide-react";
// import { Dispatch, ReactNode, SetStateAction } from "react";

// interface ModalProps {
//   title: string;
//   show: boolean;
//   setShow: Dispatch<SetStateAction<boolean>>;
//   children: ReactNode;
// }

// const Modal = ({ title, show, setShow, children }: ModalProps) => {
//   if (!show) return null;

//   return (
//     <div className="w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-gray-50/65 z-50">
//       <div className="fixed top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 bg-white px-10 min-w-200 max-w-225 py-5 shadow-md rounded-lg">
//         <div className="flex items-center justify-between border-b pb-2">
//           <h2 className="text-lg font-bold">{title}</h2>
//           <X
//             className="w-4 h-4 cursor-pointer"
//             onClick={() => setShow(false)}
//           />
//           <div className="mt-6">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
