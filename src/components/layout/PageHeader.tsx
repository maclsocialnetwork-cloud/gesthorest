import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function PageHeader({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb: Crumb[];
}) {
  return (
    <div className="bg-gesthorest-primary py-14">
      <div className="container-gesthorest">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
