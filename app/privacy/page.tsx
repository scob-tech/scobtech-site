import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/site/section-heading";
import { Footer } from "@/components/site/footer";
import { Logo } from "@/components/site/logo";
import { site } from "@/lib/site";

// Atualize esta data sempre que o conteúdo da política mudar
const LAST_UPDATED = { iso: "2026-10-19", label: "19 de outubro de 2026" };

const title = "Política de Privacidade — scob.";
const description =
  "Como a Scobtech trata dados pessoais no site e nos sistemas que desenvolve, incluindo o Scobtech Atendimento e o Lelli Connect, integrados à API oficial do WhatsApp Business (Meta).";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "scob.",
    url: `${site.url}/privacy`,
    title,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "scob. — Sistemas sob medida" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
};

const company = {
  legalName: "29.604.613 SILVIO ARRUDA FILHO",
  cnpj: "29.604.613/0001-10",
  city: "São Paulo – SP",
};

const mail = (
  <a href={`mailto:${site.email}`} className="text-brand underline-offset-4 hover:underline">
    {site.email}
  </a>
);

const sections: { id: string; title: string; content: React.ReactNode }[] = [
  {
    id: "quem-somos",
    title: "Quem somos e a quem esta política se aplica",
    content: (
      <>
        <p>
          A <strong>Scobtech</strong> (marca <strong>scob.</strong>) é o nome comercial de{" "}
          <strong>{company.legalName}</strong>, inscrita no CNPJ sob o nº <strong>{company.cnpj}</strong>, com
          sede em {company.city}. Desenvolvemos sistemas sob medida para empresas, entre eles o{" "}
          <strong>Scobtech Atendimento</strong> e o <strong>Lelli Connect</strong> — este desenvolvido para a
          Óticas Lélli —, que utilizam a API oficial do WhatsApp Business, fornecida pela Meta (WhatsApp Business
          Platform — Cloud API), para que empresas atendam seus clientes pelo WhatsApp.
        </p>
        <p>Esta política explica como tratamos dados pessoais:</p>
        <ul>
          <li>no site {site.url.replace("https://", "")};</li>
          <li>nos contatos comerciais feitos conosco (WhatsApp, e-mail e reuniões de diagnóstico);</li>
          <li>nos sistemas que desenvolvemos, em especial o Scobtech Atendimento e o Lelli Connect.</li>
        </ul>
        <p>
          Ela segue a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e as políticas da Meta
          aplicáveis à WhatsApp Business Platform.
        </p>
      </>
    ),
  },
  {
    id: "papeis",
    title: "Controladora e operadora: quem decide sobre os dados",
    content: (
      <>
        <p>
          A LGPD distingue quem decide sobre o tratamento (<strong>controlador</strong>) de quem trata os dados em
          nome dele (<strong>operador</strong>). O papel da Scobtech muda conforme o contexto:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-base font-semibold text-foreground">Scobtech como controladora</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Dados tratados nas nossas próprias atividades comerciais e administrativas, como os de visitantes do
              site e de pessoas que nos procuram para contratar serviços.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="text-base font-semibold text-foreground">Scobtech como operadora</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Dados tratados nos sistemas que operamos para nossos clientes, incluindo as conversas pelo WhatsApp.
              Nesse caso, a empresa cliente é a controladora e a Scobtech trata os dados apenas para prestar o
              serviço contratado, conforme as instruções dela.
            </p>
          </div>
        </div>
        <ul>
          <li>
            <strong>Lelli Connect:</strong> a <strong>Óticas Lélli</strong> é a controladora dos dados dos clientes
            atendidos, e a Scobtech atua como operadora, conforme as instruções da Óticas Lélli.
          </li>
          <li>
            <strong>Scobtech Atendimento:</strong> a empresa que contrata o sistema é a controladora dos dados dos
            clientes atendidos por ela, e a Scobtech atua como operadora.
          </li>
        </ul>
        <p>
          Se você conversou pelo WhatsApp com uma empresa que usa nossos sistemas, a política de privacidade dessa
          empresa também se aplica a você, e é a ela que você deve dirigir, preferencialmente, seus pedidos sobre
          os seus dados. A Scobtech apoia a empresa no atendimento desses pedidos e também pode ser contatada
          diretamente (veja a seção “Seus direitos”).
        </p>
      </>
    ),
  },
  {
    id: "dados",
    title: "Quais dados pessoais tratamos",
    content: (
      <>
        <h3>Nos sistemas de atendimento via WhatsApp</h3>
        <ul>
          <li>
            <strong>Identificação do contato:</strong> nome de perfil do WhatsApp, número de telefone e o
            identificador do WhatsApp fornecido pela Meta.
          </li>
          <li>
            <strong>Conteúdo das conversas:</strong> mensagens de texto e, quando enviados, arquivos, imagens,
            áudios, documentos, localização e contatos compartilhados na conversa.
          </li>
          <li>
            <strong>Metadados das mensagens:</strong> data e hora, status de envio, entrega e leitura, e
            identificadores técnicos das mensagens.
          </li>
          <li>
            <strong>Informações necessárias ao atendimento:</strong> dados que você ou a empresa registram durante
            o atendimento, como assunto da solicitação, histórico de atendimentos, observações do atendente e
            dados de pedidos, agendamentos ou serviços relacionados.
          </li>
          <li>
            <strong>Usuários do sistema:</strong> nome, e-mail e dados de acesso dos atendentes e administradores
            cadastrados pela empresa cliente, além de registros de uso necessários à segurança e à auditoria.
          </li>
        </ul>
        <h3>No site e nos contatos comerciais</h3>
        <ul>
          <li>
            Nome, telefone, e-mail, empresa e o conteúdo das mensagens que você nos envia por WhatsApp ou e-mail.
          </li>
          <li>
            Dados de navegação coletados por cookies e identificadores da tag do Google Ads (veja a seção “Cookies
            no site”).
          </li>
        </ul>
        <p>
          Não solicitamos dados pessoais sensíveis. Se eles forem enviados espontaneamente em uma conversa, serão
          tratados apenas no contexto do atendimento e com o mesmo nível de proteção.
        </p>
      </>
    ),
  },
  {
    id: "meta-whatsapp",
    title: "Integração com a Meta e a API oficial do WhatsApp Business",
    content: (
      <>
        <p>
          O Scobtech Atendimento e o Lelli Connect se conectam à WhatsApp Business Platform por meio da API
          oficial da Meta. Isso significa que:
        </p>
        <ul>
          <li>
            as mensagens trocadas entre você e a empresa trafegam pela infraestrutura da Meta, que as entrega ao
            nosso sistema e envia as respostas da empresa;
          </li>
          <li>
            a Meta trata esses dados de acordo com os próprios termos e políticas, incluindo a{" "}
            <a
              href="https://www.whatsapp.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              Política de Privacidade do WhatsApp
            </a>{" "}
            e os{" "}
            <a
              href="https://www.whatsapp.com/legal/business-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline-offset-4 hover:underline"
            >
              Termos do WhatsApp Business
            </a>
            ;
          </li>
          <li>
            acessamos apenas os dados que a API disponibiliza para as contas do WhatsApp Business conectadas
            pelos nossos clientes, e somente para prestar o serviço de atendimento;
          </li>
          <li>
            não vendemos dados obtidos pela plataforma da Meta, não os usamos para publicidade própria nem os
            compartilhamos com terceiros para fins não relacionados ao serviço;
          </li>
          <li>
            mensagens iniciadas pela empresa seguem as regras da Meta para consentimento (opt-in) e modelos de
            mensagem aprovados, e você pode pedir à empresa, a qualquer momento, para não receber mais mensagens.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Finalidades e bases legais",
    content: (
      <>
        <p>Tratamos dados pessoais apenas para finalidades definidas, com as seguintes bases legais da LGPD:</p>
        <ul>
          <li>
            <strong>Prestar o atendimento via WhatsApp</strong> (receber, organizar, responder e registrar
            conversas): execução de contrato ou de procedimentos preliminares a pedido do titular (art. 7º, V) e
            legítimo interesse da empresa controladora (art. 7º, IX), conforme definido por ela.
          </li>
          <li>
            <strong>Operar, manter e dar suporte aos sistemas</strong> contratados pelos nossos clientes: execução
            de contrato (art. 7º, V).
          </li>
          <li>
            <strong>Garantir a segurança</strong>, prevenir fraudes e abusos e manter registros de acesso:
            legítimo interesse (art. 7º, IX) e cumprimento de obrigação legal (art. 7º, II), como a guarda de
            registros de acesso a aplicações prevista no Marco Civil da Internet, quando aplicável.
          </li>
          <li>
            <strong>Responder contatos comerciais</strong> e preparar propostas: procedimentos preliminares a
            contrato (art. 7º, V) e legítimo interesse (art. 7º, IX).
          </li>
          <li>
            <strong>Medir a eficácia de anúncios</strong> do site: legítimo interesse (art. 7º, IX), com a
            possibilidade de oposição descrita na seção “Cookies no site”.
          </li>
          <li>
            <strong>Cumprir obrigações legais e regulatórias</strong> e exercer direitos em processos: art. 7º,
            II e VI.
          </li>
        </ul>
        <p>
          Quando atuamos como operadora, a definição das finalidades e da base legal do tratamento cabe à empresa
          controladora.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "Com quem compartilhamos dados",
    content: (
      <>
        <p>Compartilhamos dados pessoais apenas quando necessário, com:</p>
        <ul>
          <li>
            <strong>a Meta</strong>, como fornecedora da API oficial do WhatsApp Business, para o envio e o
            recebimento de mensagens;
          </li>
          <li>
            <strong>a empresa cliente</strong> que contratou o sistema e é a controladora dos dados das conversas
            com os clientes dela;
          </li>
          <li>
            <strong>a Railway</strong>, provedora de infraestrutura que hospeda a aplicação, a API e o banco de
            dados PostgreSQL dos sistemas, e que trata os dados apenas para prestar esse serviço;
          </li>
          <li>
            <strong>o Google</strong>, somente em relação ao site, por meio da tag do Google Ads;
          </li>
          <li>
            <strong>autoridades públicas</strong>, quando houver obrigação legal, ordem judicial ou requisição de
            autoridade competente.
          </li>
        </ul>
        <p>
          Quando o tratamento por esses fornecedores envolver transferência internacional de dados, ela observará
          as hipóteses previstas no art. 33 da LGPD.
        </p>
      </>
    ),
  },
  {
    id: "seguranca-retencao",
    title: "Armazenamento, segurança e retenção",
    content: (
      <>
        <p>
          Os dados dos sistemas são armazenados no banco de dados PostgreSQL hospedado na infraestrutura da
          Railway. As mensagens trafegam entre o WhatsApp e os sistemas pela API oficial da Meta.
        </p>
        <p>
          A Scobtech se compromete a adotar medidas de segurança, técnicas e administrativas, aptas a proteger os
          dados pessoais contra acessos não autorizados e situações acidentais ou ilícitas de destruição, perda,
          alteração ou divulgação, nos termos do art. 46 da LGPD. Em caso de incidente de segurança que possa
          gerar risco ou dano relevante, a empresa controladora será comunicada e, quando exigido, também os
          titulares e a Autoridade Nacional de Proteção de Dados (ANPD), nos termos do art. 48 da LGPD.
        </p>
        <p>Mantemos os dados pessoais apenas pelo tempo necessário para as finalidades desta política:</p>
        <ul>
          <li>
            <strong>dados de atendimento</strong> tratados em nome de uma empresa cliente: durante a vigência do
            contrato com essa empresa ou até que ela solicite a exclusão; ao fim do contrato, os dados são
            devolvidos ou eliminados conforme as instruções dela, salvo obrigação legal de guarda;
          </li>
          <li>
            <strong>contatos comerciais</strong>: enquanto houver relacionamento ou negociação em andamento;
          </li>
          <li>
            <strong>registros exigidos por lei</strong>: pelo prazo legal aplicável.
          </li>
        </ul>
        <p>
          Encerrado o período de retenção, os dados são eliminados ou anonimizados, exceto nas hipóteses de
          conservação permitidas pelo art. 16 da LGPD.
        </p>
      </>
    ),
  },
  {
    id: "direitos",
    title: "Seus direitos e como exercê-los",
    content: (
      <>
        <p>Nos termos do art. 18 da LGPD, você pode solicitar:</p>
        <ul>
          <li>confirmação da existência de tratamento e acesso aos seus dados;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;</li>
          <li>portabilidade dos dados a outro fornecedor;</li>
          <li>eliminação dos dados tratados com base no consentimento;</li>
          <li>informação sobre com quem seus dados foram compartilhados;</li>
          <li>informação sobre a possibilidade de não consentir e as consequências da negativa;</li>
          <li>revogação do consentimento, quando ele for a base legal.</li>
        </ul>
        <h3>Como solicitar acesso, correção ou exclusão</h3>
        <ol>
          <li>
            Envie um e-mail para {mail} com o assunto “Privacidade — solicitação de titular”.
          </li>
          <li>
            Informe seu nome, o número de telefone usado no WhatsApp (quando a solicitação envolver conversas) e,
            se souber, o nome da empresa com quem você conversou.
          </li>
          <li>Descreva o que deseja: acesso, correção, exclusão ou outro direito.</li>
        </ol>
        <p>
          Poderemos pedir informações adicionais para confirmar sua identidade e proteger seus dados. Quando a
          solicitação envolver dados que tratamos como operadora, vamos encaminhá-la à empresa controladora e
          apoiá-la na resposta. Os prazos de resposta seguem o art. 19 da LGPD.
        </p>
        <p>
          Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) pelo site{" "}
          <a
            href="https://www.gov.br/anpd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline-offset-4 hover:underline"
          >
            gov.br/anpd
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies no site",
    content: (
      <>
        <p>
          O site {site.url.replace("https://", "")} usa a tag do Google Ads, carregada ao abrir qualquer página.
          Ela grava cookies e identificadores no seu navegador, como <code>_gcl_au</code> e, quando você chega por
          um anúncio, <code>_gcl_aw</code>, além de cookies do próprio Google em domínios como google.com e
          doubleclick.net. Esses dados são usados para medir conversões (por exemplo, cliques para falar conosco
          no WhatsApp) e podem ser usados pelo Google para formar públicos de anúncios (remarketing).
        </p>
        <p>
          Para se opor a esse uso, você pode bloquear ou apagar cookies nas configurações do seu navegador e
          desativar anúncios personalizados em{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline-offset-4 hover:underline"
          >
            adssettings.google.com
          </a>
          . Mais informações em{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline-offset-4 hover:underline"
          >
            Como o Google usa cookies em publicidade
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "contato",
    title: "Contato para assuntos de privacidade",
    content: (
      <p>
        Dúvidas, solicitações e comunicações sobre privacidade e proteção de dados devem ser enviadas a{" "}
        <strong>{site.founderFullName}</strong>, pelo e-mail {mail}.
      </p>
    ),
  },
  {
    id: "alteracoes",
    title: "Alterações desta política",
    content: (
      <p>
        Esta política pode ser atualizada para refletir mudanças nos nossos serviços, na legislação ou nas
        políticas da Meta. A versão vigente estará sempre disponível nesta página, com a data da última
        atualização indicada no topo.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line pt-[env(safe-area-inset-top,0px)]">
        <div className="container-page flex h-16 items-center justify-between">
          <a href="/" aria-label="scob. — página inicial">
            <Logo />
          </a>
          <Button asChild size="sm" variant="secondary">
            <a href="/">
              <ArrowLeft />
              Voltar ao site
            </a>
          </Button>
        </div>
      </header>

      <main className="container-page py-14 sm:py-20">
        <div className="max-w-3xl">
          <Eyebrow>Privacidade e LGPD</Eyebrow>
          <h1 className="text-gradient mt-5 text-[2rem] leading-[1.08] font-semibold sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Como a Scobtech trata dados pessoais no site e nos sistemas que desenvolve, incluindo o Scobtech
            Atendimento e o Lelli Connect.
          </p>
          <p className="mt-4 text-sm text-subtle">
            Última atualização: <time dateTime={LAST_UPDATED.iso}>{LAST_UPDATED.label}</time>
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Nesta página" className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="font-sans text-xs font-medium tracking-wider text-foreground/60 uppercase">
              Nesta página
            </h2>
            <ol className="mt-4 space-y-2.5 border-l border-line pl-4 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-subtle transition-colors hover:text-foreground">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl space-y-12">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="scroll-mt-8">
                <h2 id={`${s.id}-titulo`} className="text-xl font-semibold text-foreground sm:text-2xl">
                  <span className="mr-2 text-brand">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base [&>h3]:pt-2 [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-foreground [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand">
                  {s.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
