export const PORT = process.env.PORT || 8000;
export const DBURL =
  process.env.DBURL || 'mongodb://root:root@localhost:27017/evagent_dev';
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
export const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'jwt_refreshtoken_secret';
export const TOKEN_EXPIRE = parseInt(process.env.TOKEN_EXPIRE || '30');
export const REFRESH_TOKEN_EXPIRE = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || '180',
);

export const DEFAULT_ADMIN_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL || 'admin@evagent.com';
export const DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || 'a654321A!';

export const ACCEPTED_FILE_TYPES = process.env.ACCEPTED_FILE_TYPES
  ? process.env.ACCEPTED_FILE_TYPES.split(',')
  : ['image/png', 'image/jpg', 'image/jpeg'];

export const REGEX_NUMBERS = /(?=.*[0-9])/;
export const REGEX_LOWERCASE_LETTERS = /(?=.*[a-z])/;
export const REGEX_UPPERCASE_LETTERS = /(?=.*[A-Z])/;
export const REGEX_SPECIAL_CHARACTERS = /(?=.*[*.!@$%^&(){}[\]:;<>,.?~_+\-=|])/;

export const RESET_LOG_COLOR = '\x1b[0m';
export const LOG_COLOR_FG_RED = '\x1b[31m';
export const LOG_COLOR_FG_GREEN = '\x1b[32m';
export const LOG_COLOR_FG_YELLOW = '\x1b[33m';
export const LOG_COLOR_FG_BLUE = '\x1b[34m';
