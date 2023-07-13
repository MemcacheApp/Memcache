"use client";

import { useRouter } from 'next/router';

export default function SummaryDetailPage({ params }) {
  return (
    <div>
      <h1>Summary: {params.slug}</h1>
    </div>
  );
}
