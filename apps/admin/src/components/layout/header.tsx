interface HeaderProps {
  title: string;
  userEmail: string;
}

export function Header({ title, userEmail }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-6">
      <div className="flex flex-1 items-center justify-between">
        <h2 className="text-lg font-medium leading-none tracking-tight text-slate-900">
          {title}
        </h2>
        <div className="text-sm font-medium text-slate-500">
          {userEmail}
        </div>
      </div>
    </header>
  );
}
