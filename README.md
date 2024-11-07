# Project Name: Book Management API

## Overview

This project is a **Book Management API** built with **NestJS** and **MongoDB**. It allows users to manage books and topics, including creating, updating, deleting, and retrieving books and topics with various filters. The API is designed with RESTful principles and supports pagination for retrieving large sets of data.

## Table of Contents

1. [Features](#features)
2. [Technologies](#technologies)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Run Tests](#run-tests)

## Features

- **Books Management**: Create, read, update, and delete books.
- **Topic Management**: Create, read, update, and delete topics.
- **Filtering**: Filter books by topic name.
- **Pagination**: Supports pagination for books and topics.
- **Populating Relationships**: Populates topic details in books.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable applications.
- **MongoDB**: A NoSQL database used to store the books and topics.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Swagger**: Used for API documentation and testing.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Remote Cluster)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Khushali-Dhami/book-topic-apis.git
   ```

## Environment Variables

- "example.env" file is given for reference, for placing necessary env variables.

## Run Tests

- Install the packages using **npm install**

- Then run:

```bash
    npm run start

```
