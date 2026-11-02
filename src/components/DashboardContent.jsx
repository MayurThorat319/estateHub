import { formatINR } from "../utils/money";
import PropertyBreakdown from "./PropertyBreakdown";
import RecentActivities from './RecentActivities';
import './DashboardContent.css';
const formatPrice = formatINR;
export default function DashboardContent({summary,agents,activities,breakdownPeriod,onBreakdownPeriodChange,onViewAgents}) {
return (<>        {/* ANALYTICS */}
        <section className="analytics-grid">
          <div className="panel revenue-panel">
            <div className="panel-heading">
              <h3>Revenue</h3>
              <span>{new Date().getFullYear()}</span>
            </div>

            <div className="revenue-total">{formatPrice(summary.revenue)}</div>

            <div className="revenue-chart">
              <div className="chart-grid-lines">
                <span />
                <span />
                <span />
                <span />
              </div>

              <svg viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#793BBA" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#793BBA" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline points={summary.monthly.map((n,i) => `${(i/11)*500},${150-(n / Math.max(1,...summary.monthly))*135}`).join(' ')} fill="none" stroke="#5120C8" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="chart-months">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>

          <div className="panel donut-panel" id="sell">
            <h3>Property for sell</h3>
            <div className="donut sell-donut">
              <div>
                <strong>{summary.sellPercent}%</strong>
              </div>
            </div>
            <p>{summary.sellCount} Properties</p>
          </div>

          <div className="panel donut-panel" id="rent">
            <h3>Property for rent</h3>
            <div className="donut rent-donut">
              <div>
                <strong>{summary.rentPercent}%</strong>
              </div>
            </div>
            <p>{summary.rentCount} Properties</p>
          </div>
        </section>

        {/* BREAKDOWN AND AGENTS */}
        <section className="middle-grid">
          <PropertyBreakdown breakdown={summary.breakdown} period={breakdownPeriod} onPeriodChange={onBreakdownPeriodChange} />

          <div className="panel agents-panel" id="agents">
            <div className="section-heading">
              <h2>Top Agent</h2>
              <button type="button" className="eh-text-action" onClick={onViewAgents}>View All</button>
            </div>

            <div className="agent-list">
              {agents.slice(0,5).map((agent, index) => (
                <div className="agent-row" key={agent.name}>
                  <div className={`agent-avatar avatar-${index}`}>
                    {agent.avatar || agent.name.slice(0,2).toUpperCase()}
                  </div>
                  <div className="agent-info">
                    <strong>{agent.name}</strong>
                    <span>{agent.sales} Sell & {agent.rent} Rent</span>
                  </div>
                  <b>{formatPrice(agent.totalAmount)}</b>
                </div>
              ))}
              {!agents.length && <p className="empty-message">No agents added yet.</p>}
            </div>
          </div>
        </section>

        <RecentActivities activities={activities} />
</>);
}
