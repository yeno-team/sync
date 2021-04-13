


# Sync [![Build Status](https://travis-ci.com/yeno-team/sync.svg?branch=main)](https://travis-ci.com/yeno-team/sync) [![Coverage Status](https://coveralls.io/repos/github/yeno-team/sync/badge.svg?branch=main)](https://coveralls.io/github/yeno-team/sync?branch=main) [![Known Vulnerabilities](https://snyk.io/test/github/yeno-team/sync/badge.svg)](https://snyk.io/test/github) [![Maintainability](https://api.codeclimate.com/v1/badges/4b1e10c1f337cca6a616/maintainability)](https://codeclimate.com/github/yeno-team/sync/maintainability)  

~~[View Demo](localhost)~~  *deploying by next week*

### Table of Contents  
- [What is Sync?](#what-is-sync)  
	* [Main Dependencies](#main-dependencies)
- [Installation](#installation)  
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)


## What is Sync? 
Sync is a web application where you can watch videos from other websites with others in a chatroom! Our chatroom comes loaded with emotes from [BTTV](https://betterttv.com/) while also providing entertainment with a chatbot! 
#### Main Dependencies
* Express.js
* React.js
* Typescript
* Socket.io

## Installation
```bash
git clone https://github.com/yeno-team/sync.git

# Install Server Dependencies
cd sync
yarn install

# Install Client Dependencies
cd src/client
yarn install
```

## Configuration
### Server Environment Variables

> File should be at root named .env.[environment here] ex. **.env.development**, **.env.production**

> A Proxy is **Required** because it is used to scrape from sites.

|Name| Description |
|--|--|
| PORT | Main Server's Port *(default: 8080)*  |
| SOCKET_PORT | Socket.io Port *(default: 51282)* |
| PROXY_HOST | HTTP proxy host *(required)*  |
| PROXY_PORT | HTTP proxy port *(required)* |
| PROXY_USERNAME | HTTP proxy auth username *(optional)*  |
| PROXY_PASSWORD | HTTP proxy auth password *(optional)* |
| REDIS_HOST | Redis Instance hostname *(required)* |
| REDIS_PORT | Redis Instance Port *(required)* |
| REDIS_PASSWORD | Redis Instance Password *(required)* |

### Client
There is a config folder with the configurations.

## Deployment
>  A **.env.production** file is required 
```bash
# IN ROOT DIRECTORY
yarn build
yarn deploy
```





## Contributing
All contributions are welcome! Just send a pull request our way. If the change is big, please start a issue first before working on it.

## License
[MIT](https://choosealicense.com/licenses/mit/)


