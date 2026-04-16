import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { HeaderGuest } from '../widgets/Header';
import { Footer } from '../widgets/Footer';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { SkillPage } from '../pages/SkillPage/SkillPage';
import { RegisterPage } from '../pages/RegisterPage/RegisterPage';
import FavoritesPage from '../pages/FavoritesPage/FavoritesPage';
import Step2Form from '../pages/RegisterPage2/Step2Form';
import Step3Form from '../pages/RegisterPage3/Step3Form';
import type {
  CatalogFacetApply,
  CatalogOutletContext,
} from './catalogOutletContext';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

const CatalogPage = lazy(() => import('../pages/CatalogPage/CatalogPage'));

// Компонент Layout
function Layout() {
  /** Строка для фильтра каталога: приходит из шапки уже после debounce */
  const [catalogSearch, setCatalogSearch] = useState('');
  const [pendingFacetApply, setPendingFacetApply] =
    useState<CatalogFacetApply | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onCatalog =
    location.pathname === '/' || location.pathname === '/catalog';

  const clearPendingFacetApply = useCallback(() => {
    setPendingFacetApply(null);
  }, []);

  const applyCatalogFacet = useCallback(
    (facet: CatalogFacetApply) => {
      setPendingFacetApply(facet);
      if (location.pathname !== '/' && location.pathname !== '/catalog') {
        navigate('/catalog');
      }
    },
    [location.pathname, navigate],
  );

  useEffect(() => {
    if (!onCatalog) {
      setCatalogSearch('');
    }
  }, [location.pathname, onCatalog]);

  const outletContext = useMemo(
    (): CatalogOutletContext => ({
      catalogSearch,
      pendingFacetApply,
      clearPendingFacetApply,
    }),
    [catalogSearch, pendingFacetApply, clearPendingFacetApply],
  );

  return (
    <div className="app">
      {/*
        key: при уходе с маршрутов каталога сбрасываем локальное поле поиска в шапке
        (оно больше не синхронизируется через searchValue с родителем).
      */}
      <HeaderGuest
        key={onCatalog ? 'header-catalog-routes' : 'header-other-routes'}
        onSearch={setCatalogSearch}
        onApplyCatalogFacet={applyCatalogFacet}
      />
      <main className="app-main">
        <Outlet context={outletContext} />
      </main>
      <Footer />
    </div>
  );
}

function CreateSkillPage() {
  return (
    <div className="container">
      <h1>Создание навыка</h1>
      <p>Здесь будет форма создания нового навыка</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container">
      <h1>О проекте</h1>
      <p>SkillSwap — платформа обмена навыками</p>
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="container">
      <h1>Контакты</h1>
      <p>Свяжитесь с нами</p>
    </div>
  );
}

function BlogPage() {
  return (
    <div className="container">
      <h1>Блог</h1>
      <p>Новости и статьи</p>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="container">
      <h1>Пользовательское соглашение</h1>
      <p>Условия использования сервиса SkillSwap</p>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="container">
      <h1>Политика конфиденциальности</h1>
      <p>Политика конфиденциальности сервиса SkillSwap</p>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Страницы с общим хедером и футером */}
        <Route path="/" element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="skill/:id" element={<SkillPage />} />
          <Route path="create" element={<CreateSkillPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>

        {/* Страницы со своим хедером (без общего Layout) */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="register/step2" element={<Step2Form />} />
        <Route path="register/step3" element={<Step3Form />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
