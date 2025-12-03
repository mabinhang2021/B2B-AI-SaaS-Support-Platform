'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { useOrganization } from '@clerk/nextjs';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { IntegrationId, INTEGRATIONS } from '../../constants';
import Image from 'next/image';
import { useState } from 'react';
import { createScript } from '../../utils';

export const IntegrationsView = () => {
  const [DialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState('');
  const { organization } = useOrganization();

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) return;
    const snippet = createScript(organization.id, integrationId);
    setSelectedSnippet(snippet);
    setIsDialogOpen(true);
  };

  const handleCopy = async () => {
    if (!organization) {
      toast.error('No organization selected');
      return;
    }
    try {
      await navigator.clipboard.writeText(organization.id);
      toast.success('Organization ID copied to clipboard');
    } catch {
      toast.error('Failed to copy Organization ID');
    }
  };

  return (
    <>
      <IntegrationsDialog
        open={DialogOpen}
        onOpenChange={setIsDialogOpen}
        snippet={selectedSnippet}
      />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Setup and Integrations</h1>
            <p className="text-muted-foreground">
              Choose the integration that&apos;s right for you
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <Label className="w-34" htmlFor="organization-id">
                OrganIzation ID
              </Label>
              <Input
                disabled
                readOnly
                id="organization-id"
                value={organization?.id || ''}
                className="flex-1 bg-background font-mono text-sm"
              />
              <Button size="sm" className="gap-2" onClick={handleCopy}>
                <CopyIcon className="size-4" />
                Copy
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <div className="space-y-1">
              <Label className="text-lg">Integrations</Label>
              <p className="text-muted-foreground text-sm">
                Add the following code to your website to enable chat box
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  className="flex items-center gap-4 rounded-lg border p-4
                bg-background hover:bg-accent"
                >
                  <Image
                    src={integration.icon}
                    alt={integration.title}
                    width={40}
                    height={40}
                  />
                  <p>{integration.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const IntegrationsDialog = ({
  open,
  onOpenChange,
  snippet,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success('Code snippet copied to clipboard');
    } catch {
      toast.error('Failed to copy code snippet');
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integration with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add chat box to your website:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              1. Copy the following code snippet:
            </div>
            <div className="group relative">
              <pre
                className="max-h-[300px] overflow-x-auto overflow-y-auto
                    rounded-md bg-foreground p-2 font-mono text-sm break-all
                    whitespace-pre-wrap text-secondary"
              >
                {snippet}
              </pre>
              <Button
                className="absolute top-4 right-6 size-6 opacity-0
                        transition-opacity group-hover:opacity-100"
                variant="secondary"
                size="icon"
                onClick={handleCopy}
              >
                <CopyIcon className="size-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              2.Add the code to your page
            </div>
            <p className="text-muted-foreground text-sm ">
               Paste the chat box code above into your page.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
