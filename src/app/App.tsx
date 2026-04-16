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
import type {
  CatalogFacetApply,
  CatalogOutletContext,
} from './catalogOutletContext';

const CatalogPage = lazy(() => import('../pages/CatalogPage/CatalogPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const FavoritesPage = lazy(
  () => import('../pages/FavoritesPage/FavoritesPage'),
);
const CreateSkillPage = lazy(
  () => import('../pages/CreateSkillPage/CreateSkillPage'),
);
const AboutPage = lazy(() => import('../pages/AboutPage/AboutPage'));
const ContactsPage = lazy(() => import('../pages/ContactsPage/ContactsPage'));
const BlogPage = lazy(() => import('../pages/BlogPage/BlogPage'));
const TermsPage = lazy(() => import('../pages/TermsPage/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage/PrivacyPage'));
const Step2Form = lazy(() => import('../pages/RegisterPage2/Step2Form'));
const Step3Form = lazy(() => import('../pages/RegisterPage3/Step3Form'));

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

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Страницы с общим хедером и футером */}
        <Route path="/" element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="skill/:skillId/:userId" element={<SkillPage />} />
          <Route path="skill/:id" element={<SkillPage />} />{' '}
          {/* для обратной совместимости (опционально) */}
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
