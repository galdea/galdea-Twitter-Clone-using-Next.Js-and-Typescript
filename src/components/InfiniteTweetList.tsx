import { useSession } from "next-auth/react";
import Link from "next/link";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import InfiniteScroll from "react-infinite-scroll-component";
import { IconHoverEffect } from "./IconHoverEffect";
import { ProfileImage } from "./profileImage";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

export function InfiniteTweetList({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore,
}: InfiniteTweetListProps) {
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error...</h1>;

  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="text-2x1 my-4 text-center text-gray-500">No Tweets...</h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={"Loading..."}
      >
        {tweets.map((tweet) => {
          return <TweetCard key={tweet.id} {...tweet} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

function TweetCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Tweet) {
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-grey-500">-</span>
          <span className="text-grey-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
          <p className="whitespace-pre-wrap">{content}</p>
          <HeartButton likedByMe={likedByMe} likeCount={likeCount} />
        </div>
      </div>
    </li>
  );
}

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
};

function HeartButton({ likedByMe, likeCount }: HeartButtonProps) {
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  const session = useSession();

  if (session.status !== "authenticated") {
    return (
      <div className="text-grey-500 mb-1 mt-1 flex items-center gap-3 self-start">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }
  return (
    <button
      className={`groups ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
}
