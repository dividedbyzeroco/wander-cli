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

> Note that you can change the version step that your new migration will take using the `-t` or `--version-type` option.

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

+ The `version` method returns the version name of your migration.
+ The `description` method returns the a brief description of your database changes. You can expand this as you wish.
+ The `up` method runs whenever the migration is committed
+ The `down` method runs whenever the migration is reverted

For the `up` and `down` methods, the function accepts a `MigrationOptions` object that has the following functions.

### `create(tableName: string, definition: (table: Table) => {})`

Accepts a `tableName` that you want to create, and a definition function.
The definition function has a `Table` parameter that allows you to define the columns of your table.

__Table__

+ id() `Creates a primary auto_increment id`
+ string(columnName: string, length?: number)
+ integer(columnName: string, length?: number)
+ float(columnName: string, length?: number, precision?: number)
+ decimal(columnName: string, length?: number, precision?: number)
+ double(columnName: string, length?: number, precision?: number)
+ pointer(tableName: string) `A foreign key to another table`
+ date(columnName: string)
+ dateTime(columnName: string)
+ boolean(columnName: string)
+ json(columnName: string) `Supported in MySQL 5.7+`
+ timestamps `Creates created_at, updated_at and deleted_at`

Sample Usage

```javascript
create('post', table => {
    table.id();
    table.string('caption');
    table.string('photo', 500);
    table.pointer('user');
    table.timestamps();
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
            table.index('IDENT', 'identifier');
        });

        // Equivalent to the following
        `
        CREATE TABLE post (
            id INT(11) PRIMARY KEY AUTO_INCREMENT,
            caption VARCHAR(500),
            user_id INT(11),
            post_id INT(11),
            info JSON,
            identifier VARCHAR(30)
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
        ALTER TABLE comment ADD COLUMN like_count INT(11);
        ALTER TABLE comment MODIFY COLUMN message VARCHAR(250);
        ALTER TABLE comment DROP COLUMN post;
        `

        seed('post', [
            { caption: 'New caption!' },
            { caption: 'New caption!' },
            { caption: 'New caption!' }
        ]);

        execute(`UPDATE post SET privacy = 'public' WHERE role IS NOT NULL;`);
    },
    async down({ alter, drop, truncate }) {

        truncate('post');
        drop('post');

        alter('comment', () => {
            this.drop('like_count');
            this.modify('message').string(500);
            this.add('post_id').pointer();
            this.index('IDENT', 'identifier');
        });

        execute(`UPDATE post SET privacy = 'private' WHERE role IS NOT NULL`);
    }
};
```