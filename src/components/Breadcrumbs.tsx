import Link from "next/link";

export type Breadcrumb = {
  label: string;
  href: string;
};

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <div className="flex items-center space-x-2">
      {breadcrumbs.map((b, i) => {
        return (
          <div key={i} className="flex items-center space-x-2">
            <div className="hover:underline hover:underline-offset-4">
              <Link
                href={b.href}
                className={
                  breadcrumbs.length - 1 === i
                    ? "text-blue-400"
                    : "text-slate-600"
                }
              >
                {b.label}
              </Link>
            </div>
            <p>/</p>
          </div>
        );
      })}
    </div>
  );
}
