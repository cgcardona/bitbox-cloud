#!/usr/bin/env node
require("babel-register");
let program = require('commander');
let axios = require('axios');
let prompt = require('prompt');
let tokenStore = require('token-store');
let tokens = tokenStore({ filename: 'tokenstoretest' });

program
  .version('0.0.6', '-v, --version')

program
  .command('auth:register')
  .description(`Register for Bitcoin.com credentials`)
  .action(async () => {
    prompt.start();
    prompt.get(['username', 'password'], async (err, result) => {
      try {
        let response = await axios.post(`${process.env.REST_URL}users`, {
          user: {
            username: result.username,
            password: result.password
          }
        });
        tokens.set({
          server: 'http://localhost:5000',
          user: JSON.stringify(response.data.user),
          token: response.data.token
        });
      } catch (error) {
        throw error;
      }
    });
});

program
  .command('auth:2fa')
  .description(`check 2fa status`)
  .action(async () => {
    try {
    let response = await axios.get(`${process.env.REST_URL}auth/2fa`);
      console.log(response.data)
    } catch (error) {
      throw error;
    }
});

program
  .command('auth:login')
  .description(`login with your Bitcoin.com credentials`)
  .action(async () => {
    prompt.start();
    prompt.get(['username', 'password'], async (err, result) => {
      try {
        let response = await axios.post(`${process.env.REST_URL}auth`, {
          username: result.username,
          password: result.password
        });
        console.log(response.data)
      } catch (error) {
        throw error;
      }
    });
});

program
  .command('auth:logout')
  .description(`login with your Bitcoin.com credentials`)
  .action(async () => {
    try {
    let response = await axios.post(`${process.env.REST_URL}auth/logout`);
      console.log(response.data)
    } catch (error) {
      throw error;
    }
})

program
  .command('auth:token')
  .description(`outputs current CLI authentication token`)
  .action(async () => {
    if (tokens.has('http://localhost:5000')) {
      current = tokens.current('http://localhost:5000');
      console.log(current.token);
    }
});

program
  .command('auth:whoami')
  .description(`display the current logged in user`)
  .action(async () => {
    if (tokens.has('http://localhost:5000')) {
      current = tokens.current('http://localhost:5000');
      console.log({
        username: JSON.parse(current.user).username,
        id: JSON.parse(current.user)._id
      });
    }
});

program
  .parse(process.argv);

// print help if no command given
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
