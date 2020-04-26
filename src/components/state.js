import {useTranslation} from 'react-i18next';
import Clusters from './clusters';
import DeltaBarGraph from './deltabargraph';
import Footer from './footer';
import Level from './level';
import MapExplorer from './mapexplorer';
import Minigraph from './minigraph';
import TimeSeries from './timeseries';

import {MAP_META, STATE_CODES} from '../constants';
import {
  getStateName,
  formatDateAbsolute,
  parseStateTimeseries,
} from '../utils/commonfunctions';

import {Breadcrumb, Dropdown} from '@primer/components';
import anime from 'animejs';
import axios from 'axios';
import React, {useRef, useState} from 'react';
import * as Icon from 'react-feather';
import {Link, useParams} from 'react-router-dom';
import {useLocalStorage} from 'react-use';
import {useMeasure, useEffectOnce} from 'react-use';

function State(props) {
  const {t} = useTranslation();
  const mapRef = useRef();
  const tsRef = useRef();

  const {stateCode} = useParams();
  const [allStateData, setAllStateData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState({});
  const [graphOption, setGraphOption] = useState(1);
  const [timeseriesMode, setTimeseriesMode] = useLocalStorage(
    'timeseriesMode',
    true
  );
  const [timeseriesLogMode, setTimeseriesLogMode] = useLocalStorage(
    'timeseriesLogMode',
    false
  );
  const [stateData, setStateData] = useState({});
  const [districtData, setDistrictData] = useState({});
  const [stateName] = useState(STATE_CODES[stateCode]);
  const [mapOption, setMapOption] = useState('confirmed');
  const [mapSwitcher, {width}] = useMeasure();
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  useEffectOnce(() => {
    getState(stateCode);
  });

  const getState = async (code) => {
    try {
      const [
        {data: dataResponse},
        {data: stateDistrictWiseResponse},
        {data: statesDailyResponse},
      ] = await Promise.all([
        axios.get('https://thantthet.github.io/covid19-api/data.json'),
        axios.get('https://thantthet.github.io/covid19-api/state_district_wise.json'),
        axios.get('https://thantthet.github.io/covid19-api/states_daily.json'),
      ]);
      const name = STATE_CODES[code];

      const states = dataResponse.statewise;
      setAllStateData(
        states.filter(
          (state) => state.statecode !== code && STATE_CODES[state.statecode]
        )
      );
      setStateData(states.find((s) => s.statecode === code));
      // Timeseries
      const ts = parseStateTimeseries(statesDailyResponse)[code];
      setTimeseries(ts);
      // District data
      setDistrictData({
        [name]: stateDistrictWiseResponse[name],
      });
      setFetched(true);
      anime({
        targets: '.highlight',
        duration: 200,
        delay: 3000,
        translateX:
          mapOption === 'confirmed'
            ? `${width * 0}px`
            : mapOption === 'active'
            ? `${width * 0.25}px`
            : mapOption === 'recovered'
            ? `${width * 0.5}px`
            : mapOption === 'deceased'
            ? `${width * 0.75}px`
            : '0px',
        easing: 'spring(1, 80, 90, 10)',
        opacity: 1,
      });
    } catch (err) {
      console.log(err);
    }
  };

  function toggleShowAllDistricts() {
    setShowAllDistricts(!showAllDistricts);
  }

  return (
    <React.Fragment>
      <div className="State">
        <div className="state-left">
          <div className="breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item href="/">{t('menu.home')}</Breadcrumb.Item>
              <Dropdown direction="w">
                <summary>
                  <Breadcrumb.Item href={`${stateCode}`} selected>
                    {getStateName(stateCode)}
                  </Breadcrumb.Item>
                  <Dropdown.Caret className="caret" />
                </summary>
                {fetched && (
                  <Dropdown.Menu direction="se">
                    {allStateData.map((state) => (
                      <Dropdown.Item key={state.statecode} className="item">
                        <Link to={`${state.statecode}`}>
                          {getStateName(state.statecode)}
                        </Link>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                )}
              </Dropdown>
            </Breadcrumb>
          </div>

          <div className="header">
            <div
              className="header-left fadeInUp"
              style={{animationDelay: '0.3s'}}
            >
              <h1>{getStateName(stateCode)}</h1>
              <h5>
                {t('statepage.lastUpdatedOn', {time: Object.keys(stateData).length
                  ? formatDateAbsolute(stateData.lastupdatedtime)
                  : ''})}
              </h5>
            </div>
          </div>

          {fetched && (
            <div className="map-switcher" ref={mapSwitcher}>
              <div
                className={`highlight ${mapOption}`}
                style={{
                  transform: `translateX(${width * 0}px)`,
                  opacity: 0,
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('confirmed');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('active');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.25}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('recovered');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.5}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
              <div
                className="clickable"
                onClick={() => {
                  setMapOption('deceased');
                  anime({
                    targets: '.highlight',
                    translateX: `${width * 0.75}px`,
                    easing: 'spring(1, 80, 90, 10)',
                  });
                }}
              ></div>
            </div>
          )}

          {fetched && <Level data={stateData} />}
          {fetched && <Minigraph timeseries={timeseries} />}
          {fetched && (
            <React.Fragment>
              {
                <MapExplorer
                  forwardRef={mapRef}
                  mapMeta={MAP_META[stateName]}
                  states={[stateData]}
                  stateDistrictWiseData={districtData}
                  isCountryLoaded={false}
                  mapOptionProp={mapOption}
                />
              }
            </React.Fragment>
          )}

          {fetched && (
            <div className="meta-secondary">
              <div className="unknown">
                <Icon.AlertCircle />
                <div className="unknown-right">
                  Awaiting district details for{' '}
                  {districtData[stateName]?.districtData['Unknown']
                    ?.confirmed || '0'}{' '}
                  cases
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="state-right">
          {fetched && (
            <React.Fragment>
              <div
                className="district-bar"
                style={!showAllDistricts ? {display: 'flex'} : {}}
              >
                <div
                  className="district-bar-left fadeInUp"
                  style={{animationDelay: '0.6s'}}
                >
                  <h2>{t("statepage.topDistrict")}</h2>
                  <div
                    className={`districts ${showAllDistricts ? 'is-grid' : ''}`}
                  >
                    {districtData[stateName]
                      ? Object.keys(districtData[stateName].districtData)
                          .filter((d) => d !== 'Unknown')
                          .sort(
                            (a, b) =>
                              districtData[stateName].districtData[b]
                                .confirmed -
                              districtData[stateName].districtData[a].confirmed
                          )
                          .slice(0, showAllDistricts ? undefined : 5)
                          .map((district, index) => {
                            return (
                              <div key={index} className="district">
                                <h2>
                                  {
                                    districtData[stateName].districtData[
                                      district
                                    ].confirmed
                                  }
                                </h2>
                                <h5>{district}</h5>
                                <div className="delta">
                                  <Icon.ArrowUp />
                                  <h6>
                                    {
                                      districtData[stateName].districtData[
                                        district
                                      ].delta.confirmed
                                    }
                                  </h6>
                                </div>
                              </div>
                            );
                          })
                      : ''}
                  </div>
                  <button className="button" onClick={toggleShowAllDistricts}>
                    {showAllDistricts ? `View less` : `View all`}
                  </button>
                </div>
                <div className="district-bar-right">
                  {
                    <DeltaBarGraph
                      timeseries={timeseries.slice(-5)}
                      arrayKey={'dailyconfirmed'}
                    />
                  }
                </div>
              </div>

              <div className="TimeSeriesExplorer">
                <div
                  className="timeseries-header fadeInUp"
                  style={{animationDelay: '2.5s'}}
                  ref={tsRef}
                >
                  <div className="tabs">
                    <div
                      className={`tab ${graphOption === 1 ? 'focused' : ''}`}
                      onClick={() => {
                        setGraphOption(1);
                      }}
                    >
                      <h4>{t('Cumulative')}</h4>
                    </div>
                    <div
                      className={`tab ${graphOption === 2 ? 'focused' : ''}`}
                      onClick={() => {
                        setGraphOption(2);
                      }}
                    >
                      <h4>{t('Daily')}</h4>
                    </div>
                  </div>

                  <div className="scale-modes">
                    <label className="main">{t('Scale Modes')}</label>
                    <div className="timeseries-mode">
                      <label htmlFor="timeseries-mode">{t('chart.mode.uniform')}</label>
                      <input
                        type="checkbox"
                        checked={timeseriesMode}
                        className="switch"
                        aria-label="Checked by default to scale uniformly."
                        onChange={(event) => {
                          setTimeseriesMode(!timeseriesMode);
                        }}
                      />
                    </div>
                    <div
                      className={`timeseries-logmode ${
                        graphOption !== 1 ? 'disabled' : ''
                      }`}
                    >
                      <label htmlFor="timeseries-logmode">{t('chart.mode.logarithmic')}</label>
                      <input
                        type="checkbox"
                        checked={graphOption === 1 && timeseriesLogMode}
                        className="switch"
                        disabled={graphOption !== 1}
                        onChange={(event) => {
                          setTimeseriesLogMode(!timeseriesLogMode);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <TimeSeries
                  timeseries={timeseries}
                  type={graphOption}
                  mode={timeseriesMode}
                  logMode={timeseriesLogMode}
                />
              </div>
            </React.Fragment>
          )}
        </div>

        <div className="state-left">
          <div className="Clusters fadeInUp" style={{animationDelay: '0.8s'}}>
            <h1>{t("Network of transmission")}</h1>
            <Clusters stateCode={stateCode} />
          </div>
        </div>

        <div className="state-right"></div>
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default React.memo(State);
