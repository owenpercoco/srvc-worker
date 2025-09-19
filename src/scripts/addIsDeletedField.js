#!/usr/bin/env node
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const readline = require('readline');

dotenv.config({ path: '.env.local' });

async function confirm(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(prompt, (ans) => {
      rl.close();
      resolve(ans.trim().toLowerCase() === 'y');
    });
  });
}

async function main() {
  const uri = process.env.MONGO_DB_URI;
  if (!uri) {
    console.error('Missing MONGO_DB_URI in environment. Set it in .env.local or export it before running.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri, { autoIndex: false });

  try {
    const db = mongoose.connection.db;
    const collName = 'products';
    const coll = db.collection(collName);

    const missingCount = await coll.countDocuments({ is_deleted: { $exists: false } });
    console.log(`Found ${missingCount} products missing 'is_deleted' field.`);

    if (missingCount === 0) {
      console.log('No work required. Exiting.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const autoYes = process.argv.includes('--yes') || process.env.AUTO_CONFIRM === '1';
    let ok = autoYes;
    if (!ok) {
      ok = await confirm(`Set 'is_deleted: false' on ${missingCount} products? Type 'y' to proceed: `);
    }

    if (!ok) {
      console.log('Aborted by user. No changes made.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const result = await coll.updateMany(
      { is_deleted: { $exists: false } },
      { $set: { is_deleted: false } }
    );

    console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount}.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating products:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
}

main();
