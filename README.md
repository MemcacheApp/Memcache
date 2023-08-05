# Memcache

#### _COMP3900 | W16Bendermen | 23T2_

A dedicated application designed to _organise your saved internet content_ and _generate revision materials_ to enhance online learning.

## :busts_in_silhouette: Contributors

-   **Gordon Huang [(diary)](./diaries/z5359836.md)**
-   **Haopeng Luo [(diary)](./diaries/z5339246.md)**
-   **Max Xue [(diary)](./diaries/z5267325.md)**
-   **Oscar Halford [(diary)](./diaries/z5157090.md)**
-   **William Zhang (Scrum Master) [(diary)](./diaries/z5367957.md)**

## :book: Documentation

Detailed descriptions of app features can be found as follows:

-   [Accounts and Authentication](./docs/accounts_auth.md)
-   [Content Saver](./docs/content_saver.md)
-   [Content Home](./docs/content_home.md)
-   [Tags and Collections](./docs/tags_collections.md)
-   [Content Summariser](./docs/content_summariser.md)
-   [Flash Card Generator and Interface](./docs/flashcard_generator.md)
-   [Spaced Repetition Review](./docs/spaced_repetition_review.md)
-   [Content Discovery](./docs/content_discovery.md)

## :rocket: Quick Start (Method 1: Docker)

We first need to set up the environment variables, so in the root directory create a new file called `.env`

```
vi .env
```

From there, we need to define the database as well as the OpenAI key by adding the following lines to `.env`:

```
DATABASE_URL="postgres://postgres:postgres@db:5432/3900DB"
OPENAI_API_KEY="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"
```

After saving the above, in the root directory, we need to build and run the Docker Container, using the following command:

```
docker-compose up --build
```

On completion of the command, Memcache should be hosted and running on `http://localhost:3000/`. Therefore, open the link in Google Chrome to access Memcache. 

If you want to exit Memcache, simply use the command `Ctrl + C` and Docker will exit. 

Running Memcache again, after building for the first time, all you need to do is use the command: 

```
docker-compose up
```

## :rocket: Quick Start (Method 2: Running on the Lubuntu 20.04.1 LTS virtual machine)

1. Change the current working directory to the root folder of the project.

```
cd /path/to/project-root
```

2. Install required system packages.

```
sudo apt update && sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql
```

You may need to enter your user password when prompted during this process.

3. Install required npm dependencies.

```
npm i
```

4. Create a new postgres database and user.

```
sudo -u postgres -i
createdb 3900DB
createuser lubuntu
psql
alter user lubuntu with encrypted password '<password>';
grant all privileges on database 3900DB to lubuntu;
alter user lubuntu createdb;
```
Then press Ctrl+D twice to exit subshells.

5. Set up environment variables in .env. This is the same as method 1, but replace username and password to the ones you just set.

In `.env`:
```
DATABASE_URL="postgres://lubuntu:<password>@localhost:5432/3900DB"
OPENAI_API_KEY="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"
```

6. Initialise the database.

```
npx prisma migrate reset
```

You may need to press ‘y’ when prompted during this process.

7. Build and run.

```
npm run build
npm run start
```

Done! Memcache should be hosted and running on `http://localhost:3000/`.

## :rocket: Quick Start (Method 3: Standard)

Getting started with Memcache is easy if you follow these steps:

### PostgreSQL Database

Start a local PostgreSQL server and note the port and database name, you will need these for setting environment variables and Prisma

### Application Setup (Node.js)

First, here's how to install Memcache locally (make sure you have **Node.js** installed)

1. Clone the Memcache repository:

    ```bash
    $ git clone https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w16bendermen.git
    ```

1. Navigate to the Memcache folder:

    ```bash
    $ cd capstone-project-3900w16bendermen
    ```

1. Environment variables

    In `.env`:

    - set `DATABASE_URL` to the url of your local postgresql server.
    - set `NODE_ENV` to either:
        - `"development"` if you are developing the application. `OPENAI_API_KEY` is not required, placeholder text will be used in place of AI-generated content
        - `"production"` or `"test"` if you are deploying or testing the application. `OPENAI_API_KEY` is required, app will use OpenAI API to assist in generating summaries and flashcards.
    - set `OPENAI_API_KEY` to your OpenAI API key

1. Install all the required dependencies:

    ```bash
    $ npm install
    ```

1. Build the project:

    ```bash
    $ npm run build
    ```

1. Begin the server:

    ```bash
    $ npm run start
    ```

And with all of that completed, the app should now be running on `http://localhost:3000`.

Note that you will need to setup Prisma ORM by following the next section before starting the server.

### Prisma ORM Setup

Prisma is a tool for converting between tables in a relational database (such as PostgreSQL) and objects in languages such as TypeScript.

Set up Prisma with the following commands

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

## Troubleshooting the Docker container

- Delete your `.next` folder which contains the build and restart the Docker container
- Delete the Docker container via the desktop app and restart

![Delete Docker ccontainer](../assets/../capstone-project-3900w16bendermen/assets/delete-docker-container.png)