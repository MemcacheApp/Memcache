"use client";

import Link from 'next/link';
import { PageTitle } from "../../../../ui/components";

export default function SummariesPage() {
  return (
    <div className="flex flex-col">
      <PageTitle>Summaries</PageTitle>
      <div>
        <Link href="app/summaries/hello">Go to hello summary</Link>
        <Link href="app/summaries/boooooo">Go to boooooo summary</Link>
      </div>
    </div>
  );
}
