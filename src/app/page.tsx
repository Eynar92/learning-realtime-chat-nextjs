'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

const formSchema = z.object({
  message: z.string().min(2).max(50),
})

export default function Home() {

  const { socket } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    socket.emit('mensaje-to-server', values.message);
    form.resetField('message')
  }

  useEffect(() => {
    socket.on('mensaje-from-server', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('mensaje-from-server');
    }
  }, [socket]);

  return (
    <main className="min-h-screen py-4 space-y-4 container">
      <h1 className="text-3xl font-bold">MiniChat</h1>
      <Separator className="my-2" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Write a message..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"><SendIcon /></Button>
        </form>
      </Form>
      <section className="my-4">
        <ul className="space-y-4">
          {messages.map((message, index) => (
            <li key={index}>
              {message}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
