import TweetCard,  { TweetActionIcons } from "@/components/TweetCard";
import { FaRegCommentAlt, FaRegHeart } from "react-icons/fa";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { dehydrate, QueryClient } from '@tanstack/react-query';

const getTweet = (id: number) => fetch(`http://localhost:4000/tweet?id=${id}`).then(res => res.json()).catch(error =>  console.log(error));

interface TweetPageProps{
  dehydratedState: any
}
export default function TweetPage({ dehydratedState }: TweetPageProps) {

  const { tweet:currentTweet, replyTraceTweets } = dehydratedState.queries[0].state.data;
  console.log({ currentTweet, replyTraceTweets });

  return (
    <main className="bg-zinc-900 px-2">
      <div className={`max-w-xl py-2 h-screen mx-auto bg-zinc-900 border-x-[0.5px] border-zinc-700 overflow-y-scroll`}>
        {replyTraceTweets.map((tweet: any) => (
          <TweetCard 
            key={tweet.id}
            id={tweet.id}
            author={tweet.author}
            body={tweet.body}
            replyCount={tweet._count.replies}
            likes={tweet.likes}
            createdAt={tweet.createdAt}
            tweetType="ReplyTrace"
          />
        ))}
        <div className="px-4 text-zinc-300 border-b-[0.5px] border-zinc-700">
          <div className={`flex  `}>
            <div className="shrink-0">
              <picture className="block z-20 h-12 w-12 rounded-full bg-blue-500 overflow-hidden">
                {/* <img src="" alt="" /> */}
              </picture>
            </div>
            <div className="flex-1 mx-2">
              <div className="leading-4 h-full flex flex-col items-start justify-center">
                <strong className="mr-2">{currentTweet.author.userName}</strong>
                <small className="text-zinc-500">@{currentTweet.author.userName} </small>
              </div>
            </div>
          </div>
          
          <p className="my-4">{currentTweet.body}</p>

          <div className="text-zinc-500">
            <span>1:45PM &#x2022;</span>
            <span> 06/04/23 &#x2022;</span>
            <strong className="text-zinc-300"> 11.9K </strong>
            <span>Views</span>
          </div>

          <div className="text-zinc-500 border-y-[0.5px] border-zinc-700 py-2 my-2">
            <span className="text-zinc-300">5 </span>
            <span className="mr-2">Retweets</span>
            <span className="text-zinc-300">{currentTweet.likes} </span>
            <span className="mr-2">Likes</span>
            <span className="text-zinc-300">{currentTweet._count.replies} </span>
            <span>Replies</span>
          </div>

          <ul className='my-2 px-10 flex justify-between text-zinc-500'>
            <TweetActionIcons 
              withValue={false}
              color='blue'
              icon={<FaRegCommentAlt/>}
              value={13}
            />
            <TweetActionIcons 
              withValue={false}
              color='green'
              icon={<RiArrowLeftRightFill/>}
              value={6}
            />
            <TweetActionIcons 
              withValue={false}
              color='red'
              icon={<FaRegHeart/>}
              value={191}
            />
          </ul>
        </div>
        {currentTweet.replies.map((tweet:any) => (
          <TweetCard 
            key={tweet.id}
            id={tweet.id}
            author={tweet.author}
            body={tweet.body}
            replyCount={tweet._count.replies}
            likes={tweet.likes}
            createdAt={tweet.createdAt}
            tweetType="TopLevel"
          />
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }:{ params: {id: string}}){
  const tweetId = parseInt(params.id);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['tweet', tweetId ], () => getTweet(tweetId));
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}