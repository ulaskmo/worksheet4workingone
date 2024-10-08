import { ObjectId } from 'mongodb';

export default interface User {
  _id?: ObjectId;
  name: string;
  phonenumber: string;
  email: string;
  dateJoined? : Date;
  lastUpdated? : Date;
}
