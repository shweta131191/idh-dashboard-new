import { NavLink } from 'react-router-dom';
import { useDashboards } from '../../hooks/useDashboards';

export function Sidebar() {
  const { dashboards } = useDashboards();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        IDH Regen Coffee
        <small>Program Dashboard</small>
      </div>
      {dashboards.map((d) => (
        <NavLink
          key={d.id}
          to={`/dashboard/${d.id}`}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          {d.label}
        </NavLink>
      ))}
    </nav>
  );
}
