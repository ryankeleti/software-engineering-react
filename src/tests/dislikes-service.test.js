import {
    createUser,
    deleteUsersByUsername, findAllUsers,
    findUserById
} from "../services/users-service";
import {
    findAllTuits, findTuitById, findTuitByUser,
    createTuit, updateTuit, deleteTuit
} from "../services/tuits-service";
import {
  findAllTuitsDislikedByUser, findAllUsersThatDislikedTuit, userDislikesTuit
} from "../services/likes-service";

describe('dislike tuit with REST API', () => {
  // sample user to insert
  const author = {
    username: 'tuit-author',
    password: 'complex-password',
    email: 'author@tuiter.com'
  };
 
  // sample tuit
  const tuit = {
    tuit: 'New tuit created!'
  };

  var userId;
  var tuitId;

  // setup test before running test
  beforeAll(async () => {
    // remove any/all users to make sure we create it in the test
    deleteUsersByUsername(author.username);
    
    // insert new user in the database
    const newUser = await createUser(author);
    userId = newUser._id;

    // insert new tuit
    const newTuit = await createTuit(newUser._id, tuit);
    tuitId = newTuit._id;

    // verify inserted tuit's properties match parameter tuit 
    expect(newTuit.tuit).toEqual(tuit.tuit);
    expect(newTuit.postedBy).toEqual(newUser._id);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteTuit(tuitId);
    return deleteUsersByUsername(author.username);
  })

  test('can dislike tuit', async () => {
    const originalTuit = await findTuitById(tuitId);
    expect(originalTuit.stats.dislikes).toEqual(0);
    await userDislikesTuit(userId, tuitId);
    const updatedTuit = await findTuitById(tuitId);
    expect(updatedTuit.stats.dislikes).toEqual(1);
  });
  
  test('can undislike tuit', async () => {
    const dislikedTuit = await findTuitById(tuitId);
    expect(dislikedTuit.stats.dislikes).toEqual(1);
    await userDislikesTuit(userId, tuitId);
    const updatedTuit = await findTuitById(tuitId);
    expect(updatedTuit.stats.dislikes).toEqual(0);
  });

  test('can find disliked tuits', async () => {
    await userDislikesTuit(userId, tuitId);
    const dislikedTuits = await findAllTuitsDislikedByUser(userId);
    expect(dislikedTuits[0]._id).toEqual(tuitId);
  });

  test('can find users that disliked tuit', async () => {
    const usersDisliked = await findAllUsersThatDislikedTuit(tuitId);
    expect(usersDisliked[0]._id).toEqual(userId);
  });
});


