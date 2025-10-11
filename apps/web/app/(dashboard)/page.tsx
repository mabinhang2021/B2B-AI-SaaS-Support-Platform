'use client';
import { Button } from '@workspace/ui/components/button';
import { Authenticated, Unauthenticated } from 'convex/react';
import { add } from '@workspace/math/add';
import { Input } from '@workspace/ui/components/input';
import { OrganizationSwitcher, SignInButton, UserButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { User } from 'lucide-react';
export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Hello,apps/web</h1>
            <OrganizationSwitcher hidePersonal/>
            <Button onClick={() => addUser()} size="sm">
              Press this button, add the user,page web
            </Button>
            <UserButton/>
            <p>{add(2, 2)}</p>
            <Input placeholder="Input" />
            {JSON.stringify(users)}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>must sign in</p>
        <SignInButton>Please sign in</SignInButton>
      </Unauthenticated>
    </>
  );
}
