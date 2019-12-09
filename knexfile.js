const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
production:{
  connection: `${DB_URL}?ssl=true`,
  user: "mydude",
  password: "rocketman"
},

  development: {
    connection: {
      database: "nc_news",
      user: "mydude",
      password: "rocketman"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: "mydude",
      password: "rocketman"
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
