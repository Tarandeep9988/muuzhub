import type { Room, User, Stream } from '@/prisma/generated/prisma/client'

type Props = {
  stream: Stream,
  index: number,
  onUpvote: (stream: Stream) => void;
};

const StreamComponent = ({ stream, index, onUpvote }: Props) => {

  

  return (
    <div
      key={stream.id}
      className="rounded-lg border border-border bg-card p-3"
    >
      <div className="flex items-start gap-2">
        <span className="text-sm font-bold text-primary">#{index + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-foreground">
            {stream.url}
          </p>
        </div>
        <button
          onClick={() => onUpvote(stream)}
          className="shrink-0 rounded-lg bg-primary/20 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
        >
          +1
        </button>
      </div>
    </div>
  );
};

export default StreamComponent;
