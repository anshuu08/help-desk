const StatusBadge = ({ value }) => {
  const cls = value.toLowerCase().replace(/\s+/g, "-");
  return <span className={`badge status ${cls}`}>{value}</span>;
};

export default StatusBadge;
