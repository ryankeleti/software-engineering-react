import {
  createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";
import {
  findAllTuits, findTuitById, findTuitByUser,
  createTuit, updateTuit, deleteTuit
} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
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

  var tuitId;

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    return deleteUsersByUsername(author.username);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteTuit(tuitId);
    return deleteUsersByUsername(author.username);
  })

  test('can create tuit with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(author);

    // insert new tuit
    const newTuit = await createTuit(newUser._id, tuit);
    tuitId = newTuit._id;

    // verify inserted tuit's properties match parameter tuit 
    expect(newTuit.tuit).toEqual(tuit.tuit);
    expect(newTuit.postedBy).toEqual(newUser._id);
  });
});

describe('can delete tuit wtih REST API', () => {
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

  var tuitId;

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    deleteUsersByUsername(author.username);
    return createUser(author);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteTuit(tuitId);
    return deleteUsersByUsername(author.username);
  })

  test('can delete tuit with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(author);

    // insert new tuit
    const newTuit = await createTuit(newUser._id, tuit);
    tuitId = newTuit._id;

    // delete a tuit by id. Assumes tuit already exists
    const status = await deleteTuit(tuitId);

    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
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

  var tuitId;

  // setup test before running test
  beforeAll(() => {
    // remove any/all users to make sure we create it in the test
    deleteUsersByUsername(author.username);
    return createUser(author);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteTuit(tuitId);
    return deleteUsersByUsername(author.username);
  })

  test('can retrieve tuit with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(author);

    // insert new tuit
    const newTuit = await createTuit(newUser._id, tuit);
    tuitId = newTuit._id;

    // find a tuit by id. Assumes tuit already exists
    const retrievedTuit = await findTuitById(tuitId);

    // verify we retrieved the right tuit
    expect(retrievedTuit._id).toEqual(newTuit._id);
    expect(retrievedTuit.postedBy._id).toEqual(newTuit.postedBy);
    expect(retrievedTuit.postedOn).toEqual(newTuit.postedOn);
    expect(retrievedTuit.tuit).toEqual(newTuit.tuit);
  });
});

describe('can retrieve all tuits with REST API', () => {
  // sample user to insert
  const author = {
    username: 'tuit-author',
    password: 'complex-password',
    email: 'author@tuiter.com'
  };
 
  var createdTuits;

  beforeAll(() => {
    createdTuits = [];
    return deleteUsersByUsername(author.username);
  })

  // clean up after test runs
  afterAll(() => {
     createdTuits.map(tuit => deleteTuit(tuit._id));
     return deleteUsersByUsername(author.username);
  })

  test('can retrieve all tuits with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(author);

    // insert new tuits
    for (let i = 0; i < 10; i++) {
      createdTuits.push(await createTuit(newUser._id, { tuit: `Tuit number ${i}` }));
    }

    // get all tuits
    const tuits = await findAllTuits();

    // verify at least our new tuits came back
    expect(tuits.length).toBeGreaterThanOrEqual(createdTuits.length);

    // get tuits inserted
    const tuitsInserted = tuits.filter(tuit => tuit.postedBy && tuit.postedBy._id === newUser._id);

    // verify properties of returned tuits
    tuitsInserted.forEach(tuit => {
      expect(tuit.postedBy.username).toEqual(author.username);
      expect(tuit.tuit).toEqual(expect.stringContaining('number'));
    });
  });
});
