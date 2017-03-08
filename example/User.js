import graphEntity from './graphEntityClient';

const { field, query, mutate, exclude } = graphEntity;

class Profile {
  @field('String') firstName;
  @field('String') lastName;
}

export default class User {
  @field('ID')      id;
  @field('Date')    createdAt;
  @field('Date')    updatedAt;
  @field('String')  name;
  @field('String')  description;
  @field('String')  status;
  @field('Profile') profile;
  @field({
    length: 'Number',
    calendar: 'String'
  })                duration;


  @query('userlist', { list: 'User' })
  @exclude(['list.profile'])
  static getAll() {
    return {};
  }

  @query('getUser', 'User')
  static get(id) {
    return { id };
  }

  @mutate('editUser', 'User')
  save() {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    }
  }
}

