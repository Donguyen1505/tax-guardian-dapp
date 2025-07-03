import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';

// Sử dụng React.lazy để tải các trang khi cần
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateInvoice = lazy(() => import('./pages/CreateInvoice'));
const InvoiceLookup = lazy(() => import('./pages/InvoiceLookup'));
const Account = lazy(() => import('./pages/Account'));

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-[calc(100vh-160px)] py-4">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoices" element={<InvoiceLookup />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;