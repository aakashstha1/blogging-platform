import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Builds a compact page list with ellipses, e.g: 1 ... 4 5 [6] 7 8 ... 20
function getPageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="border-[#E8E4DC]"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((num, i) => {
        const prev = pageNumbers[i - 1];
        const showEllipsis = prev && num - prev > 1;
        return (
          <div key={num} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-[#1C2321]/40">…</span>}
            <Button
              variant={num === page ? "default" : "outline"}
              size="icon"
              className={
                num === page
                  ? "bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
                  : "border-[#E8E4DC] text-[#1C2321]"
              }
              onClick={() => onPageChange(num)}
              aria-current={num === page ? "page" : undefined}
            >
              {num}
            </Button>
          </div>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        className="border-[#E8E4DC]"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
