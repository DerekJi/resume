# Derek Ji — Senior Engineer & AI Systems Developer

## Contact
- Phone: 0433 787 282
- Email: syfool@hotmail.com
- Website: https://derekji.github.io
- Blog: https://derek-ji.medium.com/
- GitHub: https://github.com/DerekJi

---

## Summary

Senior engineer with 20+ years of engineering breadth (10+ years in enterprise .NET / cloud), independently designing and building production-grade AI systems from first principles. Currently Senior Engineer at Youi Insurance, delivering full-stack cloud-native insurance platforms. Independently built VedaAide.NET — a private production-grade RAG platform on .NET 10 with dual hallucination detection, MCP server, IRCoT agent orchestration, and a full evaluation framework.

Core differentiators: deep hands-on AI/ML engineering ability, combined with enterprise .NET + Angular delivery skills at scale.

---

## Skills & Technology Stack

### AI / Machine Learning Engineering
- **RAG (Retrieval-Augmented Generation)**: Full end-to-end pipeline design — multi-stage document ingestion, PDF text extraction (PdfPig), Azure Document Intelligence OCR, multimodal vision LLM fallback (qwen3-vl:8b), sliding-window chunking with per-document-type token budgets (256–1024 tokens, 25% overlap), cosine-based semantic deduplication, batch embedding with token usage tracking, vector storage and retrieval
- **Embedding**: `IEmbeddingGenerator<string, Embedding<float>>` from `Microsoft.Extensions.AI`; dual provider — Ollama bge-m3 (local) / Azure OpenAI text-embedding-3-small (cloud); token usage captured from `UsageDetails`
- **Vector Search**: Pure-math `VectorMath.CosineSimilarity()` over `ReadOnlySpan<float>`; CosmosDB DiskANN approximate nearest-neighbor via `VectorDistance()` SQL; SQLite in-memory float[] cosine fallback
- **Hybrid Retrieval**: Dual-channel concurrent fusion — vector search + keyword search, merged with Reciprocal Rank Fusion (RRF, k=60 standard) or weighted sum (70% vector + 30% keyword); `HybridRetriever` with runtime strategy selection
- **Reranking & Feedback**: Base 70/30 reranking boosted by user feedback history (`CosmosDbUserMemoryStore`): Accept events → +0.2, Reject → -0.15, clamped to [0.3, 2.0]
- **Hallucination Detection**: Two-layer architecture — layer 1: embedding cosine similarity threshold (`HallucinationSimilarityThreshold`); layer 2 (optional): LLM self-verification via `HallucinationGuardService` with independent fact-check prompt
- **Semantic Caching**: Embedding-similarity cache with configurable TTL and cosine threshold (`SemanticCacheOptions`); cache hits skip full retrieval + LLM call; async write (fire-and-forget)
- **Query Enhancement**: Query expansion via `ISemanticEnhancer.ExpandQueryAsync()`; alias/synonym tag appending via `GetAliasTagsAsync()`; automatic language detection (CJK ratio > 33% → Chinese mode)
- **Agent Orchestration (IRCoT)**: Interleaved Retrieval + Chain-of-Thought using `ChatCompletionAgent` from Semantic Kernel Agents.Core; `VedaKernelPlugin` registered as `"KnowledgeBase"` tool; `FunctionChoiceBehavior.Auto()` — LLM decides when to call; QueryAgent → optional EvalAgent pipeline
- **MCP (Model Context Protocol)**: HTTP/SSE MCP server at `/mcp` (ModelContextProtocol.AspNetCore 1.1.0); tools: `search_knowledge_base`, `list_documents`, `ingest_document` — integrates directly with VS Code GitHub Copilot
- **RAG Evaluation Framework**: `EvaluationRunner` against golden dataset; three scorers: Faithfulness (LLM judge prompt), Answer Relevancy (cosine sim between question + answer embeddings), Context Recall (cosine sim between expected + max chunk embedding); `EvaluationReport` with `AvgOverall` across all dimensions
- **SSE Streaming**: `IAsyncEnumerable<RagStreamChunk>` yielding event types: `sources` → token chunks → `done`
- **Prompt Engineering**: DB-driven system prompt templates (`IPromptTemplateRepository`); dynamic date injection; CoT and structured JSON output modes; bilingual (auto-language detection)
- **LLM Providers (multi-provider, switchable)**: Azure OpenAI (gpt-4o-mini chat, text-embedding-3-small), Ollama (qwen3:8b chat, bge-m3 embedding, qwen3-vl:8b vision), DeepSeek (deepseek-chat via OpenAI-compatible SK connector at api.deepseek.com)
- **Semantic Kernel 1.74**: Core orchestration; `IKernel` with per-request clone for plugin isolation; SK connectors for Azure OpenAI + Ollama; `Microsoft.Extensions.AI` abstraction layer

