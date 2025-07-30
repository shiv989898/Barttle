
"use client";

import {
  ArrowRight,
  Check,
  Clock,
  ThumbsDown,
  User,
  X,
} from "lucide-react";
import type { SwapRequest } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRequests } from "@/hooks/use-requests";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
  request: SwapRequest;
  type: "incoming" | "outgoing";
}

const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
    accepted: { label: "Accepted", icon: Check, color: "bg-green-500" },
    declined: { label: "Declined", icon: X, color: "bg-red-500" },
    cancelled: { label: "Cancelled", icon: ThumbsDown, color: "bg-gray-500" },
};

export function RequestCard({ request, type }: RequestCardProps) {
  const { updateRequestStatus } = useRequests();
  const isIncoming = type === "incoming";
  const profileToShow = isIncoming ? request.requesterProfile : request.requestedProfile;

  const StatusIcon = statusConfig[request.status].icon;

  const handleAccept = () => updateRequestStatus(request.id, "accepted");
  const handleDecline = () => updateRequestStatus(request.id, "declined");
  const handleCancel = () => updateRequestStatus(request.id, "cancelled");

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                    {isIncoming ? "From" : "To"}{" "}
                    <span className="font-bold text-primary">{profileToShow.name}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="flex flex-wrap gap-1">
                        {request.skillsOffered.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                        {request.skillsDesired.map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="flex flex-col items-end gap-2 self-stretch justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
                <Badge className={cn("gap-1.5 pl-2", statusConfig[request.status].color)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[request.status].label}
                </Badge>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(request.createdAt instanceof Date ? request.createdAt : request.createdAt.toDate(), { addSuffix: true })}
                </p>
            </div>
            
            {request.status === 'pending' && (
                <div className="flex gap-2">
                    {isIncoming ? (
                        <>
                            <Button size="sm" onClick={handleAccept}><Check className="mr-1 h-4 w-4" />Accept</Button>
                            <Button size="sm" variant="outline" onClick={handleDecline}><X className="mr-1 h-4 w-4" />Decline</Button>
                        </>
                    ) : (
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleCancel}><X className="mr-1 h-4 w-4" />Cancel</Button>
                    )}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
