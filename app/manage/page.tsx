import { use } from "react";
import ManageAvatar from "@/components/Manage/Manage";

export default function Page({searchParams,}: {searchParams: Promise<{ q?: string }>;}) {
  const { q } = use(searchParams);
  return <ManageAvatar initialQ={q} />;
}
