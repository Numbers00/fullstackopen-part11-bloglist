#!/bin/bash

# set up frontend build
cd frontend
npm install
npm run build
mv dist ../backend/dist
