import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_USERS = [
  { username: "alice", password: "alice123", email: "alice@tuiter.com", _id: "123" },
  { username: "bob", password: "bob123", email: "bob@tuiter.com", _id: "456" },
  { username: "charlie", password: "charlie123", email: "charlie@tuiter.com", _id: "789" }
];

const MOCKED_TUITS = [
  { tuit: "alice's tuit", postedBy: "123" },
  { tuit: "bob's tuit", postedBy: "456" },
  { tuit: "charlie's tuit", postedBy: "789" }
];

test('tuit list renders static tuit array', () => {
  render(
    <HashRouter>
      <Tuits tuits={MOCKED_TUITS}/>
    </HashRouter>);
  const linkElement = screen.getByText(/alice/i);
  expect(linkElement).toBeInTheDocument();
});


test('tuit list renders mocked', async () => {
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
    <HashRouter>
      <Tuits tuits={tuits}/>
    </HashRouter>);
  const linkElement = screen.getByText(/alice/i);
  expect(linkElement).toBeInTheDocument();
});
