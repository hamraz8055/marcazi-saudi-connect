import React, { useState } from "react";
import { categories } from "@/lib/categories";

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

const ImageFallback: React.FC<ImageFallbackProps> = ({ fallbackText = "Marcazi", alt, className, src, ...props }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    // Try to show a category-relevant icon placeholder
    return (
      <div className={`flex items-center justify-center bg-muted ${className || ""}`} style={{ minHeight: 120 }}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
          <span className="text-xs font-medium">{fallbackText}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      src={src}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageFallback;
