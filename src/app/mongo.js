const MongoClient = require('mongodb').MongoClient;
const is_docker = require('is-docker');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const MONGO_URL = process.env.MONGO_URL || (is_docker() ? 'mongodb://mongo:27017/admin' : 'mongodb://localhost:27017/admin');
const MONGO_CONNECTION_OPTIONS = process.env.MONGO_CONNECTION_OPTIONS || {};
const MONGO_CONNECT_TIMEOUT = 10000;
const MONGO_CONNECT_INTERVAL = 1000;

var mongo_instance = undefined;
var is_connecting = false;

async function connect(reload) {
  if (mongo_instance && !reload) return mongo_instance;
  is_connecting = true;
  is_connecting_time = Date.now();
  mongo_instance = await MongoClient.connect(MONGO_URL, MONGO_CONNECTION_OPTIONS);
  is_connecting = false;
  return mongo_instance;
}

async function fetch() {
  while (!mongo_instance) {
    while (is_connecting && Date.now() < is_connecting_time + MONGO_CONNECT_TIMEOUT) await snooze(MONGO_CONNECT_INTERVAL)
    mongo_instance = await connect();
  }
  return mongo_instance;
}

async function close_connection() {
  if (mongo_instance) await mongo_instance.close();
}

function on_findone_and_update(res, require_upserted, success_cb) {
  var success = require_upserted ? res.lastErrorObject.upserted : res.lastErrorObject.updatedExisting;
  if (success && success_cb) success_cb();
  return success ? true : false;
}

async function insert_contacted_listing(listing) {
  const db = await fetch();
  const contacted = await db.db('airbnb').collection('contacted');
  var find_and_modify_res = await contacted.findOneAndUpdate({'listing.id': listing.listing.id}, {$setOnInsert: listing}, {upsert: true});
  return on_findone_and_update(find_and_modify_res, true);
}

async function drop_listings() {
  const db = await fetch();
  const listings = await db.db(config.MONGO_DATABASE_NAME).collection('contacted');
  await listings.drop();
  return true;
}

module.exports = {
  connect: connect,
  close_connection: close_connection,
  insert_contacted_listing: insert_contacted_listing,
  drop_listings: drop_listings
}
