// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import path from "path";

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config({
  path: path.join(dirname(fileURLToPath(import.meta.url)), "..", "..", ".env"),
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error(
    "Please define the mongoURI environment variable inside .env"
  );
}

let cachedMongoObject = global.mongoose;
if (!cachedMongoObject) {
  cachedMongoObject = global.mongoose = { connection: null, promise: null };
}

async function connectToDB() {
  console.log("Connecting to DB");
  if (cachedMongoObject.connection) {
    return cachedMongoObject.connection;
  }

  if (!cachedMongoObject.promise) {
    const opts = { bufferCommands: false };
    try {
      cachedMongoObject.promise = mongoose
        .connect(mongoUri, opts)
        .then((mongoose) => {
          return mongoose;
        });
      cachedMongoObject.connection = await cachedMongoObject.promise;
      console.log("Success");
      return cachedMongoObject.connection;
    } catch {
      throw new Error("No Connection");
    }
  }
}

// Test
if (import.meta.url === `file://${process.argv[1]}`) {
  connectToDB()
    .then(() => {
      console.log("Database connection successful");
      mongoose.connection.close(); // Close the connection after testing
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
    });
}

export default connectToDB;
