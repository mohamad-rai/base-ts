import mongoose from 'mongoose';

import { RESET_LOG_COLOR } from './consts';

type ConnectionString = {
  url: string;
};

export default ({ url }: ConnectionString) => {
  const connect = () => {
    mongoose
      .connect(url)
      .then(() => {
        return console.info(
          '[DataBase]: Successfully connected to DB',
          RESET_LOG_COLOR,
        );
      })
      .catch((error) => {
        console.error('[DataBase]: Error connecting to database: ', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
