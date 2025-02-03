import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';

import Button from '@/components/button';
import Input from '@/components/input/input';
import { todoSchema } from '@/models/todos';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: todos, isPending } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch('/api/todos');
      const data = todoSchema.array().parse(await res.json());
      return data;
    },
  });

  return (
    <div className={`${inter.className} flex min-h-screen flex-col items-center justify-between`}>
      <Head>
        <title>Finance Tracker</title>
      </Head>

      <main>
        <h2 className="text-2xl">Компонент кнопки</h2>
        <div className="flex gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
        </div>
      </main>
      <div className="mt-2 flex flex-col gap-2">
        <Input />
        <Input placeholder="Placeholder" />
        <Input errorText="Error text" />
        <Input disabled value="Disabled" />
      </div>

      {isPending ? (
        <p className="text-yellow-400">загрузка...</p>
      ) : (
        <ul>{todos?.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      )}
    </div>
  );
}
