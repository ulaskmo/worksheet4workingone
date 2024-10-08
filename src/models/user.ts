import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Joi from 'joi'; // Ensure you have Joi installed: npm install joi
import { usersCollection } from '../database'; // Adjust the path to your database connection as needed

// Define the User interface
export default interface User {
  _id?: ObjectId;
  name: string;
  phonenumber: string;
  email: string;
  dateJoined?: Date;
  lastUpdated?: Date;
}

// Joi validation schema for the User object
export const ValidateUser = (user: User) => {
  const contactJoiSchema = Joi.object<User>({
    name: Joi.string().min(3).required(),
    phonenumber: Joi.string().min(10), // This can be adjusted as needed
    email: Joi.string().email().required(),
  });

  // Validate the user object against the schema
  return contactJoiSchema.validate(user);
};

// User creation function to handle POST /users request
export const createUser = async (req: Request, res: Response) => {
  // Validate the user data using Joi
  const validateResult: Joi.ValidationResult = ValidateUser(req.body);

  // If there are validation errors, return a 400 status with the error details
  if (validateResult.error) {
    res.status(400).json(validateResult.error);
    return;
  }

  try {
    const newUser = req.body as User;

    // Set the dateJoined and lastUpdated fields to the current date when creating a new user
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
