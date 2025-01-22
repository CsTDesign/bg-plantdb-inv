import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MemberInfoForm from "./MemberInfoForm";
import Orders from "./Orders";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your user profile"
};

export default async function Page() {
  const member = await getLoggedInMember(getWixServerClient());

  if (!member) notFound();

  return (
    <main className="max-w-7xl mx-auto px-5 py-10 space-y-10">
      <h1 className="font-bold md:text-4xl text-3xl text-center">
        User Profile
      </h1>
      <MemberInfoForm member={member} />
      <Orders />
    </main>
  );
}
