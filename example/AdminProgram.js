import graphEntity from './graphEntityClient';

const { field, query } = graphEntity;

export default class AdminProgram {
  @field('ID')      id;
  @field('Date')    createdAt;
  @field('Date')    updatedAt;
  // @field()                creator;

  // @field('String') organization: Organization

  @field('String')  name;
  @field('String')  description;
  @field('String')  status;
  @field('String')  healthCondition;
  // @field('String') tasks: [Task]
  // @field('String') devices: [Device]
  @field({
    length: 'Number',
    calendar: 'String'
  })                duration;


  @query('adminProgramList', {
    data: 'AdminProgram',
    pageInfo: { total: 'Number', lastPage: 'Number' }
  })
  static adminProgramList(id) {
    return {
      page: 1,
      count: 100,
      options: {},
      sort: {}
    };
  }
}
