import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('MONGO_DB_URI:', process.env.MONGO_DB_URI);
console.log('AUTH_SECRET:', process.env.AUTH_SECRET);
console.log('MONGO_DB_PASSWORD:', process.env.MONGO_DB_PASSWORD);
console.log('MONGO_DB_USERNAME:', process.env.MONGO_DB_USERNAME);
