import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Load environment variables from .env file

const MONGO_URI = process.env.MONGO_DB_URI!;

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env file');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include mongoose cache
declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
    console.log("connecting")
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
        bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
        return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connect;
