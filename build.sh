#!/bin/bash
echo "node v"
node -v
echo "npm v"
npm -v
echo "ls-1"
ls
# set up frontend build
cd frontend
echo "ls-2"
ls
npm install
npm run build:linux
echo "ls-3"
ls
mv dist ../backend/dist
echo "ls-4"
ls
cd ../backend
npm install
echo "ls-5"
ls
echo "ls-6"
ls dist
