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
  vapiSecretsAtom,
  widgetSettingsAtom,
} from '../../atoms/widget-atoms';
import { use, useEffect, useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Id } from '@workspace/backend/_generated/dataModel';
import { set } from 'date-fns';

type InitStep = 'org' | 'session' | 'settings' | 'vapi' | 'done';

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>('org');
  const [sessionValid, setSessionValid] = useState(false);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const validateOrganization = useAction(api.public.organizations.validate);
  const setScreen = useSetAtom(screenAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setVapiSecrets = useSetAtom(vapiSecretsAtom);
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

  //step2: validate session
  const validateSession = useMutation(api.public.contactSessions.validate);
  useEffect(() => {
    if (step !== 'session') return;
    setLoadingMessage('finding contact session id...');
    if (!contactSessionId) {
      setSessionValid(false);
      setStep('done');
      return;
    }
    setLoadingMessage('validating session...');
    validateSession({
      contactSessionId: contactSessionId as Id<'contactSessions'>,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep('settings');
      })
      .catch(() => {
        setSessionValid(false);
        setStep('settings');
      });
  }, [step, contactSessionId, validateSession, setLoadingMessage, setStep]);

  //step3: load settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId
      ? {
          organizationId,
        }
      : 'skip',
  );
  useEffect(() => {
    if (step !== 'settings') return;
    setLoadingMessage('loading widget settings...');
    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings);
      setStep('vapi');
    }
  }, [step, widgetSettings, setLoadingMessage, setWidgetSettings, setStep]);

  //step 4:Load vapi secrets
  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);
  useEffect(() => {
    if (step !== 'vapi') return;
    if (!organizationId) {
      setErrorMessage('Organization ID is missing.');
      setScreen('error');
      return;
    }
    setLoadingMessage('loading vapi secrets...');
    getVapiSecrets({ organizationId })
      .then((secrets) => {
        if (secrets) {
          setVapiSecrets(secrets);
          setStep('done');
        }
      })
      .catch(() => {
        setVapiSecrets(null);
        setStep('done');
      });
  }, [
    step,
    getVapiSecrets,
    organizationId,
    setLoadingMessage,
    setVapiSecrets,
    setStep,
  ]);

  useEffect(() => {
    if (step !== 'done') return;
    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? 'selection' : 'auth');
  }, [step, setScreen, sessionValid, contactSessionId]);
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
