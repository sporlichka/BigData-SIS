import { Sidebar } from './Sidebar';
import { ContentGenerator } from './ContentGenerator';

export const Layout = () => {
  return (
    <div className="flex h-screen bg-brand-light overflow-hidden antialiased">
      <Sidebar />
      <ContentGenerator />
    </div>
  );
};
