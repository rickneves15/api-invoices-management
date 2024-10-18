<h1 align="center">Welcome to API Invoices Management 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> API for managing electrical energy bills with data extraction from PDFs.

## Requirements

- Node v18.0.0 or higher
- Docker (optional)

## Install

```sh
yarn install
yarn migrate:dev
yarn prisma:generate
```

## Environment variables

Configuration variables for the API.

```sh
cp .env.example .env
```

## Usage

```sh
yarn start:dev
```

## Run tests

```sh
yarn test
```

## Author

👤 **Richard neves**

- Website: <https://richard-neves.vercel.app/>
- Github: [@rickneves15](https://github.com/rickneves15)
