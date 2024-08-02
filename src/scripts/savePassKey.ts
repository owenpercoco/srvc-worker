import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connect from '../utils/db';

const SALT_ROUNDS = 10;

const SecuritySchema = new mongoose.Schema({
  key: { type: String, required: true },
});

const Security = mongoose.model('Security', SecuritySchema);

const savePassKey = async (input: string) => {
  const hashedKey = await bcrypt.hash(input, SALT_ROUNDS);
  const newEntry = new Security({ key: hashedKey });

  try {
    await newEntry.save();
    console.log('PassKey saved successfully');
  } catch (error) {
    console.error('Error saving PassKey', error);
  } finally {
    mongoose.connection.close();
  }
};

const main = async () => {
  const inputKey = process.argv[2];

  if (!inputKey) {
    console.error('Please provide a key as an argument');
    process.exit(1);
  }

  await connect();
  await savePassKey(inputKey);
};

main();
