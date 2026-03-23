import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface PageWrapperProps {
  children: ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  showNotifications?: boolean;
  topBarPadding?: boolean;
}

export function PageWrapper({
  children,
  showTopBar = true,
  showBottomNav = true,
  showNotifications = false,
  topBarPadding = true,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden page-enter page-enter-active">
      {showTopBar && <TopBar showNotifications={showNotifications} />}

      <main className={`flex-1 min-h-0 overflow-hidden ${showTopBar && topBarPadding ? 'pt-[72px]' : ''}`}>
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
