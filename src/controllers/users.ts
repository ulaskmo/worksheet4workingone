import { Request, Response } from 'express';
import { usersCollection } from '../database';
import User from '../models/user';
import { ObjectId } from 'mongodb';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Oops! Something went wrong.');
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const user = await usersCollection.findOne({ _id: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send(`No user found with id: ${req.params.id}`);
    }
  } catch (error) {
    res.status(500).send(`Error retrieving user with id: ${req.params.id}`);
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
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

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await usersCollection.updateOne({ _id: id }, { $set: req.body });

    if (result.matchedCount > 0) {
      res.status(200).json({ message: `User with id ${id} updated successfully` });
    } else {
      res.status(404).json({ message: `No user found with id ${id}` });
    }
  } catch (error) {
    res.status(500).send('An error occurred while updating the user.');
  }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await usersCollection.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.status(202).json({ message: `Successfully removed user with id ${id}` });
    } else {
      res.status(404).json({ message: `No user found with id ${id}` });
    }
  } catch (error) {
    res.status(500).send('Error deleting user.');
  }
};
