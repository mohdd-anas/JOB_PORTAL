const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`} />
)

export const JobCardSkeleton = () => (
    <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5'>
        <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center gap-3'>
                <Skeleton className='h-12 w-12 rounded-xl' />
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-16' />
                </div>
            </div>
            <Skeleton className='h-5 w-5 rounded' />
        </div>
        <Skeleton className='h-5 w-3/4 mb-2' />
        <Skeleton className='h-3 w-full mb-1' />
        <Skeleton className='h-3 w-2/3 mb-4' />
        <div className='flex gap-2 mb-4'>
            <Skeleton className='h-6 w-20 rounded-full' />
            <Skeleton className='h-6 w-16 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
        </div>
        <div className='flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-8 w-24 rounded-lg' />
        </div>
    </div>
)

export const JobCardSkeletonGrid = ({ count = 6 }) => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {Array.from({ length: count }).map((_, i) => (
            <JobCardSkeleton key={i} />
        ))}
    </div>
)

export default Skeleton