### Backend & Cloud Engineering
- **.NET 10 / C# / ASP.NET Core**: Clean Architecture, SRP/DRY/SOLID; DI with keyed services (`AddKeyedSingleton`); `IOptions<T>` configuration pattern; background services; dual storage abstraction behind `IVectorStore`
- **Azure**: App Service, Functions, Azure OpenAI, Cosmos DB for NoSQL (DiskANN vector index, `VectorDistance()` queries), Blob Storage, SignalR, Azure AD / MSAL / Entra ID JWT, Key Vault, Document Intelligence (OCR + form extraction), Service Bus
- **GraphQL**: HotChocolate 15 — `Query.AskAsync()` for RAG Q&A, `Mutation.IngestDocumentAsync()` for ingestion
- **REST + JWT**: Microsoft Entra ID authentication; admin policy; rate limiting per IP (fixed window); CORS policy management
- **Entity Framework Core 10**: SQLite with `AsNoTracking()`, `EF.Functions.Like` for keyword search
- **Patterns**: BFF (Backend-for-Frontend), microservices, event-driven, CQRS, Strategy, Options, Factory, DIP adapters

### Frontend Engineering
- **Angular 21 / TypeScript**: Signals, SSE streaming client, reactive forms, lazy-loaded feature modules, scroll spy
- **SCSS / Bootstrap 4**: Custom dark design systems, responsive layouts, CSS animations (keyframes, conic-gradient)
- **RxJS**: Observable-based SSE streaming; retry strategies

### Testing & Quality
- **Backend**: NUnit, NSubstitute, Shouldly; 100+ automated tests in VedaAide; SQLite in-memory for integration tests
- **Frontend**: Jest, Playwright E2E; Elastic APM observability
- **CI/CD**: GitHub Actions; TreatWarningsAsErrors; NuGet security auditing; ESLint + Prettier; strict quality gates

---

## Certifications

- **Microsoft Certified: DevOps Engineer Expert** — Nov 2021 (Credly verified)
- **Microsoft Certified: Azure Developer Associate** — Sep 2021 (Credly verified)
- **MCSD: App Builder** — Nov 2018
- **MCSA: Web Applications** — Nov 2018

---

## Work Experience

### Senior Engineer — Youi Insurance
**Jan 2023 – Present | Sippy Downs, QLD, Australia**

**Advisor Portal Modernisation (2023)**
Led migration of the legacy broker-facing insurance platform to the new ScreenDriver + Angular architecture:
- Architected and delivered SBI (Small Business Insurance) and Vehicle (VEH) quoting & checkout flows using the ScreenDriver BFF pattern (.NET 8 + Angular 21)
- Designed integration layer for downstream services: PolicyAdmin, PaymentGateway, Address, Consent, IVR, ABN Lookup, ActivityLogger, and Lookups
- Real-time broker notifications via Azure SignalR; flow state persistence with Azure Blob Storage; session caching with Redis
- Introduced .NET Aspire for orchestrated local development (API + UI + Redis); gated feature releases via LaunchDarkly
- Azure AD / MSAL authentication; comprehensive unit and integration test coverage

**Direct Customer Quotes / DCQ (2024 – ongoing)**
Senior engineer on public-facing insurance quote & buy platform deployed to Azure external landing zone:
- Delivered end-to-end quote flows for Vehicle and Small Business Insurance (SBI); currently extending to Motorcycle
- Designed Refit HTTP clients integrating identity verification, Summit pricing engine, payment gateway, address & vehicle data services
- Front-end observability with Elastic APM; analytics with Google Tag Manager
- Strict CI quality gates: TreatWarningsAsErrors, NuGet security audit, ESLint + Prettier, Playwright E2E tests

