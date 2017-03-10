# graph-entity
visit graphql backend through entity object interface

define your entity like:
```js
class User {
  @field('ID')      id;
  @field('Date')    createdAt;
  @field('Date')    updatedAt;
  @field('String')  name;
  @field('String')  description;
  @field('String')  status;
  @field('Profile') profile;

  @query('userlist', { list: 'User' })
  @exclude(['list.profile'])
  static getAll() {
    return {};
  }

  @query('getUser', 'User')
  static get(id) {
    return { id };
  }
}
```