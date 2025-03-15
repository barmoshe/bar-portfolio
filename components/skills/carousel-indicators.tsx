"use client";

interface CarouselIndicatorsProps {
  count: number;
  activeIndex: number;
  goToCategory: (index: number) => void;
}

export default function CarouselIndicators({
  count,
  activeIndex,
  goToCategory,
}: CarouselIndicatorsProps) {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToCategory(index)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            activeIndex === index
              ? "bg-primary scale-125"
              : "bg-primary/30 hover:bg-primary/50"
          }`}
          aria-label={`Go to category ${index + 1}`}
        />
      ))}
    </div>
  );
}
