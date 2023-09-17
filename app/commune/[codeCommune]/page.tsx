import { Layout } from "antd";
import { CommuneHero } from "@/components/Commune/CommuneHero";
import { CommuneParams } from "@/components/Commune/CommuneParams";
import { CommuneDividerParams } from "@/components/Commune/CommuneDividerParams";
import { CommuneNetworks } from "@/components/Commune/CommuneNetworks";
import { notFound } from "next/navigation";
import ThemeWrapper from "@/components/ThemeConfigWrapper";
import { CommuneDividerNetworks } from "@/components/Commune/CommuneDividerNetworks";

export async function generateStaticParams() {
  return [];
}
export default async function CommunePage({
  params,
}: {
  params: { codeCommune: string };
}) {
  const { codeCommune } = params;
  if (!codeCommune) {
    notFound();
  }

  return (
    <ThemeWrapper>
      <Layout className="h-screen overflow-auto">
        <CommuneHero codeCommune={codeCommune} />
        <CommuneDividerParams />
        <CommuneParams codeCommune={codeCommune} />
        <CommuneDividerNetworks />
        <CommuneNetworks codeCommune={codeCommune} />
      </Layout>
    </ThemeWrapper>
  );
}
