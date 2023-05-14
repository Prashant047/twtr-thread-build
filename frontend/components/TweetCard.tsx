import Link from 'next/link';
import { ReactNode } from 'react';
import { FaRegCommentAlt, FaRegHeart } from 'react-icons/fa';
import { RiArrowLeftRightFill } from 'react-icons/ri';

interface TweetCardProps {
  id: number,
  createdAt: string,
  tweetType: 'ReplyTrace' | 'TopLevel',
  author: { id: number, userName: string},
  body: string,
  replyCount: number,
  likes: number
};

export default function TweetCard({
  tweetType,
  id,
  author,
  body,
  replyCount,
  likes,
  createdAt
}:TweetCardProps){
  return (
    <Link href={`/tweet/${id}`}>
      <li className={`relative z-0 px-4  flex ${tweetType === "TopLevel"?'border-b-[0.5px] border-zinc-700 py-2':''} text-zinc-300`}>
        <div className="relative shrink-0">
          <picture className="relative block z-20 h-12 w-12 rounded-full bg-blue-500 overflow-hidden">
            {/* <img src="" alt="" /> */}
          </picture>
          {tweetType === 'ReplyTrace'?<div className={`absolute z-10 top-0 left-1/2 w-[2px] h-full bg-zinc-700 rounded-md`}></div> : ''}
        </div>
        <div className="flex-1 mx-2">
          <div className="leading-4">
            <strong className="mr-2">{author?.userName}</strong>
            <small className="text-zinc-500">@{author?.userName} </small>
            <small className="text-zinc-500">&#x2022; 4h</small>
          </div>
          <p className="mr-2">{body}</p>
          <ul className='my-2 flex justify-between text-zinc-500'>
            <TweetActionIcons
              color='blue'
              icon={<FaRegCommentAlt/>}
              value={replyCount}
            />
            <TweetActionIcons
              color='green'
              icon={<RiArrowLeftRightFill/>}
              value={6}
            />
            <TweetActionIcons
              color='red'
              icon={<FaRegHeart/>}
              value={likes}
            />
          </ul>
        </div>
      </li>
    </Link>
  )
}

interface TweetActionIconsProps {
  color: string,
  icon: ReactNode,
  value: number,
  withValue?: boolean
}

export function TweetActionIcons({ color, icon, value , withValue = true}:TweetActionIconsProps) {
  return (
    <li className='flex items-center group cursor-pointer px-2'>
      <span className={`transition group-hover:text-blue-500 group-hover:bg-blue-500/10 p-2 rounded-full `}>
        {icon}
      </span>
      {withValue?(
          <small className={`transition group-hover:text-blue-500 mx-1`}>
            {value}
          </small>
        ):''}
    </li>
  )
}
