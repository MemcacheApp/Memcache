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

- [**Installation and Setup**](./docs/install_setup.md)
- [**Objectives and Features**](./docs/hello)
  - [Accounts and Authentication](./docs/accounts_auth.md)
  - [Content Saver](./docs/content_saver.md)
  - [Content Home](./docs/content_home.md)
  - [Tags and Collections](./docs/tags_collections.md)
  - [Content Summariser](./docs/content_summariser.md)
  - [Flash Card Generator and Interface](./docs/flashcard_generator.md)
  - [Spaced Repetition Review](./docs/spaced_repetition.md)
  - [Content Discovery](./docs/content_discovery.md)
- [**Troubleshooting and FAQs**](./docs/troubleshooting.md)
- [**Code Map**](./docs/codemap.md)

## :rocket: Quick Start

Getting started with Memcache is easy if you follow these steps:

### Application Setup (Node.js)

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

### Database Setup (Prisma)

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

## (Previous to be deleted) Prisma & Database

To set up prisma:

```bash
$ npx prisma generate
$ npx prisma migrate dev -- 3900DB # last argument "3900DB" is name of your local postgresql database
$ npx prisma db seed  # optional command to seed the database
```

The `npx prisma db seed` command will manually run the seed in `/src/server/db/seed.ts` to initialise the database with some initial data. Feel free to modify the seed data inside `seed.ts`. The command and path is specified in `package.json`:

```json
// package.json
{
    // ...
    "prisma": {
        "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} src/server/db/seed.ts"
    },
    //...
}
```

Alternative way to seed database; to reset the database to initial state using the seed data:

```bash
$ npx prisma migrate reset
```

The seed contains this entry in the User table:

```json
{
    "id": "483242390", // randomly generated uuidv4
    "firstName": "Ender",
    "lastName": "Man",
    "email": "admin@endermen.com",
    "password": "123456" // will be hashed before storing in db
}
```

You can login in using this seeded user's email and password. You will see some pre-made items in the inbox.

![](assets/admin-seeded-inbox.png)
