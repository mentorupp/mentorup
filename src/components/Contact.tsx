"use client";

import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { contactInfo } from "@/lib/data";
import SectionHeader from "./SectionHeader";

const serviceOptions = [
  "TCC & Monografia",
  "Relatório de Estágio",
  "Relatórios Acadêmicos",
  "Atividades & Trabalhos",
  "Artigos Científicos",
  "Apresentações & Slides",
  "Revisão & Normatização",
  "Projetos de Pesquisa",
  "Fichamentos & Resenhas",
  "Outro",
];

export default function Contact({ hideHeader = false }: { hideHeader?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          course: fd.get("course"),
          service: fd.get("service"),
          deadline: fd.get("deadline") || undefined,
          message: fd.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");
      setSubmitted(true);
      form.reset();
    } catch {
      alert("Erro ao enviar. Tente novamente ou use o WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-[#f8f9fb]">
      <div className="container-custom">
        {!hideHeader && (
          <SectionHeader
          label="Contato"
          title={
            <>
              Fale com a gente em{" "}
              <span className="text-gradient">minutos</span>
            </>
          }
          description="Orçamento gratuito. Resposta em até 2 horas úteis."
          />
        )}

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="card-premium p-5">
              <h3 className="font-display text-lg font-bold text-surface-900">
                Canais de atendimento
              </h3>
              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">E-mail</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-600 hover:underline"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      Telefone
                    </p>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                      className="text-sm text-zinc-600"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      Endereço
                    </p>
                    <p className="text-sm text-zinc-600">{contactInfo.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      Horário
                    </p>
                    <p className="text-sm text-zinc-600">{contactInfo.hours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=Olá! Gostaria de solicitar um orçamento na MentorUp.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/20 transition-all hover:brightness-110"
            >
              <MessageCircle size={20} />
              Chamar no WhatsApp
            </a>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-accent-200 bg-accent-50 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500 text-white">
                  <Send size={28} />
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold text-surface-900">
                  Mensagem enviada!
                </h3>
                <p className="mt-3 max-w-sm text-zinc-600">
                  Recebemos sua solicitação. Nossa equipe entrará em contato em
                  breve com um orçamento personalizado.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card-premium p-5 sm:p-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-surface-900"
                    >
                      Nome completo *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Seu nome"
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-surface-900"
                    >
                      E-mail *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-surface-900"
                    >
                      WhatsApp *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="course"
                      className="mb-1.5 block text-sm font-medium text-surface-900"
                    >
                      Curso *
                    </label>
                    <input
                      id="course"
                      name="course"
                      type="text"
                      required
                      placeholder="Ex: Engenharia Civil"
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="mb-1.5 block text-sm font-medium text-surface-900"
                    >
                      Serviço desejado *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecione um serviço
                      </option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="deadline"
                      className="mb-1.5 block text-sm font-medium text-surface-900"
                    >
                      Prazo de entrega
                    </label>
                    <input
                      id="deadline"
                      name="deadline"
                      type="date"
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-surface-900"
                  >
                    Descreva seu projeto *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Conte-nos sobre o trabalho, tema, número de páginas, requisitos da instituição..."
                    className="w-full resize-none rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm transition-colors outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-70"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar solicitação
                      <Send size={18} />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-zinc-500">
                  Ao enviar, você concorda com nossa política de privacidade.
                  Seus dados estão protegidos conforme a LGPD.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
