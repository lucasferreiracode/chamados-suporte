import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './context/TicketContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { TicketList } from './pages/TicketList';
import { NewTicket } from './pages/NewTicket';
import { Reports } from './pages/Reports';

function App() {
  return (
    <TicketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="chamados" element={<TicketList />} />
            <Route path="novo-chamado" element={<NewTicket />} />
            <Route path="relatorios" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TicketProvider>
  );
}

export default App;
