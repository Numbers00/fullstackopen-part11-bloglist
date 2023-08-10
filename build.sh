#!/bin/bash

# set up frontend build
cd frontend
npm install
npm run build
mv build ../backend/build
