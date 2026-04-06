import type { Room, User, Stream } from '@/prisma/generated/prisma/client'



type Props = {
  stream: Stream & {upvotes?: []},
  index: number,
  onUpvote: (stream: Stream) => void;
};

const StreamComponent = ({ stream, index, onUpvote }: Props) => {

  console.log(stream);

  return (
    <div
      key={stream.id}
      className="rounded-lg border border-border bg-card p-3"
    >
      <div className="flex items-start gap-2 h-5 select-none">
        <span className="text-sm font-bold text-primary =">^{stream.upvotes?.length}</span>
        <span className='h-full'>
          <img className="h-full" src={stream.thumbnailUrlLQ} alt="Stream thumbnail" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-foreground select-text">
            {stream.title}
          </p>
        </div>
        <button
          onClick={() => onUpvote(stream)}
          className="shrink-0 cursor-pointer rounded-lg bg-primary/20 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
        >
          +1
        </button>
      </div>
    </div>
  );
};

export default StreamComponent;
