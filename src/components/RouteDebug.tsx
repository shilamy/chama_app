'use client';
import { route } from '@/lib/routes';

export default function RouteDebug() {
  const testRoutes = [
    'dashboard',
    'members', 
    'savings',
    'loans',
    'ngumbato',
    'investments',
    'reports',
    'content',
    'settings',
    'content.podcasts',
    'content.articles'
  ];

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="font-bold mb-2">Route Debugger</h3>
      <div className="text-sm">
        {testRoutes.map(routeName => (
          <div key={routeName} className="mb-1">
            <strong>{routeName}:</strong> {route(routeName as any)}
          </div>
        ))}
      </div>
    </div>
  );
}