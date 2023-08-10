#!/bin/bash
ls
# set up frontend build
cd frontend
ls
npm install
npm run build:linux
mv dist ../backend/dist
