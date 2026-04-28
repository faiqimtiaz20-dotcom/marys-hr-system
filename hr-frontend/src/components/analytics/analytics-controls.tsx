"use client";

import { useState } from "react";

export function AnalyticsControls() {
  const [range, setRange] = useState("30d");
  const [department, setDepartment] = useState("all");
  const [team, setTeam] = useState("all");
  const [message, setMessage] = useState<string | null>(null);

  const onExport = (type: "CSV" | "PDF") => {
    setMessage(`${type} export generated successfully (mock).`);
    setTimeout(() => setMessage(null), 1800);
  };

  return (
    <div className="rounded-2xl border bg-surface p-3">
      <div className="flex flex-wrap gap-2">
        <select
          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          value={range}
          onChange={(event) => setRange(event.target.value)}
          aria-label="Analytics date range"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <select
          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          aria-label="Filter analytics by department"
        >
          <option value="all">All departments</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
          <option value="hr">HR</option>
        </select>
        <select
          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          value={team}
          onChange={(event) => setTeam(event.target.value)}
          aria-label="Filter analytics by team"
        >
          <option value="all">All teams</option>
          <option value="recruiting">Recruiting Team</option>
          <option value="hiring_managers">Hiring Managers</option>
        </select>
        <button
          type="button"
          className="ml-auto rounded-xl border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onExport("CSV")}
        >
          Export CSV
        </button>
        <button
          type="button"
          className="rounded-xl border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onExport("PDF")}
        >
          Export PDF
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-primary">{message}</p> : null}
    </div>
  );
}
