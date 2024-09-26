export const DB_CONFIG = {

  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PSSWD || 'i26a08m03p',
  database: process.env.DB_NAME || 'WhatsPirate'

}
