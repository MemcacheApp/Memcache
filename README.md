# capstone-project-3900w16bendermen
capstone-project-3900w16bendermen created by GitHub Classroom

## Prisma & Database

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