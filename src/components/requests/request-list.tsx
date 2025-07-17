
"use client";

import { useRequests } from "@/hooks/use-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestCard } from "./request-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function RequestList() {
  const { incomingRequests, outgoingRequests, isLoading, error } = useRequests();

  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );

  return (
    <Tabs defaultValue="incoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="incoming">Incoming ({isLoading ? '...' : incomingRequests.length})</TabsTrigger>
        <TabsTrigger value="outgoing">Outgoing ({isLoading ? '...' : outgoingRequests.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="incoming" className="mt-6">
        {isLoading ? (
          renderSkeleton()
        ) : error ? (
           <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : incomingRequests.length > 0 ? (
          <div className="space-y-4">
            {incomingRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="incoming" />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <p className="font-semibold">No incoming requests.</p>
            <p className="text-sm">When someone wants to swap skills with you, it will appear here.</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="outgoing" className="mt-6">
        {isLoading ? (
          renderSkeleton()
        ) : error ? (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : outgoingRequests.length > 0 ? (
          <div className="space-y-4">
            {outgoingRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="outgoing" />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <p className="font-semibold">No outgoing requests.</p>
            <p className="text-sm">Request a swap from the dashboard to get started.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
