import { Outlet, Navigate } from "react-router";

import {
  CircleUserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useNavigate } from 'react-router';
import { useAuthStore } from "@/store/auth";

export default function ProtectedLayout() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Items:
  // submitted quizzes
  // created quizzes
  // separator
  // profile
  // separator
  // logout

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className="protected-layout">
      <div className="w-full h-16 bg-gray-300">
        <div className="w-full flex justify-end p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-lg" aria-label="Profile" className="rounded-full">
                <CircleUserRound className="size-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => {
                  const path = `/`;
                  navigate(path);
                }}>
                  Submitted Quizzes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const path = `/created-quizzes`;
                  navigate(path);
                }}>
                  Created Quizzes
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => {
                  const path = `/profile`;
                  navigate(path);
                }}>
                  Profile
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive" onClick={() => {
                  handleLogout();
                }}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>

      {/* Shared for protected pages */}
      <Outlet />
    </div>
  );
}