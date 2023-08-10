#!/bin/bash

# set up frontend build
cd frontend
npm install
npm run build:linux
mv dist ../backend/dist
