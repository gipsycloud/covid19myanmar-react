import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GenderChart from './Charts/genderchart';
import AgeChart from './Charts/agechart';
import NationalityChart from './Charts/nationalitychart';
import AllStatesChart from './Charts/allstates';
import TotalConfirmedChart from './Charts/totalconfirmedchart';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';
import {useTranslation} from 'react-i18next';

function DeepDive(props) {
  const {t} = useTranslation();
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [statesTimeSeries, setStatesTimeSeries] = useState([]);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [
        response,
        rawDataResponse,
        stateDailyResponse,
      ] = await Promise.all([
        axios.get('https://thantthet.github.io/covid19-api/data.json'),
        axios.get('https://thantthet.github.io/covid19-api/raw_data.json'),
        axios.get('https://thantthet.github.io/covid19-api/states_daily.json'),
      ]);
      setTimeseries(response.data.cases_time_series);
      setStatesTimeSeries(stateDailyResponse.data.states_daily);
      setRawData(rawDataResponse.data.raw_data);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cards-container">
      <section className="cards">
        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TotalConfirmedChart
            title={t("Myanmar - Total Cases")}
            timeseries={timeseries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <DailyConfirmedChart
            title={t("Myanmar - Daily Cases")}
            timeseries={timeseries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <AllStatesChart
            title={t("States - Total Cases")}
            data={statesTimeSeries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GenderChart title={t("Patient Gender")} data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <AgeChart title={t("Patient Age")} data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <NationalityChart title={t("Patient Nationality")} data={rawData} />
        </div>
      </section>
    </div>
  );
}

export default DeepDive;
