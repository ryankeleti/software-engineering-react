import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllUsers} from "../services/users-service";
import axios from "axios";

test('user list renders async', async () => {
  const users = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>);
  const linkElement = screen.getByText(/NASA/i);
  expect(linkElement).toBeInTheDocument();
})
