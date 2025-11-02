'use client';

import { WidgetFooter } from '../components/widget-footer';
import { WidgetHeader } from '../components/widget-header';
import { WidgetAuthScreen } from '../screens/widget-auth-screen';

import { screenAtom } from '../../atoms/widget-atoms';

import { useAtomValue } from 'jotai';

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom); 
  const screenComponents = {
    error:<p>TODO:Error</p>,
    loading:<p>TODO:Loading</p>,
    auth:<WidgetAuthScreen/>,
    selection:<p>TODO:Selection</p>,
    voice:<p>TODO:Voice</p>,
    inbox:<p>TODO:Inbox</p>,
    chat:<p>TODO:Chat</p>,
    contact:<p>TODO:Contact</p>,
  }
  
  
  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
     
      {screenComponents[screen]}
      
    </main>
  );
};
