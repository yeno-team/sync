const exec = require('child_process').execSync;

// Server Build
exec('npx ttsc', {stdio:[0,1,2]});

// Client Build
exec("cd ./src/client && yarn build", {stdio:[0,1,2]});