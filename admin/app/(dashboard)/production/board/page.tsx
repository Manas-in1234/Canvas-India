'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Board } from '@/lib/types/production';
import { PIPELINE_STAGES } from '@/lib/types/production';
import { StatusBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductionBoardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['production', 'board'],
    queryFn: () => apiClient.get<Board>('/production/jobs/board'),
    refetchInterval: 30000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Production Board</h1>
        <p className="text-sm text-muted-foreground">Active jobs by pipeline stage.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {PIPELINE_STAGES.map((stage) => (
            <Skeleton key={stage} className="h-64 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load the production board.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {PIPELINE_STAGES.map((stage) => {
            const cards = data?.[stage] ?? [];
            return (
              <div key={stage} className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {stage.replaceAll('_', ' ')}
                  </h2>
                  <span className="text-xs text-muted-foreground">{cards.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {cards.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">Empty</p>
                  ) : (
                    cards.map((card) => (
                      <Link
                        key={card.stageId}
                        href={`/production/jobs/${card.productionJobId}`}
                        className="rounded-md border bg-background p-2.5 text-xs shadow-xs transition-colors hover:bg-muted"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium">{card.orderNumber}</span>
                          <StatusBadge status={card.status} />
                        </div>
                        {card.slaDueAt && (
                          <div className="text-muted-foreground">Due {formatDate(card.slaDueAt)}</div>
                        )}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