*Technologies: .NET 8 (C#), ASP.NET Core, Angular 21, Azure (Aspire, Redis, Blob Storage, SignalR, AD/MSAL, Key Vault), LaunchDarkly, Refit, FluentValidation, NUnit, NSubstitute, Playwright, GitHub Actions*

---

### Senior Full Stack Developer — Boardroom Limited
**May 2022 – Dec 2022 | Sydney, NSW, Australia**

Developed new features for payroll and share management platforms; maintained and upgraded existing services.

*Technologies: Angular 13+, .NET Core & .NET Framework, Oracle & PL/SQL, Entity Framework Core, TDD*

---

### Senior Developer — Alcidion
**Nov 2021 – May 2022 | Adelaide, SA, Australia**

Microservices-based healthcare web applications:
- Subscription service, Audit service, FHIR-modelling service

*Technologies: .NET 6 (C#), microservices, event-driven, RabbitMQ, NServiceBus, MSSQL, PostgreSQL, ElasticSearch, Redis, Docker/Kubernetes*

---

### Full Stack Developer — RAA
**Dec 2020 – Nov 2021 | Adelaide, SA, Australia**

- Rewrote the "Quote to Buy" application: decoupled from core services, IaaS → PaaS migration, Azure DevOps CI/CD
- Delivered payment gateway integration end-to-end: API design, integration, automated regression tests, on-schedule delivery

*Technologies: .NET (C#), Angular, Entity Framework Core, Azure (App Service, Functions, Blob Storage, Queue), TDD*

---

### Full Stack Developer — Department for Infrastructure and Transport (SA Government)
**Jun 2019 – Dec 2020 | Adelaide, SA, Australia**

- Built Contractor Management and Compliance system
- LTO Fee Calculator: dynamic form engine supporting 200+ land service types, configurable by business staff without developer involvement
- Rebuilt the public-facing LocationSA Map Viewer

*Technologies: Angular 8, .NET Core 2.1, PostgreSQL, DynamoDB, AWS (S3, Lambda)*

---

### .NET Full Stack Developer — Novaworks Software
**Feb 2018 – Jun 2019 | Adelaide, SA, Australia**

Built and supported parliamentary websites for NSW, VIC, and SA governments.

*Technologies: .NET Core 2.0, React, SCSS, Bootstrap, CI/CD (AppVeyor + Octopus Deploy)*

---

## Personal Projects

### VedaAide.NET — Private Production-Grade AI Platform
**2024 – ongoing | github.com/DerekJi/VedaAide.NET**

Enterprise-grade private RAG system independently designed and built from first principles on .NET 10.

**Document Ingestion Pipeline:**
- Multi-stage extraction chain: PdfPig (fast text layer) → Azure Document Intelligence OCR → qwen3-vl:8b vision LLM fallback
- Sliding-window chunking: 256–1024 tokens (per document type), ~25% overlap; semantic deduplication via cosine threshold
- Batch embedding via `IEmbeddingGenerator<string, Embedding<float>>`; SHA-256 content-hash dedup before vector store write
- Semantic alias/synonym enhancement via `ISemanticEnhancer.GetAliasTagsAsync()`

**Retrieval & Generation:**
- Hybrid retrieval: concurrent vector + keyword channels fused via Reciprocal Rank Fusion (RRF, k=60)
- Reranking: 70% vector score + 30% keyword coverage, boosted by user accept/reject feedback history
- Semantic cache with cosine-similarity lookup and TTL: cache-hit skips full retrieval + LLM call
- Chain-of-Thought prompt enhancement and structured JSON output modes

**Hallucination Safety:**
- Layer 1: cosine similarity threshold between answer embedding and source chunk embeddings
- Layer 2 (optional): `HallucinationGuardService` — LLM self-verification via independent fact-check prompt

**RAG Evaluation:**
- `EvaluationRunner` against golden dataset; Faithfulness (LLM judge), Answer Relevancy (cosine sim), Context Recall (max chunk cosine sim)
- `EvaluationReport.AvgOverall` across all dimensions and test cases

**API Surfaces:**
- REST + SSE streaming (`IAsyncEnumerable<RagStreamChunk>`: sources → tokens → done)
- GraphQL (HotChocolate 15): `Query.AskAsync`, `Mutation.IngestDocumentAsync`
- MCP server at `/mcp` (ModelContextProtocol.AspNetCore 1.1.0): `search_knowledge_base`, `list_documents`, `ingest_document` — integrates with VS Code GitHub Copilot

**Agent Orchestration (IRCoT):**
- `ChatCompletionAgent` from Semantic Kernel Agents.Core with `VedaKernelPlugin` as `"KnowledgeBase"` tool
- `FunctionChoiceBehavior.Auto()` — LLM decides when to invoke retrieval
- QueryAgent → EvalAgent pipeline with full reasoning trace

**Dual Storage Backend (swappable via config):**
- SQLite: in-memory cosine similarity over `float[]`, EF Core keyword matching; used in local dev + integration tests
- CosmosDB: DiskANN approximate nearest-neighbor, `VectorDistance()` SQL, partition key `/documentId`, scalar filters

**Data Connectors & Operations:**
- Azure Blob Storage + local FileSystem connectors; `DataSourceSyncBackgroundService` with content-hash incremental sync
- Knowledge governance: sharing groups, document authorization, `CosmosDbUserMemoryStore` for feedback boosting
- Per-user JWT scope isolation via `ICurrentUserService`; `CosmosDbTokenUsageRepository` for LLM cost tracking

*Stack: .NET 10 · C# · Semantic Kernel 1.74 · Azure OpenAI / Ollama / DeepSeek · CosmosDB DiskANN · Angular 21 · GraphQL HotChocolate 15 · Docker Compose · Cloudflare Tunnel*

---

### My Online Resume — AI-Powered Dynamic Resume Site
**2025 – ongoing | derekji.github.io**

Angular-based online resume with integrated AI tailoring feature:
- Recruiter pastes any job description (JD) → VedaAide RAG generates a tailored Markdown resume in real-time via SSE streaming
- Radar scan animation during generation; JD collapses on completion; rendered HTML output with PDF download
- Public API endpoint with IP rate limiting and CORS restrictions (no login required)

*Angular 21 · TypeScript · marked · SSE · REST*

---

## Education

**Master of Computer Science**
Ji'Nan University, Guangzhou, China — 2001–2004

**Bachelor of Mining Engineering**
Northeastern University, Shenyang, China — 1996–2000

---

## Online Presence

- Website: https://derekji.github.io
- Blog: https://derek-ji.medium.com/
- GitHub: https://github.com/DerekJi


---

## Skills & Keywords

- Languages & Frameworks: C# / .NET 8+, TypeScript / Angular 20, React
- Cloud: Azure (App Service, Functions, Blob Storage, SignalR, Redis, Service Bus, Azure AD / MSAL, Aspire, DevOps)
- AI / ML: RAG pipelines, Semantic Kernel, Ollama, Azure OpenAI (GPT-4o-mini), vector search, MCP (Model Context Protocol)
- Databases: SQL Server, PostgreSQL, CosmosDB (NoSQL), SQLite, Oracle, DynamoDB
- Patterns: BFF, microservices, event-driven, CQRS, Clean Architecture, TDD
- CI/CD: GitHub Actions, Azure DevOps, AppVeyor, Octopus Deploy, Docker, Kubernetes

---

## Certifications

- Microsoft Certified: DevOps Engineer Expert — Nov 2021
- Microsoft Certified: Azure Developer Associate — Sep 2021
- MCSD: App Builder — Nov 2018
- MCSA: Web Applications — Nov 2018

---

## Work Experience

### Senior Engineer — Youi Insurance
**Jan 2023 – Present | Sippy Downs, QLD, Australia**

**Advisor Portal Modernisation (2023)**
Led migration of the legacy broker-facing insurance platform to the new ScreenDriver + Angular architecture:
- Architected and delivered SBI (Small Business Insurance) and Vehicle (VEH) quoting & checkout flows using the ScreenDriver BFF pattern (.NET 8 + Angular 20)
- Designed integration layer for downstream services: PolicyAdmin, PaymentGateway, Address, Consent, IVR, ABN Lookup, ActivityLogger and Lookups
- Real-time broker notifications via Azure SignalR; flow state persistence with Azure Blob Storage; session caching with Redis
- Introduced .NET Aspire for orchestrated local development (API + UI + Redis); gated feature releases via LaunchDarkly
- Azure AD / MSAL authentication; comprehensive unit and integration test coverage

**Direct Customer Quotes / DCQ (2024 – present)**
Senior engineer on public-facing insurance quote & buy platform deployed to Azure external landing zone:
- Delivered end-to-end quote flows for Vehicle and Small Business Insurance (SBI); extending to Motorcycle
- Designed Refit HTTP clients integrating identity verification, Summit pricing engine, payment gateway, address & vehicle data services
- Established front-end observability with Elastic APM and analytics with Google Tag Manager
- Enforced strict CI quality gates: TreatWarningsAsErrors, NuGet security audit, ESLint + Prettier, Playwright E2E tests

*Technologies: .NET 8 (C#) / ASP.NET Core, Angular 20, Azure (Aspire, Redis, Blob, SignalR, AD/MSAL), LaunchDarkly, Refit, FluentValidation, NUnit, Playwright, GitHub Actions*

---

### Senior Full Stack Developer — Boardroom Limited
**May 2022 – Dec 2022 | Sydney, NSW, Australia**

Developed new features for payroll and share management platforms. Maintained and upgraded existing services.

*Technologies: Angular 13+, .NET Core & .NET Framework, Oracle & PL/SQL, Entity Framework Core, TDD*

---

### Senior Developer — Alcidion
**Nov 2021 – May 2022 | Adelaide, SA, Australia**

Designed and implemented microservices-based healthcare web applications:
- Subscription service, Audit service, FHIR-modelling service

*Technologies: .NET 6 (C#), microservices, event-driven, RabbitMQ, NServiceBus, MSSQL, PostgreSQL, ElasticSearch, Redis, Docker / Kubernetes*

---

### Full Stack Developer — RAA
**Dec 2020 – Nov 2021 | Adelaide, SA, Australia**

Rewrote the "Quote to Buy" application (decoupled from core services, automated tests, migrated from IaaS to PaaS, built Azure DevOps CI/CD pipelines).

Delivered a payment gateway integration end-to-end: technical analysis, API integrations, automated regression tests, on-schedule delivery.

*Technologies: .NET (C#), Angular, Entity Framework Core, Azure (App Service, Functions, Blob, Queue), TDD*

---

### Full Stack Developer — Department for Infrastructure and Transport (SA Government)
**Jun 2019 – Dec 2020 | Adelaide, SA, Australia**

- Designed and built Contractor Management and Compliance system
- Built the LTO Fee Calculator — a dynamic form engine supporting 200+ land service types, configurable by business staff without developer involvement
- Rebuilt the public-facing LocationSA Map Viewer application

*Technologies: Angular 8, .NET Core 2.1, PostgreSQL, DynamoDB, AWS (S3, Lambda)*

---

### .NET Full Stack Developer — Novaworks Software
**Feb 2018 – Jun 2019 | Adelaide, SA, Australia**

Built and supported internal and public-facing parliamentary websites for NSW, VIC, and SA governments.

*Technologies: .NET Core 2.0, React, KendoUI, SCSS, Bootstrap, CI/CD with AppVeyor & Octopus*

---

### .NET Full Stack Developer — Toop&Toop Real Estate
**Jun 2017 – Feb 2018 | Adelaide, SA, Australia**

Built and maintained a comprehensive property management platform serving 10+ real estate agencies across Australia.

*Technologies: .NET MVC & WebAPI, JavaScript, jQuery, React, Bootstrap, SQL Server, Entity Framework, Azure App Service*

---

### Web Developer — Lambda Scientific Pty Ltd
**Sep 2015 – May 2017 | Adelaide, SA, Australia**

Owned the full development lifecycle of the company website, integrating ERP (SAP), CRM, and OA functions.

*Technologies: ASP.NET Web Forms, DevExpress, SQL Server, Entity Framework, SAP*

---

### Technical Sales — Huawei Technologies
**Aug 2008 – Oct 2009 | Shenzhen, China**

Bidding manager within a sales team pursuing 3G infrastructure projects in the USA.

---

### Software Engineer — Nortel Networks
**Aug 2005 – Aug 2008 | Guangzhou, China**

Developed features aligned with 3G telecommunication protocols using C/C++ on Solaris.
- UMTS RNC Development
- CDMA BTS Development

---

### Software Developer — NetEase Inc.
**Jan 2004 – Aug 2005 | Guangzhou, China**

Developed a high-performance commercial email system in C++ on Linux:
- Implemented SMTP/POP3 protocols and email relay services
- Developed email web services using PHP + MySQL
- Built a high-concurrency connection pool using FastCGI (Perl & C)

---

## Education

**Master of Computer Science**
Ji'Nan University, Guangzhou, China — 2001–2004

**Bachelor of Mining Engineering**
Northeastern University, Shenyang, China — 1996–2000

---

## Online Presence

- Website: https://derekji.github.io
- Blog: https://derek-ji.medium.com/
