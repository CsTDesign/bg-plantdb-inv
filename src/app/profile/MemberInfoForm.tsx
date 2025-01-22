"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateMember } from "@/hooks/members";
import { requiredString } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { members } from "@wix/members";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  loginEmail: requiredString,
  firstName: z.string(),
  lastName: z.string()
});

type FormValues = z.infer<typeof formSchema>;

interface MemberInfoFormProps {
  member: members.Member;
}

export default function MemberInfoForm({ member }: MemberInfoFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loginEmail: member.loginEmail || "",
      firstName: member.contact?.firstName || "",
      lastName: member.contact?.lastName || ""
    }
  });

  const mutation = useUpdateMember();

  function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        className="max-w-xl mx-auto space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="loginEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="Login email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="First name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Last name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={mutation.isPending}
          type="submit"
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
