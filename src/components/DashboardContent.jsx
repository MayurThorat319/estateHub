import { useRef } from 'react';
import './DashboardContent.css';
const formatPrice = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value || 0);
export default function DashboardContent({summary,agents,activities}) {
const activitiesRef=useRef(null);
const scrollActivities=direction=>activitiesRef.current?.scrollBy({left:direction * Math.max(280,activitiesRef.current.clientWidth*0.7),behavior:'smooth'});
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
          <div className="panel breakdown-panel">
            <div className="section-heading">
              <h2>Property Breakdown</h2>
              <span className="filter-label">This Week⌄</span>
            </div>

            <div className="chart-legend">
              <span><i className="legend-rent" /> Rent</span>
              <span><i className="legend-sell" /> Sell</span>
            </div>

            <div className="bar-chart">
              <div className="bar-y-axis">
                {[120, 100, 80, 60, 40, 20, 0].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>

              <div className="bar-chart-content">
                <div className="bar-grid">
                  {summary.weekly.map((item) => (
                    <div className="bar-group" key={item.day}>
                      <div className="bars">
                        <div
                          className="bar rent-bar"
                          style={{ height: `${(item.rent / 120) * 100}%` }}
                        />
                        <div
                          className={`bar sell-bar ${item.day === "Wed" ? "highlight-bar" : ""}`}
                          style={{ height: `${(item.sell / 120) * 100}%` }}
                        />
                      </div>
                      <span>{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="chart-caption">Property Sale & Rentout Data</p>
          </div>

          <div className="panel agents-panel" id="agents">
            <div className="section-heading">
              <h2>Top Agent</h2>
              <a href="#agents">View All</a>
            </div>

            <div className="agent-list">
              {agents.map((agent, index) => (
                <div className="agent-row" key={agent.name}>
                  <div className={`agent-avatar avatar-${index}`}>
                    {agent.avatar}
                  </div>
                  <div className="agent-info">
                    <strong>{agent.name}</strong>
                    <span>{agent.sales} Sell & {agent.rent} Rent</span>
                  </div>
                  <b>{agent.amount}</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITIES */}
        <section className="activities-section" id="activities">
          <div className="section-heading">
            <h2>Recent Activities</h2>
            <div className="activity-controls" aria-label="Recent activities horizontal navigation">
              <button type="button" onClick={() => scrollActivities(-1)} aria-label="Scroll activities left">‹</button>
              <button type="button" onClick={() => scrollActivities(1)} aria-label="Scroll activities right">›</button>
            </div>
          </div>

          <div className="table-wrapper" ref={activitiesRef} tabIndex={0} aria-label="Recent activities table; scroll horizontally">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>No. ↕</th>
                  <th>Type ↕</th>
                  <th>Name ↕</th>
                  <th>Agent Name ↕</th>
                  <th>Property Type ↕</th>
                  <th>City ↕</th>
                  <th>Availability ↕</th>
                  <th>Price ↕</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity._id?.slice(-6)}</td>
                    <td>
                      <span className={`type-tag ${activity.type.toLowerCase()}`}>
                        {activity.type}
                      </span>
                    </td>
                    <td>{activity.name}</td>
                    <td>{activity.agent}</td>
                    <td>{activity.property}</td>
                    <td>{activity.city}</td>
                    <td>{activity.availability}</td>
                    <td>{activity.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
</>);
}
