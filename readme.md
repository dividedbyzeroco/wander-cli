# Wander

Migrations for modern web apps

# Introduction

__Wander__ is a command-line tool that enables programmable database changes. Through __Migrations__, you can version control your database and easily `commit` or `revert` changes between versions.

# Getting Started

To get started, globally install `wander-cli`

```bash
> npm install -g wander-cli
```

# Initializing Wander

To initialize a new `wander` project, run `wander init` inside your project folder

```bash
> mkdir MyDatabase
> cd MyDatabase
> wander init
```

This will ask you for the name of your `migrations` folder (default: `./migrations`) and your database URI. Once completed, you can now start using wander.

# Creating a new Migration

To create a new migration, run `wander new <name>`.

```bash
> wander new create_post
```

This will create a new file inside your `migrations` folder

```markdown
+ migrations
  - v1_0_0__create_post.js
+ wrconfig.json
+ .gitignore
```

> Note that you can change the type of version that your new migration will use, using the `-t` or `--version-type` option.

```
{major}.{minor}.{patch}
```

__Version Commands:__
+ major: `wander new create_post -t major` (e.g. 2.0.0)
+ minor: `wander new crete_post -t minor` (e.g. 1.1.0)
+ patch: `wander new create_posrt -t patch` (e.g. 1.0.1)

Once created, the file would look similar to the following.

**v1_0_0__create_post.js**
```javascript
module.exports = {
    version() {
        return '1.0.0';
    },
    description() {
        return `Create post`;
    },
    async up({}) {
    },
    async down({}) {
    }
};
```

__Description__

+ The `version` method returns the version name of your migration.
+ The `description` method returns the a brief description of your database changes. You can expand this as you wish.
+ The `up` method runs whenever the migration is committed
+ The `down` method runs whenever the migration is reverted

