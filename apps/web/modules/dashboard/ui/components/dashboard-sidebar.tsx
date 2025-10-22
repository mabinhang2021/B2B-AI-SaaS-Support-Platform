'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  Mic,
  PaletteIcon,
  LibraryBigIcon,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import { title } from 'process';
import { url } from 'inspector';

const customerSupportItems = [
  {
    title: 'Conversations',
    icon: InboxIcon,
    url: 'conversations',
  },
  {
    title: 'Knowledge Base',
    icon: LibraryBigIcon,
    url: '/files',
  },
];

const configurationItems = [
  {
    title: 'Widget Customization',
    icon: PaletteIcon,
    url: '/customization',
  },
  {
    title: 'Integrations',
    icon: LayoutDashboardIcon,
    url: '/integrations',
  },
  {
    title: 'Voice Assistant',
    icon: Mic,
    url: '/plugins/vapi',
  },
];

const accountItems = [
  {
    title: 'Plans & Billing',
    icon: CreditCardIcon,
    url: '/billing',
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(url);
  };
  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <OrganizationSwitcher
                hidePersonal
                skipInvitationScreen
                appearance={{
                  elements: {
                    rootBox: 'w-full! h-8!',
                    avatarBox: 'size-4! rounded-sm!',
                    organizationSwitcherTrigger:
                      'w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! ',
                    organizationPreview:
                      'group-data-[collapsible=icon]:justify-center! gap-2!',
                    organizationPreviewTextContainer:
                      'group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!',
                    organizationSwitcherTriggerIcon:
                      'mx-auto! text-sidebar-foreground! group-data-[collapsible=icon]:hidden!',
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* CUSTOMER SUPPORT */}
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ACCOUNT */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton
          showName
          appearance={{
            elements: {
              rootBox: 'w-full! h-8!',
              userButtonTrigger:
                'w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!',
              userButtonBox:
                'gap-2! w-full! flex-row-reverse! justify-end! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!',
              userButtonOuterIdentifier:
                'pl-0! group-data-[collapsible=icon]:hidden!',
              avatarBox: 'size-4! ',
            },
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
