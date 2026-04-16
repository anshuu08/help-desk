const StatCard = ({ label, value }) => (
  <article className="stat-card slide-up">
    <div className="stat-head">
      <span>{label}</span>
      <i />
    </div>
    <strong>{value}</strong>
  </article>
);

export default StatCard;
