#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

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
  await mongoose.connect(uri, { dbName: undefined, autoIndex: false });

  try {
    const db = mongoose.connection.db;
    const collName = 'products';
    const coll = db.collection(collName);

    console.log(`Checking indexes on collection '${collName}'...`);
    const indexes = await coll.indexes();
    const idIndex = indexes.find((ix) => ix.name === 'id_1' || (ix.key && ix.key.id === 1));

    if (!idIndex) {
      console.log("No 'id_1' index found on products. Nothing to do.");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('Found index:', idIndex);

    const autoYes = process.argv.includes('--yes') || process.env.AUTO_CONFIRM === '1';
    let ok = autoYes;
    if (!ok) {
      ok = await confirm("Drop the 'id_1' index on 'products'? This is irreversible. Type 'y' to proceed: ");
    }

    if (!ok) {
      console.log('Aborted by user. Index was not dropped.');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("Dropping index 'id_1'...");
    await coll.dropIndex('id_1');
    console.log("Index 'id_1' dropped successfully.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error while checking/dropping index:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
}

main();
