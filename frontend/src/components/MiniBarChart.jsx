const MiniBarChart = ({ data = [] }) => {
  const max = Math.max(...data.map((x) => x.count), 1);

  return (
    <div className="mini-chart card">
      <h3>Ticket Analytics</h3>
      <div className="chart-grid">
        {data.map((item) => (
          <div key={item._id} className="bar-row">
            <span>{item._id}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
            <b>{item.count}</b>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniBarChart;
