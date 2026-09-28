import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Real KPI numbers land once this reuses the /analytics/* endpoints in a
// follow-up slice — placeholders only for this first pass.
export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Business overview will appear here.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Today&rsquo;s Revenue', 'Today&rsquo;s Orders', 'Average Order Value', 'New Customers'].map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label.replace('&rsquo;', '’')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground/50">&mdash;</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
