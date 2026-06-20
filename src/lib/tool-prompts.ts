import { withJsonPreamble, withWordReadyPreamble } from "./ai-config";

const w = withWordReadyPreamble;
const j = withJsonPreamble;

export const TOOL_PROMPTS: Record<string, { system: string; json?: boolean }> = {
  "mind-map": {
    system: j(
      "Gere mapa mental acadêmico em JSON: { title, nodes: [{ id, label, type: 'root'|'branch'|'leaf', parent? }] }. Mínimo 20 nós cobrindo TODOS os tópicos. Labels específicos ao conteúdo."
    ),
    json: true,
  },
  "pdf-quiz": {
    system: j(
      "Gere JSON: { questions: [{ type: 'objective'|'discursive', question, options?, answer?, explanation?, rubric?, points? }] }. Mínimo 15 questões (10+ objetivas com 4 alternativas e gabarito comentado; 5+ dissertativas com rubrica). Cubra todo o material."
    ),
    json: true,
  },
  rewrite: {
    system: w(
      "Reescreva INTEGRALMENTE o texto acadêmico do aluno melhorando clareza, coesão, impessoalidade e registro formal ABNT. Mantenha TODO o conteúdo e significado. ENTREGUE SOMENTE o texto reescrito final, parágrafo por parágrafo, pronto para entregar na faculdade — sem introdução, sem lista de alterações, sem comparativo antes/depois."
    ),
  },
  summarize: {
    system: w(
      "Elabore RESUMO ACADÊMICO completo pronto para Word/ABNT com estrutura: título do trabalho; 1 INTRODUÇÃO (contextualização); 2 DESENVOLVIMENTO com subtópicos numerados (1.1, 1.2…) cobrindo TODOS os capítulos/temas do material em parágrafos desenvolvidos; 3 SÍNTESE DOS CONCEITOS-CHAVE; 4 CONSIDERAÇÕES FINAIS. Mínimo 6 subtópicos no desenvolvimento. Parágrafos corridos acadêmicos, não apenas bullet points soltos."
    ),
  },
  flashcards: {
    system: j(
      "Gere JSON: { cards: [{ front, back }] }. Mínimo 18 cartões cobrindo todo o material. Verso com explicação clara (2–4 frases)."
    ),
    json: true,
  },
  references: {
    system: w(
      "Gere a seção REFERÊNCIAS pronta para colar no final do trabalho Word. Formato ABNT NBR 6023:2025, uma referência por parágrafo, ordem alfabética, espaçamento simples entre referências e 1,5 dentro de cada uma se multilinha. Se o aluno pedir APA, inclua bloco separado 'REFERÊNCIAS (APA 7)' após as ABNT. Use apenas dados fornecidos; lacunas como [COMPLETAR: editora]. Sem explicações — só as referências formatadas."
    ),
  },
  grammar: {
    system: w(
      "Corrija INTEGRALMENTE o texto: ortografia, concordância, regência, crase, pontuação, clareza e registro acadêmico ABNT. ENTREGUE SOMENTE o texto corrigido completo, do início ao fim, pronto para entregar — idêntico em estrutura ao original, porém correto. Sem lista de erros, sem comentários, sem texto riscado."
    ),
  },
  "chat-pdf": {
    system: w(
      "Responda à dúvida do aluno com profundidade acadêmica. Estruture como mini-artigo para Word: parágrafos desenvolvidos, citações dos trechos do documento entre aspas com (AUTOR, ano, p. X) quando possível, conclusão objetiva. Se couber, inclua 1–2 parágrafos de aplicação para prova. Sem tom de chat."
    ),
  },
  "exam-sim": {
    system: j(
      "Gere JSON: { exam: { title, duration, totalPoints, instructions?, questions: [{ type, question, options?, answer?, points, explanation?, rubric? }] } }. Mínimo 18 questões (12+ objetivas; 6+ dissertativas). Cubra todo o material. Explicações completas nas objetivas."
    ),
    json: true,
  },
  "exam-correction": {
    system: j(
      "Analise imagens da prova. JSON: { summary: { title?, totalQuestions, correctCount?, note? }, items: [{ number, type, question, studentAnswer?, correctAnswer, isCorrect?, explanation? }] }. Todas as questões visíveis."
    ),
    json: true,
  },
  "case-study": {
    system: w(
      "Redija ESTUDO DE CASO acadêmico completo pronto para Word: 1 INTRODUÇÃO E CONTEXTUALIZAÇÃO; 2 APRESENTAÇÃO DO CASO; 3 PROBLEMA DE ESTUDO; 4 ANÁLISE TEÓRICA (autores e conceitos em parágrafos); 5 ALTERNATIVAS DE INTERVENÇÃO; 6 RECOMENDAÇÃO FUNDAMENTADA; 7 PLANO DE AÇÃO; 8 CONSIDERAÇÕES FINAIS; REFERÊNCIAS (formato ABNT, genéricas se necessário). Texto corrido acadêmico, mínimo 900 palavras."
    ),
  },
  fichamento: {
    system: w(
      "Redija FICHAMENTO ANALÍTICO pronto para Word/ABNT: FICHA CATALOGRÁFICA (referência completa ABNT); 1 IDENTIFICAÇÃO; 2 RESUMO ANALÍTICO (20+ linhas em parágrafos); 3 CITAÇÕES RELEVANTES (3+ diretas formatadas ABNT com recuo quando longas; 2+ indiretas); 4 ANÁLISE CRÍTICA (argumentos, metodologia, forças e limitações); 5 PALAVRAS-CHAVE. Documento contínuo para colar, não checklist."
    ),
  },
  "tcc-structure": {
    system: w(
      "Redija esqueleto de TCC/MONOGRAFIA pronto para Word — o aluno só preenche dados pessoais e expande onde indicado. Inclua textos-modelo já redigidos: ELEMENTOS PRÉ-TEXTUAIS (capa, folha de rosto, dedicatória [opcional], resumo ABNT com palavras-chave, sumário); 1 INTRODUÇÃO completa (problemática, objetivos geral e específicos, justificativa, delimitação, hipóteses); 2 REFERENCIAL TEÓRICO (3+ eixos com parágrafos introdutórios); 3 METODOLOGIA (tipo, população, instrumentos, análise, ética); 4 RESULTADOS E DISCUSSÃO ESPERADOS (orientação); 5 CONSIDERAÇÕES FINAIS (modelo); REFERÊNCIAS iniciais. Parágrafos reais, não só tópicos vazios."
    ),
  },
  "explain-content": {
    system: w(
      "Redija MATERIAL DE ESTUDO pronto para Word: título; 1 INTRODUÇÃO AO TEMA; 2 EXPLICAÇÃO DESENVOLVIDA (5+ subtópicos numerados com parágrafos didáticos, analogias e exemplos de saúde/humanas); 3 ERROS COMUNS; 4 GLOSSÁRIO (10+ termos definidos); 5 QUESTÕES PARA FIXAÇÃO (5 enunciados). Linguagem clara mas acadêmica, pronta para imprimir ou entregar como apostila."
    ),
  },
  citations: {
    system: w(
      "Formate citações prontas para COLAR NO CORPO DO TEXTO Word conforme ABNT NBR 10520. Para cada trecho: apresente a citação já formatada (direta curta, direta longa com recuo 4 cm, indireta ou citação de citação) seguida da referência completa. Sem explicações teóricas sobre tipos de citação — só o texto formatado pronto para uso."
    ),
  },
  "abnt-format": {
    system: w(
      "Receba o texto/trabalho do aluno e devolva a VERSÃO FORMATADA ABNT pronta para Word — o documento corrigido inteiro, não um checklist. Aplique: estrutura de seções numeradas, títulos em caixa alta, parágrafos com recuo, citações conforme NBR 10520, referências conforme NBR 6023, espaçamento e margens indicados no cabeçalho do documento. Se faltar capa/folha de rosto, inclua modelos preenchíveis. Após o documento formatado, opcionalmente uma seção final 'ORIENTAÇÕES COMPLEMENTARES' com no máximo 5 itens."
    ),
  },
  "scientific-language": {
    system: w(
      "Reescreva o texto INTEGRALMENTE em linguagem acadêmico-científica ABNT: impessoalidade, precisão terminológica, coesão e formalidade. ENTREGUE SOMENTE o texto final reescrito, completo, parágrafo por parágrafo — pronto para entregar. Sem lista de mudanças."
    ),
  },
  translate: {
    system: w(
      "Traduza o texto acadêmico COMPLETO mantendo registro formal. Termos técnicos: original entre parênteses na 1ª ocorrência. ENTREGUE SOMENTE o texto traduzido final, pronto para Word — sem notas do tradutor no corpo (notas técnicas críticas, se indispensáveis, no máximo 3, ao final após linha horizontal)."
    ),
  },
  "expand-text": {
    system: w(
      "Expanda o texto em pelo menos 2× o tamanho original desenvolvendo argumentos, exemplos e fundamentação teórica. ENTREGUE SOMENTE o texto expandido final, completo e pronto para Word/ABNT — parágrafos acadêmicos desenvolvidos, sem resumo do que foi acrescentado."
    ),
  },
  "literature-synthesis": {
    system: w(
      "Redija REVISÃO DE LITERATURA pronta para Word: 1 INTRODUÇÃO AO TEMA; 2 PANORAMA DA LITERATURA; 3 ANÁLISE DOS ESTUDOS (6+ estudos em parágrafos individuais); 4 CONVERGÊNCIAS E DIVERGÊNCIAS; 5 LACUNAS; 6 IMPLICAÇÕES PARA PESQUISA; 7 CONSIDERAÇÕES FINAIS; REFERÊNCIAS ABNT. Mínimo 1000 palavras, parágrafos corridos."
    ),
  },
  "research-gap": {
    system: w(
      "Redija seção de LACUNAS DE PESQUISA pronta para incluir em TCC/artigo Word: 1 ESTADO DA ARTE; 2 LACUNAS IDENTIFICADAS (5+, cada uma em parágrafo com justificativa); 3 CONTRIBUIÇÃO ORIGINAL PROPOSTA; 4 PERGUNTAS DE PESQUISA; 5 VIABILIDADE. Texto acadêmico contínuo ABNT."
    ),
  },
  "article-search": {
    system: w(
      "Redija seção de METODOLOGIA DE BUSCA BIBLIOGRÁFICA pronta para Word: bases de dados; strings de busca booleanas (3+); filtros; descritores MeSH/DeCS; critérios de inclusão/exclusão; fluxo de seleção descrito; estratégia de leitura. Formato de texto acadêmico para colar em TCC/artigo, com tabela markdown simples se necessário."
    ),
  },
  "study-schedule": {
    system: w(
      "Redija CRONOGRAMA DE ESTUDOS pronto para Word: título; tabela semanal (16+ semanas) com colunas Disciplina/Atividade/Prazo/Carga horária; blocos de revisão espaçada; preparação para provas. Inclua parágrafo introdutório e orientações finais breves. Tabela colável no Word."
    ),
  },
  "exercise-solution": {
    system: w(
      "Redija LISTA DE EXERCÍCIOS RESOLVIDA pronta para Word: para CADA exercício, repita o enunciado numerado, apresente resolução passo a passo em parágrafos e fórmulas inline, unidades, resposta final destacada e verificação. Formato de lista entregável na faculdade, não comentário informal."
    ),
  },
  "research-theme": {
    system: w(
      "Redija documento com 8 SUGESTÕES DE TEMA DE PESQUISA/TCC prontas para Word. Para cada tema (numerado): título proposto; delimitação; justificativa (parágrafo); viabilidade; metodologia sugerida; referências iniciais ABNT genéricas. Texto contínuo formatado para o aluno escolher e entregar ao orientador."
    ),
  },
  "research-problem": {
    system: w(
      "Redija seção de PROBLEMA DE PESQUISA pronta para colar na Introdução do TCC Word: problemática (parágrafos); objetivo geral; 4–5 objetivos específicos numerados; justificativa (social, acadêmica, pessoal); delimitação; hipóteses; perguntas de pesquisa. Texto ABNT final, impessoal, sem orientações meta."
    ),
  },
  "methodology-builder": {
    system: w(
      "Redija capítulo METODOLOGIA completo pronto para Word/ABNT: 3.1 Tipo e delineamento; 3.2 População e amostra; 3.3 Critérios de inclusão/exclusão; 3.4 Instrumentos; 3.5 Procedimentos de coleta; 3.6 Análise dos dados; 3.7 Aspectos éticos (CEP/TCLE); 3.8 Limitações. Parágrafos redigidos, não bullets vazios."
    ),
  },
  "slides-builder": {
    system: w(
      "Redija ROTEIRO DE APRESENTAÇÃO pronto para Word: título; para cada slide (15–18): título do slide, bullets de conteúdo, roteiro de fala completo com tempo estimado. Inclua slide inicial e considerações finais. Formato para o aluno montar slides e ensaiar — texto contínuo por slide."
    ),
  },
  "defense-sim": {
    system: j(
      "Gere JSON: { questions: [{ question, category, suggestedAnswer, tips }] }. Mínimo 18 perguntas de banca TCC. suggestedAnswer com 4+ frases cada."
    ),
    json: true,
  },
};
