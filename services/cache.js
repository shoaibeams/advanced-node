const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  console.log("I AM ABOUT TO RUN A QUERY");
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );
  // See if we have a value for 'key' in redis
  console.log(key);
  try {
    const cachedValue = await client.hget(this.hashKey, key);
    console.log("cachedValue", cachedValue);
    // if we do, return that
    if (cachedValue) {
      console.log("Pulling from redis", cachedValue);

      const doc = JSON.parse(cachedValue);

      // The app expects mongoose document so we need to convert the simple
      // JS object into model instance
      return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);
    console.log("result ", result);
    client.hset(this.hashKey, key, JSON.stringify(result));
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
