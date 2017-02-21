import field from './@decorator/field';
import nestedField from './@decorator/nestedField';
import query from './@decorator/query';

import schemaStore from './schemaStore';

class Assessment {
  @field('String', { on: 'asdf' })             id;
  @field('Number', { flatten: 'profile.age' }) age;
  @field('Number', { flatten: 'profile.yo.height' }) height;
  @field('Number', { flatten: 'profile.yo.weight' }) weight;
  @nestedField({
    type: 'String',
    streetName: 'String',
    streetNumber: 'String',
    floor: 'String',
    unit: 'String',
    city: 'String',
    country: {
      code: 'String',
      description: 'String',
    },
    postCode: 'String'
  })                                           addresses;



  @query('queryName', {
    data: 'Assessment',
    pageInfo: { page: 'Number' }
  })
  static get(id) {
    return {id};
  }
}

var ass = new Assessment();
ass.id = '1';
console.log(schemaStore);
console.log(ass.id);
Assessment.get(1);
