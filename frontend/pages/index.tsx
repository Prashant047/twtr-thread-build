import TweetCard from "@/components/TweetCard";
// import { useEffect } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';

const getTweets = () => {
  return fetch('http://localhost:4000/tweet/home')
    .then( res => res.json())
    .catch(( error ) => console.log(error));
}

interface HomeProps {
  dehydratedState: any
}
export default function Home({ dehydratedState }: HomeProps) {
  const initialTweets = dehydratedState.queries[0].state.data;
  console.log(initialTweets);

  return (
    <main className="bg-zinc-900 px-2">
      <div className={`max-w-xl h-screen mx-auto bg-zinc-900 border-x-[0.5px] border-zinc-700 overflow-y-scroll`}>
        <ul className="flex flex-col">
          {initialTweets.map((tweet: any) => (
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
          {/* <TweetCard tweetType="TopLevel"/>
          <TweetCard tweetType="TopLevel"/>
          <TweetCard tweetType="TopLevel"/>
          <TweetCard tweetType="TopLevel"/>
          <TweetCard tweetType="TopLevel"/> */}
        </ul>
      </div>
    </main>
  );
}

export async function getServerSideProps(){
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['tweets'], getTweets);
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
}