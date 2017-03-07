// import field from './@decorator/field';
// import fieldOn from './@decorator/fieldOn';
// import exclude from './@decorator/exclude';
// import query from './@decorator/query';

// import schemaStore from './schemaStore';

// class Assessment {
//   @field('String')                                                   id;
//   @field('Date')                                                     createdAt;
//   @field('Date')                                                     updatedAt;
//   @field('String')                                                   role;
//   @field('String', 'username')                                       name;
//   @field({
//     address: 'String',
//     verified: 'String'
//   }, 'emails')                                                       myEmails;
//   @field({
//     type: 'String',
//     streetName: 'String',
//     streetNumber: 'String',
//     floor: 'String',
//     unit: 'String',
//     city: 'String',
//     country: {
//       code: 'String',
//       description: 'String',
//     },
//     postCode: 'String'
//   })                                                                 addresses;

//   // @fieldOn({ a: 'String', b: { c: 'String', d: 'String' } }, 'asdf') oyoyo;
//   // @fieldOn('String', ['asdf', 'sss'])                                ayaya;


//   @query('user', 'Assessment')
//   @exclude(['name'])
//   static get(id) {
//     return { id };
//   }
// }

// console.log(schemaStore.Assessment.composeToString([]).join('\n'));

// Assessment.get("NTgyZDVhZDEyNjQ1YjcyMGIzN2Q4YTEx").then((res) => {
//   debugger
//   console.log(res);
// });



import AdminProgram from './AdminProgram';

async function entry() {
  const programs = await AdminProgram.adminProgramList();

  console.log(programs);

}

entry();

