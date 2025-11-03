'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { AlertTriangleIcon, LoaderIcon } from 'lucide-react';
import { WidgetHeader } from '../components/widget-header';
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from '../../atoms/widget-atoms';
import { use, useEffect, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { set } from 'zod/v4-mini';
import { Id } from '@workspace/backend/_generated/dataModel';

type InitStep = 'org' | 'session' | 'settings' | 'vapi' | 'done';

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>('org');
  const [sessionValid, setSessionValid] = useState(false);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const validateOrganization = useAction(api.public.organizations.validate);
  const setScreen = useSetAtom(screenAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ''),
  );

  //step1: validate organization
  useEffect(() => {
    if (step !== 'org') return;

    setLoadingMessage('finding organization id...');
    if (!organizationId) {
      setErrorMessage('Organization ID is missing.');
      setScreen('error');
      return;
    }
    setLoadingMessage('validating organization...');
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep('session');
        } else {
          setErrorMessage(result.reason || 'Invalid organization ID.');
          setScreen('error');
        }
      })
      .catch(() => {
        setErrorMessage('Error validating organization: ');
        setScreen('error');
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setStep,
    setOrganizationId,
    validateOrganization,
    setLoadingMessage,
  ]);

  //step2: validate session (TODO)
  const validateSession = useMutation(api.public.contactSessions.validate);
  useEffect(() => {
    if (step !== 'session') return;
    setLoadingMessage('finding contact session id...');
    if(!contactSessionId){
      setSessionValid(false);
      setStep('done');
      return;
    }
    setLoadingMessage('validating session...');
    validateSession({
      contactSessionId: contactSessionId as Id<'contactSessions'>,
    }).then((result) => {
      setSessionValid(result.valid);
      setStep('done');
    })
    .catch(() => {
      setSessionValid(false);
      setStep('done');
    })
  }, [step,contactSessionId,validateSession,setLoadingMessage,setStep]);

  useEffect(() => {
    if (step !== 'done') return;
    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? 'selection' : 'auth');
  }, [step, setScreen, sessionValid,contactSessionId]);
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className=" text-3xl">Hi,there!👋</p>
          <p className="text-lg">Let&apos;s get you started!</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || 'loading...'}</p>
      </div>
    </>
  );
};
