import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import MentorUpLogo from "@/components/MentorUpLogo";
import { contactInfo, footerLinks, navLinks, services } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-surface-950 text-zinc-400">
      <div className="container-custom px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <MentorUpLogo href="/" variant="white" size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Consultoria acadêmica de excelência para estudantes que buscam
              qualidade, originalidade e resultados comprovados.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Instagram, href: contactInfo.social.instagram, label: "Instagram" },
                { icon: Linkedin, href: contactInfo.social.linkedin, label: "LinkedIn" },
                { icon: Youtube, href: contactInfo.social.youtube, label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-800 text-zinc-400 transition-colors hover:bg-primary-600 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
              Navegação
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
              Serviços
            </h4>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href="/consultoria"
                    className="text-sm transition-colors hover:text-primary-400"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold tracking-wider text-white uppercase">
              Contato
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <Mail size={16} className="mt-0.5 shrink-0 text-primary-400" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="transition-colors hover:text-primary-400"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Phone size={16} className="mt-0.5 shrink-0 text-primary-400" />
                {contactInfo.phone}
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-accent-400" />
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent-400"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                {contactInfo.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-800 pt-6 sm:flex-row">
          <p className="text-sm">
            &copy; {currentYear} MentorUp. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="transition-colors hover:text-primary-400">
              Política de Privacidade
            </Link>
            <Link href="#" className="transition-colors hover:text-primary-400">
              Termos de Uso
            </Link>
            <Link href="#" className="transition-colors hover:text-primary-400">
              LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
