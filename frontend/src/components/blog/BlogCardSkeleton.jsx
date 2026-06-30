const BlogCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-4 w-20" />
      <div className="skeleton h-5 w-full" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="flex items-center gap-3 pt-2">
        <div className="skeleton h-8 w-8 rounded-full" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
  </div>
);

export default BlogCardSkeleton;
