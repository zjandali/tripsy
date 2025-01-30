import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function A() {
  const session = await getServerSession(authOptions);
  return <div>{session?.user?.email} {session?.user?.name} {session?.user?.image} {session?.user?.id}</div>;
}