import "./PropertyBreakdown.css";

export default function PropertyBreakdown({
  breakdown,
  period,
  onPeriodChange,
}) {
  const buckets = breakdown?.buckets || [];
  const peak = Math.max(
    1,
    ...buckets.flatMap(({ rent, sell }) => [rent, sell]),
  );
  const ticks = Array.from({ length: 5 }, (_, i) =>
    Math.ceil((peak * (4 - i)) / 4),
  );
  const totalRent = buckets.reduce((sum, row) => sum + row.rent, 0);
  const totalSell = buckets.reduce((sum, row) => sum + row.sell, 0);
  const empty = totalRent + totalSell === 0;
  return (
    <section className="panel breakdown-panel" aria-label="Property breakdown">
      <div className="section-heading breakdown-heading">
        <h2>Property Breakdown</h2>
        <select
          className="breakdown-period"
          aria-label="Property breakdown time period"
          value={period}
          onChange={(event) => onPeriodChange(event.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-rent" /> Rent ({totalRent})
        </span>
        <span>
          <i className="legend-sell" /> Sell ({totalSell})
        </span>
      </div>
      <div className="bar-chart property-breakdown-chart">
        <div className="bar-y-axis">
          {ticks.map((tick, i) => (
            <span key={i}>{tick}</span>
          ))}
          <span>0</span>
        </div>
        <div className="bar-chart-content">
          <div className="bar-grid">
            {buckets.map((item, index) => (
              <div className="bar-group" key={`${period}-${index}`}>
                <div className="bars">
                  <div
                    className="bar rent-bar"
                    title={`${item.label}: ${item.rent} rentals`}
                    style={{ height: `${(item.rent / peak) * 100}%` }}
                  />
                  <div
                    className="bar sell-bar"
                    title={`${item.label}: ${item.sell} sales listings`}
                    style={{ height: `${(item.sell / peak) * 100}%` }}
                  />
                </div>
                <span title={item.label}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {empty ? (
        <p className="chart-caption">
          No properties added during this {period}.
        </p>
      ) : (
        <p className="chart-caption">
          {totalRent + totalSell} properties added · {totalRent} rent ·{" "}
          {totalSell} sell
        </p>
      )}
    </section>
  );
}
