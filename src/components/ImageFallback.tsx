import React, { useState } from "react";

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

const ImageFallback: React.FC<ImageFallbackProps> = ({ fallbackText = "Marcazi", alt, className, ...props }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className || ""}`} style={{ minHeight: 120 }}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
            M
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
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageFallback;
