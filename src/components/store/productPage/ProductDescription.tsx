"use client";
import DOMPurify from "dompurify";

interface ProductDescriptionProps {
  text: [string, string];
}

const ProductDescription = ({ text }: ProductDescriptionProps) => {
  const sanitizedDescription1 = DOMPurify.sanitize(text[0]);
  const sanitizedDescription2 = DOMPurify.sanitize(text[1]);
  return (
    <div className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-2xl font-bold text-black">Product Description</h2>
      </div>
      {/* Display both descriptions This will render HTML content safely using DOMPurify */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription1 }} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription2 }} />
    </div>
  );
};

export default ProductDescription;
