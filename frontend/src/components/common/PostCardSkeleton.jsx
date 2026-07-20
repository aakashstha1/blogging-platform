export default function PostCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-[#E8E4DC] bg-white sm:flex-row">
      {/* Cover image */}
      <div className="aspect-[16/9] w-full shrink-0 bg-[#E8E4DC]/70 sm:aspect-auto sm:h-auto sm:w-64" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {/* Header: avatar + username + time */}
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-[#E8E4DC]/70" />
          <div className="h-3 w-32 rounded bg-[#E8E4DC]/70" />
        </div>

        {/* Title + excerpt */}
        <div className="flex flex-col gap-2">
          <div className="h-5 w-3/4 rounded bg-[#E8E4DC]/70" />
          <div className="h-3.5 w-full rounded bg-[#E8E4DC]/50" />
          <div className="h-3.5 w-2/3 rounded bg-[#E8E4DC]/50" />
        </div>

        {/* Counts row */}
        <div className="mt-auto flex items-center gap-4 pt-3">
          <div className="h-3 w-8 rounded bg-[#E8E4DC]/50" />
          <div className="h-3 w-8 rounded bg-[#E8E4DC]/50" />
        </div>
      </div>
    </div>
  );
}
