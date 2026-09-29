import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-[#f2f3ff] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#00685f]" />
      </div>
      <h3 className="text-[16px] font-semibold text-[#131b2e] mb-1">{title}</h3>
      <p className="text-[13px] text-[#515f74] max-w-sm mb-5">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <button className="h-9 px-4 bg-[#00685f] hover:bg-[#00534c] rounded-[4px] text-white text-[13px] font-medium transition-colors">
            {actionLabel}
          </button>
        </Link>
      )}
    </div>
  );
}