import {useTranslation} from 'react-i18next';
import './App.scss';

import DeepDive from './components/deepdive';
import Home from './components/home';
import Navbar from './components/navbar';
import PatientDB from './components/patientdb';
import State from './components/state';
import ScrollToTop from './utils/ScrollToTop';

import React from 'react';
import {Helmet} from 'react-helmet';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useLocalStorage, useEffectOnce} from 'react-use';

const schemaMarkup = {
  '@context': 'http://schema.org/',
  '@type': 'NGO',
  name: 'Coronavirus Outbreak in Myanmar: Latest Map and Case Count',
  alternateName: 'COVID-19 Tracker',
  url: 'https://covid19.ttkz.me/',
  image: 'https://covid19.ttkz.me/thumbnail.png',
};

function App() {
  const {t} = useTranslation();

  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: t('menu.home'),
      animationDelayForNavbar: 0.2,
      showInNavbar: true,
    },
    {
      pageLink: '/demographics',
      view: PatientDB,
      displayName: t('menu.demographics'),
      animationDelayForNavbar: 0.3,
      showInNavbar: true,
    },
    {
      pageLink: '/deepdive',
      view: DeepDive,
      displayName: t('menu.deepdrive'),
      animationDelayForNavbar: 0.4,
      showInNavbar: true,
    },
    {
      pageLink: '/state/:stateCode',
      view: State,
      displayName: t('menu.state'),
      animationDelayForNavbar: 0.7,
      showInNavbar: false,
    },
  ];

  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [isThemeSet] = useLocalStorage('isThemeSet', false);

  useEffectOnce(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
      !isThemeSet
    ) {
      setDarkMode(true);
    } else if (
      window.matchMedia &&
      !window.matchMedia('(prefers-color-scheme: dark)').matches &&
      !isThemeSet
    ) {
      setDarkMode(false);
    }
  });

  React.useEffect(() => {
    if (darkMode) {
      document.querySelector('body').classList.add('dark-mode');
    } else {
      document.querySelector('body').classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <Router>
        <ScrollToTop />
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              <Navbar
                pages={pages}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Switch location={location}>
                {pages.map((page, index) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      render={({match}) => (
                        <page.view key={match.params.stateCode || index} />
                      )}
                      key={index}
                    />
                  );
                })}
                <Redirect to="/" />
              </Switch>
            </div>
          )}
        />
      </Router>
    </div>
  );
}

export default App;
