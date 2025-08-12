// components/FlipCard.tsx
import React from "react";

interface FlipCardProps {
  flipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  flipped,
  front,
  back,
  className = "",
}) => (
  <div className={`[perspective:1000px] ${className}`}>
    <div
      className={`relative w-full h-full transition-transform duration-700
                  [transform-style:preserve-3d]
                  ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">
        {front}
      </div>

      <div className="absolute inset-0 [backface-visibility:hidden]
                      [transform:rotateY(180deg)]">
        {back}
      </div>
    </div>
  </div>
);

export default FlipCard;
