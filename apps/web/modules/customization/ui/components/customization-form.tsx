import { z } from 'zod';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { Textarea } from '@workspace/ui/components/textarea';
import { Doc } from '@workspace/backend/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { VapiFormFields } from './vapi-form-fields';
import { FormSchema } from '../../types';
import { WidgetSettingSchema } from '../../constants';



type widgetSettings = Doc<'widgetSettings'>;


interface CustomizationFormProps {
  initialData?: widgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({ initialData,hasVapiPlugin }: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);
  const form = useForm<FormSchema>({
    resolver: zodResolver(WidgetSettingSchema),
    defaultValues: {
      greetMessage: initialData?.greetMessage || 'Hi,How can i help you?',
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || '',
        suggestion2: initialData?.defaultSuggestions.suggestion2 || '',
        suggestion3: initialData?.defaultSuggestions.suggestion3 || '',
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || '',
        phoneNumber: initialData?.vapiSettings.phoneNumber || '',
      },
    },
  });
  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: widgetSettings['vapiSettings'] = {
        assistantId:
          values.vapiSettings.assistantId === 'none'
            ? ''
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === 'none'
            ? ''
            : values.vapiSettings.phoneNumber,
      };
      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        vapiSettings,
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behavior and message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greet Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Welcome message shown to users when they open the chat "
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be displayed to users when they open the
                    chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Default Suggestions</h3>
                <p className="mb-4 text-muted-foreground text-sm ">
                  Quick reply suggestions shown to customers to help guide the
                  conversation
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g.,How do I get started?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g.,What are your pricing plans?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g.,I need help with my account?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>VAPI Voice Assistant Settings</CardTitle>
              <CardDescription>
                Configure settings for the VAPI plugin
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}
        <div className='flex justify-end '>
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
