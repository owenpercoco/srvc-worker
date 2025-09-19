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

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node deleteFieldFromProduct.js <fieldName> [--yes] [--dry-run]');
    process.exit(1);
  }

  const fieldName = args[0];
  const autoYes = args.includes('--yes') || process.env.AUTO_CONFIRM === '1';
  const dryRun = args.includes('--dry-run');

  console.log(`Field to remove: '${fieldName}'`);

  await mongoose.connect(uri, { autoIndex: false });

  try {
    const db = mongoose.connection.db;
    const coll = db.collection('products');

    const existsCount = await coll.countDocuments({ [fieldName]: { $exists: true } });
    console.log(`Found ${existsCount} documents with field '${fieldName}'.`);

    if (existsCount === 0) {
      console.log('Nothing to do. Exiting.');
      await mongoose.disconnect();
      process.exit(0);
    }

    if (dryRun) {
      console.log('Dry-run mode, not making changes. Use --yes to apply changes.');
      await mongoose.disconnect();
      process.exit(0);
    }

    let ok = autoYes;
    if (!ok) {
      ok = await confirm(`Unset field '${fieldName}' on ${existsCount} documents? Type 'y' to proceed: `);
    }

    if (!ok) {
      console.log('Aborted by user. No changes made.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const result = await coll.updateMany({ [fieldName]: { $exists: true } }, { $unset: { [fieldName]: '' } });
    console.log(`Update complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error while removing field:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
}

main();
