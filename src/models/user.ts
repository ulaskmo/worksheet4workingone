import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Joi from 'joi'; 
import { usersCollection } from '../database'; 

export default interface User {
  _id?: ObjectId;
  name: string;
  phonenumber: string;
  email: string;
  dateJoined?: Date;
  lastUpdated?: Date;
}

export const ValidateUser = (user: User) => {
  const contactJoiSchema = Joi.object<User>({
    name: Joi.string().min(3).required(),
    phonenumber: Joi.string().min(10), 
    email: Joi.string().email().required(),
  });

  return contactJoiSchema.validate(user);
};

export const createUser = async (req: Request, res: Response) => {

  const validateResult: Joi.ValidationResult = ValidateUser(req.body);

  if (validateResult.error) {
    res.status(400).json(validateResult.error);
    return;
  }

  try {
    const newUser = req.body as User;

    newUser.dateJoined = new Date();
    newUser.lastUpdated = new Date();

    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      res.status(201).json({ message: `User created with id: ${result.insertedId}` });
    } else {
      res.status(500).send('Failed to create a new user.');
    }
  } catch (error) {
    res.status(400).send('Unable to create a new user.');
  }
};
