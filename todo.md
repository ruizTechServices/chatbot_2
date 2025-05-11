# LLM EXECUTION CHECKLIST – Remove Square & Paywall

**Execution Rules for the LLM**
1. Process tasks top-to-bottom.
2. Skip any task already checked `[x]`.
3. After finishing a task **only update its checkbox** to `[x]`, do **not** touch other lines.
4. Commit code changes related to the task you completed in the same edit.

---

## 1. Delete Files
- [x] Remove file: `components/session/SessionPurchase.tsx`
- [x] Remove file: `components/session/SavedCards.tsx`
- [x] Remove file: `components/session/SessionModal.tsx`
- [x] Remove file: `components/session/SessionProvider.tsx`
- [x] Remove file: `utils/square.ts`
- [x] Remove file: `utils/square/client.ts`
- [x] Remove directory: `utils/square/functions/*`
- [x] Remove file: `app/test-payment/page.tsx`
- [x] Remove directory: `app/api/square/**`
- [x] Remove directory: `app/api/sessions/**`
- [x] Remove file: `app/api/middleware.ts`
- [x] Remove file: `utils/sessionCheck.ts`

## 2. Refactor Codebase References
- [x] Clean `app/chat/page.tsx` (remove SessionProvider, timer, modal)
- [x] Delete all `<Script src="square.js">` tags in any file
- [x] Update `components/main/ChecklistItem.tsx` (drop `square` case)
- [x] Trim `utils/debug.ts` (remove Square env checker)
- [x] Purge `SQUARE_*` vars from `.env` & `.env.example`
- [x] Update `.windsurfrules` & related docs (remove PAY-1…PAY-5)

## 3. Dependencies
- [x] Run `npm uninstall square` and commit updated lockfiles

## 4. Prisma Schema & Migration
- [x] Delete `squareCustomerId` field from `User` model in `prisma/schema.prisma`
- [x] Delete entire `UserSession` model
- [x] Execute migration: `npx prisma migrate dev --name remove_square_paywall`

## 5. Secrets / CI
- [ ] Delete `SQUARE_*` secrets from deployment dashboards
- [x] Remove Square references from CI workflows (if any)

## 6. QA Verification
- [x] `npm run lint` passes
- [x] `npm run build` passes
- [x] Basic auth flows work
- [x] Chat page loads without paywall UI
- [x] Tests updated & green