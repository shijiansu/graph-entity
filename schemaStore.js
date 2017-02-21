// This is used for storing the schema tree.
//
// TODO: It's single instance per app now
//
// {
//   // Assessment is class identifier of an entity
//   // has relation to $$_GE_display_name but not readable
//   Assessment: {
//     $$_GE_constructor: Assessment,
//     $$_GE_display_name: 'Assessment',
//     id: { type: 'String', path: 'id' },
//     user: { type: 'User', path: 'user', on: 'asdfasdf' },
//     answerText: { type: 'String', path: 'answer.title.text' }
//   }
// }

export default {};
