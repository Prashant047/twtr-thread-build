import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

import validateInput from '../middleware/validateInput';
import RequestWithBody from '../requestWithBody';
import { 
  CreateTweetBody, CreateTweetSchema,
  LikeTweetBody, LikeTweetSchema
} from '../interface/rootInterface';

const tweetRouter = Router();

tweetRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id:tweedId } = req.query;

      const tweet = await prisma.tweet.findUnique({
        where: {
          id: parseInt(tweedId as string)
        },
        include: {
          replies: {
            include: {
              author:{
                select: {
                  id: true,
                  userName: true
                }
              },
              _count: {
                select: {
                  replies: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              userName: true
            }
          },
          _count: {
            select: {
              replies: true
            }
          }
        }
      });

      if(!tweet) throw new Error('Tweet not found');
      
      const replyTraceTweets = await prisma.tweet.findMany({
        where: {
          id: {
            in: tweet.replyTrace
          }
        },
        include: {
          author: {
            select: {
              id: true,
              userName: true
            }
          },
          _count: {
            select: {
              replies: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      });
      
      const response = {
        tweet, replyTraceTweets
      }

      return res.status(200).json( response );
    }
    catch(error) {
      console.log('Error in get Tweet');
      next(error);
    }
  }
);

tweetRouter.post(
  '/create',
  validateInput(CreateTweetSchema),
  async (req: RequestWithBody<CreateTweetBody>, res: Response, next: NextFunction) => {
    const { authorID, parentId, body } = req.body;
    try {
      if(parentId) {
        const parentReplyTrace = await prisma.tweet.findUnique({
          where: {
            id: parentId
          },
          select: {
            replyTrace: true
          }
        });
        
        if(!parentReplyTrace) return next(new Error('Parent Not found'));
        
        const newTweet = await prisma.tweet.create({
          data: {
            authorID,
            parentId,
            body,
            replyTrace: [parentId, ...parentReplyTrace.replyTrace]
          }
        });
        
        return res.json(newTweet);
      }
      
      const newTweet = await prisma.tweet.create({
        data: {
          authorID,
          body,
          replyTrace: []
        }
      });

      return res.json(newTweet);
    }
    catch(error) {
      console.log('Error in create tweet');
      return next(error);
    }
  }
);

tweetRouter.get(
  '/home',
  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const tweets = await prisma.tweet.findMany({
        where: {
          parentId: null
        },
        include: {
          _count: {
            select: { replies: true}
          },
          author: {
            select: {
              id: true,
              userName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.status(200).json(tweets);
    }
    catch( error ) {
      next(error);
    }
  }
);

tweetRouter.post(
  '/like',
  validateInput(LikeTweetSchema),
  async (req: RequestWithBody<LikeTweetBody>, res: Response, next: NextFunction) => {
    try {
      const { tweetId } = req.body;
      const tweetWithUpdatedLike = await prisma.tweet.update({
        where: {
          id: tweetId
        },
        data: {
          likes: {
            increment: 1
          }
        }
      });
      
      if (!tweetWithUpdatedLike) throw new Error('Tweet not found');
      
      res.status(200).json(tweetWithUpdatedLike);
    }
    catch (error) {
      next(error);
    }
  }
)


export default tweetRouter;

