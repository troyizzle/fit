import { getServerAuthSession } from "~/server/auth";
import UserDropdownMenu from "./user-dropdown-menu";
import LoginButton from "./login-button";

export default async function Navbar() {
  const session = await getServerAuthSession()

  return (
    <nav className="max-w-7xl mx-auto h-16 p-1 m-1 border-b">
      <div className="flex flex-row items-center justify-between">
        <h1>Fit</h1>

        {session?.user ? <UserDropdownMenu user={session.user} /> : <LoginButton />}
      </div>
    </nav>
  )
}
