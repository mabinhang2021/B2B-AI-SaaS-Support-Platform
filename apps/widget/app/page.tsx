"use client";
import { Button } from '@workspace/ui/components/button';

import { add } from '@workspace/math/add';
import { Input } from '@workspace/ui/components/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello,apps/widget</h1>
        <Button onClick={() => addUser()} size="sm">
          Press this button, add the user,page widget
        </Button>
        <p>{add(4, 2)}</p>
        <Input placeholder="Input" />
        {JSON.stringify(users)}
      </div>
    </div>
  );
}
