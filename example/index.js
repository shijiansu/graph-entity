import User from './User';

async function entry() {
  // get list
  const users = await User.getAll();

  // get specific user
  const user = await User.get(users.list[0].id);

  // edit user
  user.name = 'new test';
  user.description = 'new test description';

  // save user
  user.save();

  console.log(user);

}

entry();

