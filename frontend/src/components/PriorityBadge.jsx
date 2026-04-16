const PriorityBadge = ({ value }) => {
  const cls = value.toLowerCase();
  return <span className={`badge priority ${cls}`}>{value}</span>;
};

export default PriorityBadge;
