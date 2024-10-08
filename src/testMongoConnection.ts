import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

const uri = process.env.DB_CONN_STRING || '';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        await client.close();
    }
}

run();
