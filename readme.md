Sample directory
----------------

+ migrations
  - v1_1_0__create_post.js
  - v1_2_0__create_comment.js
+ wrconfig.json
+ schema.js

create_post.js
--------------

```javascript
module.exports = {
    version() {
        return '1.0.0';
    },
    description() {
        return `
            Created the initial database structure.
            For more info, visit www.wanderjs.com
        `;
    },
    async up({ create, alter, seed, execute }) {
        create('post', table => {
            table.string('caption', 500);
            table.pointer('user');
            table.json('info');
            table.string('identifier');
            table.index('IDENT', 'identifier');
        });

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

| version        | description                | checksum                     | commited_at              | reverted_at           |
| -------------- | -------------------------- | ---------------------------- | ------------------------ | --------------------- |
| 1.0.0          | Initial tables             | r4hfUF2r89g4r9t2fu8313       | 2018-04-08 13:00:00      | 2018-04-09 14:00:00   |

```bash
> wander help
> wander init
> wander new --name=create_posts
> wander commit
> wander revert --top=5
> wander reset
> wander refresh
```