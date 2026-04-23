/* AUTO-GENERATED - edited via #admin. Do not hand-edit this file.
 * Schema contract: src/admin/serializer.ts. The parser locates `export const
 * data = ` and takes everything through the matching `};` as strict JSON.
 * Types flow from PortfolioData in `./portfolio` (import-type cycle is safe).
 */
import type { PortfolioData } from './portfolio';

export const data: PortfolioData = {
  "projects": [
    {
      "name": "claude-creative-stack",
      "description": "A reference pack for building creative work with Claude - knowledge docs, Agent Skills, single-file artifact starters, prompt scaffolds, and a working MCP server. Designed to be mounted straight into a Claude Project.",
      "language": "Claude",
      "url": "https://github.com/barmoshe/claude-creative-stack"
    },
    {
      "name": "isralify",
      "description": "Node.js backend for a Spotify-inspired music app - REST API, user auth, custom middleware, integrated logger, MongoDB. The React frontend lives in a sibling repo.",
      "language": "JavaScript",
      "url": "https://github.com/barmoshe/Israelify-backend"
    },
    {
      "name": "temporal-data-processing",
      "description": "A single Temporal workflow that orchestrates three language workers - Go, Python, and TypeScript, each on its own task queue - to process data end-to-end. Featured on Temporal's Code Exchange with a companion Medium write-up.",
      "language": "Go · Python · TypeScript",
      "url": "https://github.com/barmoshe/data-processing-service",
      "extras": [
        {
          "label": "Temporal Code Exchange",
          "url": "https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal"
        },
        {
          "label": "Read the Medium article",
          "url": "https://medium.com/@barmoshe/building-a-cross-language-data-processing-service-with-temporal-a-practical-guide-bf0fb1155d46"
        }
      ]
    }
  ],
  "contact": {
    "email": "1barmoshe1@gmail.com",
    "github": "https://github.com/barmoshe",
    "linkedin": "https://www.linkedin.com/in/barmoshe/",
    "phone": "+972546561465"
  }
};
