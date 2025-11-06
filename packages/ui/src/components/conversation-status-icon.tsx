import { ArrowRightIcon, CheckIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { resolve } from 'path';

interface ConversationStatusIconProps {
  status: 'unresolved' | 'resolved' | 'escalated';
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bgcolor: 'bg-[#3FB62F]',
  },
  unresolved: {
    icon: ArrowRightIcon,
    bgcolor: 'bg-destructive',
  },
  escalated: {
    icon: ArrowUpIcon,
    bgcolor: 'bg-yellow-500',
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full p-1.5',
        config.bgcolor,
      )}
    >
      <Icon className="size-3 stroke-3 text-white" />
    </div>
  );
};
