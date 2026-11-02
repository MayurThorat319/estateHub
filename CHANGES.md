# EstateHub updates

- Property Add/Edit form now includes an **optional** agent dropdown. Defaults to no agent assigned; options come from live agents returned by `/api/top-agents`. Create agents in the Agent workspace to populate it.
- MongoDB Property schema stores the optional `agentId` ObjectId; leaving it blank saves `null`, and the API validates selected agents. Existing records without agentId remain valid.
- Property add/edit/delete activity rows capture the assigned agent name, where applicable, without counting the listing as a completed transaction.
- All primary INR amount displays (project cards, top agent, dashboard totals, workspace, activities) use a shared compact formatter: ₹1.5 Cr, ₹85 L; underlying numbers remain unchanged.
- No migration needed; restart backend and browser after replacing project. Do not overwrite your existing local `.env`.
