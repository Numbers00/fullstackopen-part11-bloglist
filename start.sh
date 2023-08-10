#!/bin/bash

# run server in production mode with frontend build
cd backend
npm install
echo "ls-6"
ls
echo "ls-7"
ls dist
npm start
