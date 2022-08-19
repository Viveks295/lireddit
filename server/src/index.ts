import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
//import { Post } from './entities/Post';
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

//import { MyContext } from "./types";

const main = async () => {
  // const conn = await createConnection({
  //   type: "postgres",
  //   database: "lireddit2",
  //   username: "postgres",
  //   password: "postgres",
  //   logging: true,
  //   synchronize: true,
  //   migrations: [path.join(__dirname, "./migrations/*")],
  //   entities: [Post, User, Updoot],
  // });

  const conn = await createConnection({
    type: "postgres",
    host: "ec2-3-224-184-9.compute-1.amazonaws.com",
    database: "d8s20flek2drsi",
    username: "ivgwzmukythvhb",
    password:
      "ea9fbece5ce2c209b09917ae32e03a3d57b5f63e9493a2e0928d4d78e57db20d",
    logging: true,
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });

  await conn.runMigrations();

  //await Post.delete({});

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "aiuewfoawuehfawiufehapwf",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});

//console.log("hello there");
