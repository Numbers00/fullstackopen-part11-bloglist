#!/bin/bash
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
