# Northcoders News API

## About the project
This API serves data from a database of news articles. Each article comes under a topic and can have associated comments. Each articles also has a number of votes, which is intended to replicate a 'like' or 'dislike' on the article.

## Set-up
### Cloning the repository
To clone this repo, use the following terminal command:
```
git clone https://github.com/mtaylor57/be-nc-news.git
```
### Installing Dependcies
Install dependcies using:
```
npm install
```
### Creating .env files
To enable the link to the local database, you need to create two files in the root:
```
.env.development
.env.test
```
Then, inside the ```.env.development``` file copy this line:
```
PGDATABASE=nc_news
```
Inside ```.env.test``` copy this:
```
PGDATABASE=nc_news_test
```
Use nc_news for the full development database or nc_news_test for the smaller testing database
### Seed local database
Run the scripts below, these should be listed in the 'scripts' of the package.json
```
npm run setup-dbs
npm run seed
```
### Run the tests
All tests an be run at once using the command:
```
npm test
```

## Versions of Node.js and Postgres
Node version: v16.17.1
psql version: 10.22

## Link to the hosted version of this app
You can follow this link to access the hosted version of this application
https://shy-tan-seagull-gear.cyclic.app/


