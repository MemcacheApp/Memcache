import formatDistanceToNow from '@/src/app/utils/dateFns';

export default function LastReview({ reviewTime }: { reviewTime?: Date }) {
  return (
    <div className="text-slate-500">
      {reviewTime
        ? `Last reviewed ${formatDistanceToNow(reviewTime)}`
        : "First review"}
    </div>
  );
}
