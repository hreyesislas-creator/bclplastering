import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Image as ImageIcon, MapPin, Phone } from "lucide-react";
import type { Lead } from "@/types/db";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_LABEL, LEAD_STATUS_VARIANT } from "@/lib/leads/status";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

interface LeadsListProps {
  leads: Lead[];
  empty?: React.ReactNode;
}

export function LeadsList({ leads, empty }: LeadsListProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
        {empty ?? (
          <p className="text-sm text-muted-foreground">
            No leads yet — submissions from the contact form will land here.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <ul className="space-y-3 lg:hidden">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <Th className="pl-5">Name</Th>
              <Th>Service</Th>
              <Th>City</Th>
              <Th>Phone</Th>
              <Th>Photos</Th>
              <Th>Status</Th>
              <Th>Received</Th>
              <Th className="pr-5"> </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => {
              const service = services.find((s) => s.type === lead.service_type);
              return (
                <tr
                  key={lead.id}
                  className="text-foreground transition-colors hover:bg-surface-2/40"
                >
                  <Td className="pl-5 font-medium">{lead.full_name}</Td>
                  <Td className="text-muted-foreground">
                    {service?.title ?? lead.service_type}
                  </Td>
                  <Td className="text-muted-foreground">{lead.city ?? "—"}</Td>
                  <Td>
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-gold"
                    >
                      {lead.phone}
                    </a>
                  </Td>
                  <Td>
                    <PhotoCount count={lead.project_photo_urls.length} />
                  </Td>
                  <Td>
                    <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
                      {LEAD_STATUS_LABEL[lead.status]}
                    </Badge>
                  </Td>
                  <Td className="text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </Td>
                  <Td className="pr-5">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline"
                    >
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const service = services.find((s) => s.type === lead.service_type);
  const firstPhoto = lead.project_photo_urls[0];
  return (
    <li>
      <Link
        href={`/dashboard/leads/${lead.id}`}
        className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-gold/40"
      >
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
            {firstPhoto ? (
              <Image
                src={firstPhoto}
                alt={`${lead.full_name} photo`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            {lead.project_photo_urls.length > 1 ? (
              <span className="absolute bottom-1 right-1 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur">
                +{lead.project_photo_urls.length - 1}
              </span>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate text-base font-semibold text-foreground">
                {lead.full_name}
              </h3>
              <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
                {LEAD_STATUS_LABEL[lead.status]}
              </Badge>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {service?.title ?? lead.service_type}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {lead.city ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lead.city}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </span>
              <span>
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function PhotoCount({ count }: { count: number }) {
  if (count === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 text-xs text-foreground/85">
      <ImageIcon className="h-3 w-3 text-gold" />
      {count}
    </span>
  );
}

function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 font-medium", className)} {...props} />;
}
function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3", className)} {...props} />;
}
