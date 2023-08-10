#!/bin/bash

# set up frontend build
cd frontend
npm install
npm run build
cd ..
mv frontend/build backend/build

# run server in production mode with frontend build
cd backend
npm install
npm start
