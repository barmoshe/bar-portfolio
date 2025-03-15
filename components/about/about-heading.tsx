"use client";

import SectionHeading from "@/components/ui/section-heading";

interface AboutHeadingProps {
  title: string;
  inView: boolean;
}

export default function AboutHeading({ title, inView }: AboutHeadingProps) {
  return (
    <div className="text-center mb-8">
      <SectionHeading inView={inView}>{title}</SectionHeading>
    </div>
  );
}
