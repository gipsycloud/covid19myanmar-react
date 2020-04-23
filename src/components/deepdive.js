import AgeChart from './Charts/agechart';
import AllStatesChart from './Charts/allstates';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';
import GenderChart from './Charts/genderchart';
import GrowthTrendChart from './Charts/growthtrendchart';
import NationalityChart from './Charts/nationalitychart';
import TotalConfirmedChart from './Charts/totalconfirmedchart';

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

function DeepDive() {
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
          <TotalConfirmedChart title="Total Cases" timeseries={timeseries} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <DailyConfirmedChart title="Daily Cases" timeseries={timeseries} />
        </div>

        <div
          className="card card-big fadeInUp"
          style={{animationDelay: '0.7s'}}
        >
          <AllStatesChart
            title="Total Cases by State"
            data={statesTimeSeries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GrowthTrendChart
            title="States - Growth Trend"
            data={statesTimeSeries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GenderChart title={t("Patient Gender")} data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <AgeChart title="Patients by Age" data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <NationalityChart title="Patients by  Nationality" data={rawData} />
        </div>
      </section>
    </div>
  );
}

export default DeepDive;
