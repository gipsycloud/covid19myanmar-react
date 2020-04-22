import React from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';

function Footer(props) {
  const {t} = useTranslation();
  return (
    <footer className="fadeInUp" style={{animationDelay: '2s'}}>
      <h5>{t("We stand with everyone fighting on the frontlines")}</h5>
      <a
        href="https://github.com/thantthet/covid19myanmar-react"
        className="button github"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon.GitHub />
        <span>A fork of covid19india.org</span>
      </a>

      <a
        className="button excel"
        href="http://covidmyanmar.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon.Database />
        <span>Live data from covidmyanmar.com</span>
      </a>
    </footer>
  );
}

export default React.memo(Footer);
