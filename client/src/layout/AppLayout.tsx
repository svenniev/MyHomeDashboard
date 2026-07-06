import React, { ReactNode, useEffect } from 'react';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/dist/js/adminlte.min.js';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.body.classList.add('sidebar-mini', 'layout-fixed');
    return () => {
      document.body.classList.remove('sidebar-mini', 'layout-fixed');
    };
  }, []);

  return (
    <div className="wrapper">
      <Topbar />
      <Sidebar />
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default AppLayout;
