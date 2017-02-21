import field from './@decorator/field';
import nestedField from './@decorator/nestedField';
import query from './@decorator/query';

import schemaStore from './schemaStore';

class Assessment {
  @field('String')                                  id;
  @field('Date')                                    createdAt;
  @field('Date')                                    updatedAt;
  @field('String')                                  role;
  @field('String')                                  username;
  @field('String', { flatten: 'emails.address' })   email;
  @field('String', { flatten: 'emails.verified' })  verified;
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
  })                                                addresses;



  @query('user', 'Assessment')
  static get(id) {
    return { id };
  }
}

console.log(schemaStore);

Assessment.get("NTgyZDVhZDEyNjQ1YjcyMGIzN2Q4YTEx").then((res) => {
  debugger
  console.log(res);
});





