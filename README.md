# Memcache 
#### *COMP3900 | W16Bendermen | 23T2*

A dedicated application designed to *organise your saved internet content* and *generate revision materials* to enhance online learning.

## :busts_in_silhouette: Contributors

- **Gordon Huang [(diary)](./diaries/z5359836.md)**
- **Haopeng Luo [(diary)](./diaries/z5339246.md)**
- **Max Xue [(diary)](./diaries/z5267325.md)**
- **Oscar Halford [(diary)](./diaries/z5157090.md)**
- **William Zhang (Scrum Master) [(diary)](./diaries/z5367957.md)**

## :book: Documentation

Detailed documentation and instructions for the app can be found as follows:

- [**Installation and Setup**](./docs/hello)
- [**Objectives and Features**](./docs/hello)
  - [Accounts and Authentication](./docs/hello)
  - [Content Saver](./docs/hello)
  - [Content Home](./docs/hello)
  - [Tags and Collections](./docs/hello)
  - [Content Summariser](./docs/hello)
  - [Flash Card Generator and Interface](./docs/hello)
  - [Spaced Repetition Review](./docs/hello)
  - [Content Discovery](./docs/hello)
- [**Troubleshooting and FAQs**](./docs/hello)
- [**Code Map**](./docs/hello)

## :rocket: Quick Start

Getting started with Memcache is easy if you follow these steps:

#### Application Setup (Node.js)

First, here's how to install Memcache locally (make sure you have **Node.js** installed)

1. Clone the Memcache repository:

    ```bash
    $ git clone https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w16bendermen.git
    ```

2. Navigate to the Memcache folder:

    ```bash
    $ cd capstone-project-3900w16bendermen
    ```

3. Install all the required dependencies:

    ```bash
    $ npm install
    ```

4. Begin the server:

    ```bash
    $ npm run start
    ```

And with all of that completed, the app should now be running on `http://localhost:3000`. 

#### Database Setup (Prisma)

Second, set up prisma with the following commands

```bash
$ npx prisma generate
$ npx prisma migrate dev -- [LOCALDB] # "LOCALDB" is name of your local postgresql database
```

Optionally, you can seed the database

```bash
$ npx prisma db seed
```

The seed command initialises the database with data located at /src/server/db/seed.ts. Modify this seed data as required. 

The seeded data also has the following default user:

```json
{
    "email": "admin@endermen.com",
    "password": "123456" 
}
```

