'use client';
import Bowser from 'bowser';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { api } from '@workspace/backend/_generated/api';
import { DicebearAvatar } from '@workspace/ui/dicebear-avatar';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { Id } from '@workspace/backend/_generated/dataModel';
import { useMemo } from 'react';
import { getCountryForTimezone } from 'countries-and-timezones';
import { getCountryFlagURL } from '@/lib/country-utils';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { ClockIcon, GlobeIcon, MailIcon, MonitorIcon } from 'lucide-react';

type InfoItem = {
  label: string;
  value: string | React.ReactNode;
  classname?: string;
};

type InfoSection = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
};

export const ContactPanel = () => {
  const params = useParams();
  const conversationId = params.conversationId as Id<'conversations'>;

  const contactSession = useQuery(
    api.private.contactSessions.getOneByConversationId,
    {
      conversationId,
    },
  );
  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent)
        return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };

      const browser = Bowser.getParser(userAgent);
      const result = browser.getResult();
      return {
        browser: result.browser.name || 'unknown',
        browserVersion: result.browser.version || 'unknown',
        os: result.os.name || 'unknown',
        osVersion: result.os.version || 'unknown',
        device: result.platform.type || 'desktop',
        deviceModel: result.platform.model || '',
        deviceVendor: result.platform.vendor || '',
      };
    };
  }, []);

  const userAgentInfo = useMemo(
    () => parseUserAgent(contactSession?.metadata?.userAgent),
    [contactSession?.metadata?.userAgent, parseUserAgent],
  );

  const countryInfo = useMemo(() => {
    return getCountryForTimezone(contactSession?.metadata?.timezone || '');
  }, [contactSession?.metadata?.timezone]);

  const accordionSections = useMemo<InfoSection[]>(() => {
    if (!contactSession?.metadata) return [];
    return [
      {
        id: 'device-info',
        icon: MonitorIcon,
        title: 'Device Information',
        items: [
          {
            label: 'Browser',
            value:
              userAgentInfo.browser +
              (userAgentInfo.browserVersion
                ? ` ${userAgentInfo.browserVersion}`
                : ''),
          },
          {
            label: 'Operating System',
            value:
              userAgentInfo.os +
              (userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ''),
          },
          {
            label: 'Device',
            value:
              userAgentInfo.device +
                (userAgentInfo.deviceModel
                  ? ` ${userAgentInfo.deviceModel}`
                  : '') || 'Unknown',
            classname: 'capitalize',
          },
          {
            label: 'Screen Resolution',
            value: contactSession.metadata?.screenResolution || 'Unknown',
          },
          {
            label: 'Viewport Size',
            value: contactSession.metadata?.viewportSize || 'Unknown',
          },
          {
            label: 'Cookies',
            value: contactSession.metadata?.cookieEnabled
              ? 'Enabled'
              : 'Disabled',
          },
        ],
      },
      {
        id: 'location-info',
        icon: GlobeIcon,
        title: 'Location And Language',
        items: [
          ...(countryInfo
            ? [
                {
                  label: 'Location',
                  value: <span>{countryInfo.name}</span>,
                },
              ]
            : []),
          {
            label: 'Language',
            value: contactSession.metadata?.language || 'Unknown',
          },
          {
            label: 'Timezone',
            value: contactSession.metadata?.timezone || 'Unknown',
          },
          {
            label: 'UTC Offset',
            value:
              contactSession.metadata?.timezoneOffset !== undefined
                ? `UTC ${
                    contactSession.metadata.timezoneOffset > 0 ? '-' : '+'
                  }${Math.abs(contactSession.metadata.timezoneOffset) / 60}`
                : 'Unknown',
          },
        ],
      },
      {
        id: 'section-details',
        title: 'Section details',
        icon: ClockIcon,
        items: [
          {
            label: 'Session Started',
            value: new Date(contactSession._creationTime).toLocaleString(),
          },
        ],
      },
    ];
  }, [contactSession?.metadata, countryInfo, userAgentInfo]);

  if (contactSession === undefined || contactSession === null) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center gap-x-2">
          <DicebearAvatar
            size={42}
            imageURL=""
            badgeImageURL={
              countryInfo?.id ? getCountryFlagURL(countryInfo.id) : undefined
            }
            seed={contactSession._id}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-x-2">
              <h4 className="line-clamp-1">{contactSession.name}</h4>
            </div>
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {contactSession.email}
            </p>
          </div>
        </div>
        <Button asChild className="w-full" size="lg">
          <Link href={`mailto:${contactSession.email}`}>
            <MailIcon className="" />
            <span>Send Email</span>
          </Link>
        </Button>
      </div>
      <div>
        {contactSession.metadata && (
          <Accordion
            className="w-full rounded-none border-y"
            collapsible
            type="single"
          >
            {accordionSections.map((section) => (
              <AccordionItem
                className="rounded-none outline-none has-focus-visible:z-10
                has-focus-visible:border-ring has-focus-visible:ring-[3px]
                has-focus-visible:ring-ring/50 "
                key={section.id}
                value={section.id}
              >
                <AccordionTrigger
                  className="flex w-full flex-1 items-center justify-between
                    gap-4 rounded-none bg-accent px-5 py-4 text-left font-medium
                    text-sm outline-none transition-all hover:no-underline
                    disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="size-4 shrink-0" />
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 py-4">
                  <div className="space-y-2 text-sm">
                    {section.items.map((item) => (
                      <div
                        className="flex justify-between"
                        key={`${section.id}-${item.label}`}
                      >
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <span className={item.classname}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