For the `up` and `down` methods, a [MigrationOptions](#migration-options) object is passed to them for your usage.

For most of the migration, you will be using these `Migration Options` as your basis for making changes to the database.

__Example__

```javascript
module.exports = {
    version() {
        return '1.0.0';
    },
    description() {
        return `Create post`;
    },
    async up({ create, seed }) {
        create('post', table => {
            table.id();
            table.string('caption');
            table.timestamps();
        });

        seed('post', [
            { caption: 'New post!' },
            { caption: 'Another post!' }
        ]);
    },
    async down({ drop, clear }) {
        clear('post');
        drop('post');
    }
};
```

# API

# `Migration Options` object
## create(`tableName`: string, `definition`: function)

__Parameters__

| Paramter   | Data type                          |
| ---------- | ---------------------------------- |
| tableName  | string                             |
| definition | (table: [Table](#table)) => void   |

__Description__

+ Accepts a `tableName` that you want to create, and a definition function.
+ The definition function has a [Table](#table) parameter that allows you to define the structure of your table.

__Example__

```javascript
create('post', table => {
    table.id();
    table.string('caption');
    table.timestamps();
});
```

## alter(`tableName`: string, `definition`: function)

__Parameters__

| Paramter   | Data type                                |
| ---------- | ---------------------------------------- |
| tableName  | string                                   |
| definition | (table: [Table](#table-class)) => void   |

__Description__

+ Accepts a `tableName` that you want to alter, and a definition function.
+ The definition function has a [Table](#table-class) parameter that allows you to define the structure of your table.

__Example__

```javascript
alter('comment', table => {
    table.integer('comment_count').add();
});
```

## drop(`tableName`: string)

__Parameters__

| Paramter   | Data type                          |
| ---------- | ---------------------------------- |
| tableName  | string                             |

__Description__

+ Accepts a `tableName` that you want to drop.

__Example__

```javascript
drop('comment');
```

## seed(`tableName`: string, `seeds`: object[])

__Parameters__

| Paramter   | Data type                          |
| ---------- | ---------------------------------- |
| tableName  | string                             |
| seeds      | object[]                           |

__Description__

+ Accepts a `tableName` that you want to seed with data.
+ Accepts a `seeds` array of objects defining the data you want to insert.

> __NOTE:__ Only the columns of the first item in the list define the columns that will be populated.

__Example__

```javascript
seed('post', [
    { caption: 'A new post!' },
    { capton: 'Another post' }
]);
```

## clear(`tableName`: string)

__Parameters__

| Paramter   | Data type                          |
| ---------- | ---------------------------------- |
| tableName  | string                             |

__Description__

+ Accepts a `tableName` that you want to truncate.

__Example__

```javascript
clear('comment');
```

## execute(`query`: string)

__Parameters__

| Paramter   | Data type                          |
| ---------- | ---------------------------------- |
| query      | string                             |

__Description__

+ Ideal for running scripts that are too complex or are too specific to the database you are running.
+ Accepts a `query` that you want to execute.

> WARNING: Running execute is very dangerous especially if the keys and values you are trying to use are not properly escaped.

__Example__

```javascript
execute(`
    SET sql_safe_updates = 0;
    UPDATE post SET updated_at = now() WHERE id > 5;
`);
```


# `Table` class

__Description__

+ Allows you to define the structue of your table via different methods

__Methods__

+ id(`columnName`?: string) 
    - Adds a primary auto_increment key (default: `id`)
+ string(`columnName`: string, `length`?: number)
    - Adds a string column (e.g. on MySQL this is equivalent to `varchar`)
+ text(`columnName`: string)
    - Adds a text column (unlike string, there is no limit to the length)
+ integer(`columnName`: string, `length`?: number)
    - Adds an integer column
+ float(`columnName`: string, `length`?: number, `precision`?: number)
    - Adds a float column
+ decimal(`columnName`: string, `length`?: number, `precision`?: number)
    - Adds a decimal column
+ double(`columnName`: string, `length`?: number, `precision`?: number)
    - Adds a double column
+ pointer(`tableName`: string, `via`?: string)
    - Adds an integer column pointing to another table
    - `via`, by default, is `tableName`_`id`
+ date(`columnName`: string)
    - Adds a date column
+ dateTime(`columnName`: string)
    - Adds a datetime column
+ boolean(`columnName`: string)
    - Adds a boolean column (e.g. on MySQL this is equivalent to `bit`)
+ json(`columnName`: string)
    - Supported in `MySQL 5.7+`
+ timestamps()
    - Creates `created_at`, `updated_at` and `deleted_at` datetime columns
+ index(`columnName`: string, `alias`?: string)
    - Create an index on the table
+ unique(`columnName`: string, `alias`?: string)
    - Create a unique index on the table

## Key Actions

In addition, when using the `alter` option, the above methods have specific actions that need to be defined in order to let `wander` know how the columns are going to be changed.

+ add()
    - Add the column/index/unique key
+ modify()
    - Modify the column
+ drop()
    - Drop the column/index/unique key

__Example__    

```javascript
alter('comment', table => {
    table.integer('comment_count').add();
    table.index('IDENT').drop();
});
```

# Sample migration

```javascript
module.exports = {
    version() {
        return '1.0.0';
    },
    description() {
        return `Create post`;
    },
    async up({ create, alter, seed, execute }) {
        create('post', table => {
            table.string('caption', 500);
            table.pointer('user');
            table.json('info');
            table.string('identifier');
            table.index('identifier', 'IDENT');
        });

        // Equivalent to the following
        `
        CREATE TABLE post (
            id int PRIMARY KEY AUTO_INCREMENT,
            caption varchar(500),
            user_id int(11),
            info json,
            identifier varchar(30),
            INDEX IDENT (identifier)
        );
        `

        alter('comment', table => {
            table.integer('like_count').add();
            table.string('message', 250).modify();
            table.pointer('post').drop();
            table.index('IDENT').drop();
        });

        // Equivalent to the following
        `
        ALTER TABLE comment 
        ADD COLUMN like_count int,
        MODIFY COLUMN message varchar(250),
        DROP COLUMN post_id;
        `

        seed('post', [
            { caption: 'New caption!' },
            { caption: 'New caption!' },
            { caption: 'New caption!' }
        ]);

        // Equivalent to the following
        `
        INSERT INTO post
        (caption)
        VALUES
        ('New caption!'),
        ('New caption!'),
        ('New caption!');
        `

        execute(`
            SET sql_safe_updates = 0;
            UPDATE post SET privacy = 'public' WHERE role IS NULL;
        `);
    },
    async down({ alter, drop, truncate }) {

        truncate('post');
        drop('post');

        alter('comment', () => {
            this.integer('like_count').drop();
            this.string('message', 500).modify();
            this.pointer('post').add();
            this.index('identifier', 'IDENT').add();
        });

        execute(`UPDATE post SET privacy = 'private' WHERE role IS NULL`);
    }
};
```

# Up versus Down

In terms of the `Migrations` standard for databases, the convention is to always have `up` and `down` methods. 

The purpose of the `up` method is to commit the changes you want to apply for the database. Conversely, it is required that you undo everything that you performed in the `up` method inside the `down` method.

The reason why this practice is maintained is that it allows you, to some extent, recover from a breaking change that was executed accidentally. Also, it allows you to ensure consistency when changing between database versions.

Do note, however, that unless a `seed` option is defined inside the methods, any data that was __cleared__ or __dropped__ will be __lost__ forever.

# Transactions

For `wander`, all migrations are executed as a single transaction. That means the MigrationOptions you used will not be fired until the processor has gone through all of them. 

That also means that if anything goes wrong, the scripts will be rolled back (except for cases where database auto-commits occur. See the corresponding manuals of your databases for more information).