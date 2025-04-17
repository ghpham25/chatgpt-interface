"use client";
//Use a form here

import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  picture: z.instanceof(File),
  initprompt: z.string().min(1, "Prompt is required"),
});

export default function SampleHome() {
  const router = useRouter();

  const prompt1 = "Give me a spatial description of the picture";

  const prompt2 = "Given the picture, generate a detailed spatial description";

  const prompt3 =
    "Imagine that I am blind, generate a description of the image for me";
  // const [imageFile, setImageFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      picture: undefined,
      initialPrompt: "",
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      form.setValue("picture", file); // Store the object URL
    }
  };

  function onSubmit(data) {
    console.log("You submitted the following data:", data);
    const objectURL = URL.createObjectURL(data.picture); // Create temporary URL

    router.push(
      `/sample/home/onethread?image=${encodeURIComponent(
        objectURL
      )}&title=${encodeURIComponent(
        data.title
      )}&initprompt=${encodeURIComponent(data.initprompt)}`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g: Mona Lisa" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="picture"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel> Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  {...rest}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initprompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select one prompt" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={prompt1}>
                    Give me a spatial description of the picture
                  </SelectItem>
                  <SelectItem value={prompt2}>
                    {" "}
                    Given the picture, generate a detailed spatial description
                  </SelectItem>
                  <SelectItem value={prompt3}>
                    {" "}
                    Imagine that I am blind, generate a description of the image
                    for me
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit">Start a thread</Button>
      </form>
    </Form>
  );
}

{
  /* <SidebarGroup>
          <SidebarGroupLabel>Ongoing </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/arts/1" asChild>
                  <a> Art 1 </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/arts/2" asChild>
                  <a> Art 2 </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel> Archived</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/arts/1"> Art 3 </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/arts/2"> Art 4 </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */
}
