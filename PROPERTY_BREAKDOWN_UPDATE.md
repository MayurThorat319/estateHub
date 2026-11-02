# Property Breakdown update

This project now provides a working **This Week / This Month / This Year** selector. The chart counts MongoDB `properties` using their `createdAt` date and `listing` (`Rent` or `Sell`). Week starts Monday; month is grouped into calendar day ranges 1–7, 8–14, etc.; year is grouped into calendar months. Future-dated listings are not counted. An empty period shows a clear message instead of dummy bars.

`GET /api/stats?period=week|month|year` returns `data.breakdown` with `buckets`, retaining the existing summary stats for other cards. Property add/delete automatically refreshes the chart; editing listing type also updates its counts.

Run `npm install` and `npm run dev` in the project root after extracting. Make sure MongoDB Community Server is running. The graph will be empty if you have no properties created in the selected period; existing seeded records may have dates from the time they were inserted. This is a *listing creation* chart, not historical completed transactions (which would require a separate transaction model).
