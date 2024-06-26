"use client";
import { CreatePipelineFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/Loading";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/providers/ModalProvider";
import { saveActivityLogsNotification, upsertPipeline } from "@/lib/queries";

type Props = {
  defaultData?: Pipeline;
  subAccountId: string;
};

const CreatePipelineForm = ({ subAccountId, defaultData }: Props) => {
  const { toast } = useToast();
  const { setOpen, setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    resolver: zodResolver(CreatePipelineFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
    },
  });
  const isLoading = form.formState.isLoading;
  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) {
      return;
    }
    try {
      const rsp = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId: subAccountId,
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${rsp?.name}`,
        subaccountId: subAccountId,
      });
      toast({
        title: "Success",
        description: "Saved pipeline details",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save pipeline details",
      });
    }
    setClose();
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePipelineForm;
