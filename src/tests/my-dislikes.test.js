import MyDislikes from "../components/profile/my-dislikes";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import * as service from "../services/likes-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_TUITS = [
  { tuit: "alice's tuit", postedBy: "123",
    stats: { replies: 0, retuits: 0, likes: 1, dislikes: 1 }},
  { tuit: "bob's tuit", postedBy: "456",
    stats: { replies: 0, retuits: 0, likes: 1, dislikes: 2 }},
  { tuit: "charlie's tuit", postedBy: "789",
    stats: { replies: 0, retuits: 0, likes: 0, dislikes: 1 }},
];

test('tuit list renders static dislikes tuit array', () => {
  render(
    <HashRouter>
      <MyDislikes tuits={MOCKED_TUITS}/>
    </HashRouter>);
  const linkElement =  screen.getByText(/alice/i);
  expect(linkElement).toBeInTheDocument();
});


test('tuit list renders mocked dislikes', async () => {
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
  const response = await service.findAllTuitsDislikedByUser("123")
  const tuits = response.tuits;

  render(
    <HashRouter>
      <MyDislikes tuits={tuits}/>
    </HashRouter>);
  const linkElement = screen.getByText(/alice/i);
  expect(linkElement).toBeInTheDocument();
});

