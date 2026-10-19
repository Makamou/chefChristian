# Chef Christian AI fix

This patch moves Hugging Face requests to `/api/recipe` and removes the browser token dependency. It uses a non-streaming response (the UI still receives a completed recipe).

1. Commit these changes to a new GitHub branch and open a pull request.
2. Set `HF_ACCESS_TOKEN` in Vercel Production (already done if present). Do not use `VITE_` prefix.
3. Optionally set `HF_CHAT_MODEL` to a model verified as supported for chat completion by your Hugging Face Inference Providers account. The default Qwen model is a candidate, not a guarantee of current availability.
4. Deploy a Preview and test generating a recipe; inspect Vercel function logs on failure.
5. Merge to main only after the Preview passes.
6. Remove `VITE_HF_ACCESS_TOKEN`, revoke the old exposed token, and redeploy.

For local testing, use `vercel dev` (Vite `npm run dev` alone does not run Vercel API functions). Do not commit `.env` or `.env.local`.

Security: This endpoint should have rate limiting and abuse controls before significant public traffic; it currently validates inputs but is unauthenticated.
