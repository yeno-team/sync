import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export default {
    server: {
        PORT: parseInt(process.env.PORT) || 8080
    },
    proxy: {
        port: validateVariable("PROXY_PORT"),
        host: validateVariable("PROXY_HOST"),
        auth: {
            username: validateVariable("PROXY_USERNAME"),
            password: validateVariable("PROXY_PASSWORD")
        }
    }
}

export function validateVariable(varName)  {
    if (varName in process.env) {
        return process.env[varName];
    } else {
        throw new Error(`${varName} is a required env variable and was not found!`);
    }
}