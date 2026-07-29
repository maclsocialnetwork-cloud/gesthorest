"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 12, suffix: "+", label: "ans d'expérience" },
  { value: 3500, suffix: "+", label: "apprenants formés" },
  { value: 94, suffix: "%", label: "de satisfaction" },
  { value: 2, suffix: "", label: "pays de présence" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="text-center">
      <p className="font-heading text-4xl font-bold text-gesthorest-accent sm:text-5xl">
        {count.toLocaleString("fr-FR")}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-gesthorest-primary">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsCounter() {
  const [active, setActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container-gesthorest grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
