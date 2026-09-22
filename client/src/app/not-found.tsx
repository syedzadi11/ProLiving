

import Link from "next/link";
import { Home } from "lucide-react";

// 5-row pixel patterns for each digit (1 = tile, 0 = empty)
const DIGIT_4 = [
  [1, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 0, 1],
  [0, 0, 1],
];
const DIGIT_0 = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
];
const GAP_COL = [[0], [0], [0], [0], [0]];

// Stitch the digits together: 4 - gap - 0 - gap - 4
const GRID = DIGIT_4.map((row, r) => [
  ...row,
  ...GAP_COL[r],
  ...DIGIT_0[r],
  ...GAP_COL[r],
  ...DIGIT_4[r],
]);

function Tile() {
  return (
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-[8px] border border-[#dae2fd] bg-white flex flex-col items-center justify-center gap-0.5 shrink-0">
      <span className="w-6 h-6 rounded-[6px] bg-[#00685f] flex items-center justify-center">
        <Home className="w-3.5 h-3.5 text-white" />
      </span>
      <span className="text-[7px] font-bold text-[#131b2e] leading-none">ProLiving</span>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="bg-[#faf8ff] min-h-[calc(100vh-57px)] flex flex-col items-center px-4 pt-16 pb-20 text-center overflow-x-auto">
      <h1 className="text-[32px] font-bold text-[#131b2e] tracking-tight mb-2">
        Oops! This space can&apos;t be found.
      </h1>
      <p className="text-[15px] text-[#515f74] mb-12 max-w-md">
        The listing or page you&apos;re looking for may have been moved, rented out, or never existed.
      </p>

      <div className="flex flex-col gap-2 md:gap-3 mb-12">
        {GRID.map((row, r) => (
          <div key={r} className="flex gap-2 md:gap-3">
            {row.map((cell, c) =>
              cell ? <Tile key={c} /> : <div key={c} className="w-14 h-14 md:w-16 md:h-16 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Link href="/">
        <button className="h-11 px-6 bg-[#00685f] hover:bg-[#00534c] rounded-[4px] flex items-center gap-2 text-white text-[13px] font-medium transition-colors">
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </Link>
    </div>
  );
}