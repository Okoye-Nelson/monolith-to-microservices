import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';
import {IndexRouter} from './controllers/v0/index.router';
import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0MODELS} from './controllers/v0/model.index';

const c = config;

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json()); // parse application/json

  // enable CORS 
  app.use(cors({
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*"
  }));
  
  /*
  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.header("Access-Control-Allow-Origin", c.url);
    // allow every connection as the headers.origin will be sent with every query.
    // res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    // res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  // register custom Middleware
  app.use(cors({ optionsSuccessStatus: 200 }));
  */

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  } );

  app.get("/health", (req, res) => {
    res.status(200).send("udagram-api-feed Alive");
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `Start the Frontend on ` + c.url );
      console.log( `press CTRL+C to stop server` );
  } );
})();