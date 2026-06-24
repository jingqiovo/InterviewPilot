import * as TabsPrimitive from '@radix-ui/react-tabs';
import React from 'react';

export function Tabs({ children, value, onValueChange }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void }) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      {children}
    </TabsPrimitive.Root>
  );
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <TabsPrimitive.List className={`inline-flex items-center gap-1 p-1 bg-muted rounded-lg ${className}`}>
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <TabsPrimitive.Trigger 
      value={value}
      className="px-4 py-2 text-sm font-medium text-text-secondary rounded-md transition-colors data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) {
  return (
    <TabsPrimitive.Content value={value} className={`mt-5 animate-fade-in ${className}`}>
      {children}
    </TabsPrimitive.Content>
  );
}
