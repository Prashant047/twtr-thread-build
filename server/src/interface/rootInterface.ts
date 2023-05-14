import Joi from 'joi';

export interface TestInput {
  userName: string,
  age: number
};

export const TestInputSchema = Joi.object({
  userName: Joi.string().min(3).max(20),
  age: Joi.number()
});

export interface CreateTweetBody {
  authorID: number,
  body: string,
  parentId?: number
};

export const CreateTweetSchema = Joi.object({
  authorID: Joi.number().required(),
  body: Joi.string().required(),
  parentId: Joi.number()
});

export interface LikeTweetBody {
  tweetId: number
};

export const LikeTweetSchema =  Joi.object({
  tweetId: Joi.number().required()
});