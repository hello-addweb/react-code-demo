# hanooot_backend_products_service

## Overview

This project serves as a template for a Hanooot backend application. It includes configurations for local development, building, testing, and deploying to different environments.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (included with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hanooot_backend_template.git
cd hanooot_backend_template
```

### 2. Install Dependencies

- npm install

-------------------------------------------------------------------------------------

### 3. Build

- npm run build
- npm run build-watch

### 4. Run Locally

- npm run start
- npm run start-watch

To run locally with hot reloading you need to run this command
- npm run build-watch
- npm run start-watch

--------------------------------------------------------------------------------------
Make sure you have defined valid aws stake name region and parameters in package.json:

### 5. Deploy to Stage

- npm run deploy-stage

### 5. Deploy to Prod

- npm run deploy-prod