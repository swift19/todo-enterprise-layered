'use client';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

type Todo = { id: string; text: string; done: boolean; priority: string };

export default function Page() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const load = async () => {
    const res = await fetch('/bff/todos');
    const data = await res.json();
    if (Array.isArray(data)) setTodos(data);
  };

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const add = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch('/bff/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: newTodo, priority }) });
    if (res.ok) { setNewTodo(''); load(); }
  };

  const toggle = async (t: Todo) => {
    await fetch(`/bff/todos/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done: !t.done }) });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/bff/todos/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = todos.filter(t => filter === 'all' ? true : filter === 'active' ? !t.done : t.done);

  if (status === 'loading') return <div className="p-10">Loading...</div>;
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold">Todo Enterprise <span className="text-violet-400">Layered</span></h1>
          <p className="text-zinc-400 text-sm mt-2 mb-8">Frontend → BFF → Message Bus → Adapters</p>
          <button onClick={() => signIn('google')} className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200">Login with Google</button>
          <p className="text-xs text-zinc-500 mt-6">Auth.js v5 + Prisma + Supabase</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-10 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Todo Enterprise <span className="text-violet-400">Layered</span></h1>
              <p className="text-xs text-zinc-500 mt-1">Frontend → BFF → Message Bus → Adapters • Deployed on Vercel</p>
              <p className="text-xs text-zinc-400 mt-1">Hi {session.user?.name} • {session.user?.email}</p>
            </div>
            <button onClick={() => signOut()} className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full">Logout</button>
          </div>

          <div className="flex gap-2 mb-4">
            <input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="New todo..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            <select value={priority} onChange={e=>setPriority(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 text-sm"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>
            <button onClick={add} className="bg-violet-600 hover:bg-violet-500 text-white px-6 rounded-xl font-medium">Add</button>
          </div>

          <div className="flex gap-2 mb-6">
            {(['all','active','done'] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium border ${filter===f?'bg-violet-600 border-violet-600 text-white':'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>{f}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(t=>(
              <div key={t.id} className="flex items-center justify-between bg-zinc-800/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={t.done} onChange={()=>toggle(t)} className="w-5 h-5 accent-violet-600" />
                  <span className={`text-sm ${t.done?'line-through text-zinc-500':''}`}>{t.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full border border-zinc-700 text-zinc-400">{t.priority}</span>
                  <button onClick={()=>remove(t.id)} className="text-zinc-500 hover:text-red-400">✕</button>
                </div>
              </div>
            ))}
            {filtered.length===0 && <div className="text-center text-zinc-500 text-sm py-10">No todos yet</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Event Flow Logger (BFF → Bus → Adapter)</h3>
            <p className="text-[11px] text-zinc-500 mt-2 font-mono">System ready: Frontend → BFF → Bus → Adapters</p>
            <div className="mt-3 text-[11px] font-mono text-zinc-400 space-y-1">
              <div>• Auth: Google OAuth via Auth.js</div>
              <div>• BFF: /bff/todos</div>
              <div>• Bus: lib/bus.ts (Upstash ready)</div>
              <div>• Adapter: Prisma → Supabase</div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-[11px] leading-5 text-zinc-400">
            <b className="text-zinc-200">Deploy to Vercel:</b><br/>1. vercel link<br/>2. Add env vars in dashboard: DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, AUTH_SECRET, GOOGLE_CLIENT_ID/SECRET<br/>3. vercel --prod<br/>BFF → Edge Functions, Adapters → Serverless, Bus → Upstash Redis
          </div>
        </div>
      </div>
    </main>
  );
}
