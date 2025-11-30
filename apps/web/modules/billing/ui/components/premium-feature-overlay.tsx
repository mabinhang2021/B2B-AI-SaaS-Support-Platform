'use client';

import {
  type LucideIcon,
  BookOpenIcon,
  BotIcon,
  GemIcon,
  MicIcon,
  PaletteIcon,
  PhoneIcon,
  UsersIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface PremiumFeatureOverlayProps {
  children: React.ReactNode;
}
const features: Feature[] = [
  {
    icon: BotIcon,
    label: 'AI Customer Support',
    description:
      'Provide instant and accurate responses to customer by 24/7 ',
  },
  {
    icon: MicIcon,
    label: 'AI Voice Agent',
    description:"Natural voice conversations with customers"
  },
  {
    icon:PhoneIcon,
    label:"Phone System",
    description:"Inbound and outbound call management"
  },
  {
    icon:BookOpenIcon,
    label:"Knowledge Base",
    description:"Centralized repository for articles and FAQs"
  },
  {
    icon:UsersIcon,
    label:"Team Access",
    description:"Shared pro features for team members"
  },
  {
    icon:PaletteIcon,
    label:"Widget Customization",
    description:"Customize your only widget to match your brand"
  }

];

export const PremiumFeatureOverlay = ({
  children,
}: PremiumFeatureOverlayProps) => {
   const router = useRouter(); 
  return (
    <div className="relative min-h-screen">
      {/* Blurred background content */}
      <div className="pointer-events-none select-none blur-[2px]">
        {children}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      {/* Upgrade prompt */}
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
                <GemIcon className="size-6 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Premium Feature</CardTitle>
            <CardDescription>
              This feature is available for Pro plan users. 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                    <feature.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className='font-medium text-sm'>{feature.label}</p>
                    <p className='text-xs text-muted-foreground'>{feature.description}</p>
                    
                  </div>
                </div>
              ))}
            </div>
            <Button 
                className='w-full'
                onClick={() => router.push('/billing')}
                size="lg"
            >View Plans</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
