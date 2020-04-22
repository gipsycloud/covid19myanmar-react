import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import {format, subDays} from 'date-fns';
import DatePicker from 'react-date-picker';
import {useTranslation} from 'react-i18next';
import * as Icon from 'react-feather';

import Patients from './patients';
import DownloadBlock from './downloadblock';

function filterByObject(obj, filters) {
  const keys = Object.keys(filters);
  return obj.filter((p) => {
    return keys.every((key) => {
      if (!filters[key].length) return true;
      return p[key] === filters[key];
    });
  });
}

function PatientDB(props) {
  const {t} = useTranslation();
  const [fetched, setFetched] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');
  const {pathname} = useLocation();
  const [colorMode, setColorMode] = useState('genders');
  const [scaleMode, setScaleMode] = useState(true);
  const [filterDate, setFilterDate] = useState(null);
  const [filters, setFilters] = useState({
    detectedstate: '',
    detecteddistrict: '',
    detectedcity: '',
    dateannounced: '',
    // unfilter until data are low enough to show
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    async function fetchRawData() {
      const response = await axios.get(
        'https://thantthet.github.io/covid19-api/raw_data.json'
      );
      if (response.data) {
        setPatients(response.data.raw_data.reverse());
        setFetched(true);
      } else {
        setError("Couldn't fetch patient data. Try again after sometime.");
        console.log(response);
      }
    }

    if (!fetched) {
      fetchRawData();
    }
  }, [fetched]);

  const handleFilters = (label, value) => {
    setFilters((f) => {
      // Create new object (deep copy)
      const newFilters = {...f};
      newFilters[label] = value;
      if (label === 'detectedstate') {
        const district = document.getElementById('district');
        const city = document.getElementById('city');
        // Hide boxes
        if (value === '') district.style.display = 'none';
        else district.style.display = 'inline';
        city.style.display = 'none';
        // Default to empty selection
        district.selectedIndex = 0;
        city.selectedIndex = 0;
        newFilters['detecteddistrict'] = '';
        newFilters['detectedcity'] = '';
      } else if (label === 'detecteddistrict') {
        const city = document.getElementById('city');
        // Hide box
        if (value === '') city.style.display = 'none';
        else city.style.display = 'inline';
        // Default to empty selection
        city.selectedIndex = 0;
        newFilters['detectedcity'] = '';
      }
      return newFilters;
    });
  };

  useEffect(() => {
    setFilteredPatients(filterByObject(patients, filters));
  }, [patients, filters]);

  function getSortedValues(obj, key) {
    const setValues = new Set(obj.map((p) => p[key]));
    if (setValues.size > 1) setValues.add('');
    if (key === 'dateannounced') return Array.from(setValues);
    return Array.from(setValues).sort();
  }

  return (
    <div className="PatientsDB">
      {error ? <div className="alert alert-danger">{error}</div> : ''}

      <div className="filters fadeInUp" style={{animationDelay: '0.5s'}}>
        <div className="filters-left">
          <div className="select">
            <select
              style={{animationDelay: '0.3s'}}
              id="state"
              onChange={(event) => {
                handleFilters('detectedstate', event.target.value);
              }}
            >
              <option value="" disabled selected>
                {t("Select State")}
              </option>
              {getSortedValues(patients, 'detectedstate').map(
                (state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state === '' ? t('All') : t(`statenames.${state.toLowerCase()}`)}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s', display: 'none'}}
              id="district"
              onChange={(event) => {
                handleFilters('detecteddistrict', event.target.value);
              }}
            >
              <option value="" disabled selected>
                Select District
              </option>
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                }),
                'detecteddistrict'
              ).map((district, index) => {
                return (
                  <option key={index} value={district}>
                    {district === '' ? t('All') : district}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s', display: 'none'}}
              id="city"
              onChange={(event) => {
                handleFilters('detectedcity', event.target.value);
              }}
            >
              <option value="" disabled selected>
                Select City
              </option>
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                  detecteddistrict: filters.detecteddistrict,
                }),
                'detectedcity'
              ).map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city === '' ? t('All') : city}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s', display: 'none'}}
              id="city"
              onChange={(event) => {
                handleFilters('detectedcity', event.target.value);
              }}
            >
              <option value="" disabled selected>
                Select City
              </option>
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                  detecteddistrict: filters.detecteddistrict,
                }),
                'detectedcity'
              ).map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city === '' ? 'All' : city}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <DatePicker
              value={filterDate}
              minDate={new Date('22-Mar-2020')}
              maxDate={subDays(new Date(), 1)}
              format="dd/MM/y"
              calendarIcon={<Icon.Calendar />}
              clearIcon={<Icon.XCircle class={'calendar-close'} />}
              onChange={(date) => {
                setFilterDate(date);
                const fomattedDate = !!date ? format(date, 'dd/MM/yyyy') : '';
                handleFilters('dateannounced', fomattedDate);
              }}
            />
          </div>

          {/* <div className="select">
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                handleFilters('dateannounced', event.target.value);
              }}
            >
              {Array.from(new Set(patients.map((p) => p.dateannounced))).map(
                (date, index) => {
                  return (
                    <option key={index} value={date}>
                      {date}
                    </option>
                  );
                }
              )}
            </select>
          </div>*/}
        </div>

        <div className="legend">
          {colorMode === 'genders' && (
            <div className="legend-left">
              <div className="circle is-female"></div>
              <h5 className="is-female">{t("Female")}</h5>
              <div className="circle is-male"></div>
              <h5 className="is-male">{t("Male")}</h5>
              <div className="circle"></div>
              <h5 className="">{t("Unknown")}</h5>
            </div>
          )}

          {colorMode === 'transmission' && (
            <div className="legend-left">
              <div className="circle is-local"></div>
              <h5 className="is-local">{t("Local")}</h5>
              <div className="circle is-imported"></div>
              <h5 className="is-imported">{t("Imported")}</h5>
              <div className="circle"></div>
              <h5 className="">{t("TBD")}</h5>
            </div>
          )}

          {colorMode === 'nationality' && (
            <div className="legend-left nationality">
              <div className="circle is-mm"></div>
              <h5 className="is-mm">Mm</h5>
              <div className="circle is-fr"></div>
              <h5 className="is-us">Fr</h5>
              <div className="circle is-ch"></div>
              <h5 className="is-us">Ch</h5>
              <div className="circle is-us"></div>
              <h5 className="is-us">Us</h5>
            </div>
          )}

          <div className={`select ${colorMode}`}>
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                setColorMode(event.target.value);
              }}
            >
              <option value="" disabled selected>
                {t("Color modes")}
              </option>
              <option value="genders">{t("Genders")}</option>
              <option value="transmission">{t("Transmission")}</option>
              <option value="nationality">{t("Nationality")}</option>
              {/* <option value="age">Age</option>*/}
            </select>
          </div>
        </div>
      </div>

      <div className="header fadeInUp" style={{animationDelay: '0.3s'}}>
        <div>
          <h1>{t('demographics.title')}</h1>
          {/* <h3>No. of Patients: {patients.length}</h3>*/}

          <div className="deep-dive">
            <h5>Expand</h5>
            <input
              type="checkbox"
              checked={scaleMode}
              onChange={(event) => {
                setScaleMode(!scaleMode);
              }}
              className="switch"
            />
          </div>
        </div>
        <h6 className="disclaimer">
        {t('demographics.disclaimer')}
        </h6>
      </div>

      <div className="reminder fadeInUp" style={{animationDelay: '1s'}}>
        <p>
        {t('demographics.reminder.line1')}
        <br/>
        <br/>
        {t('demographics.reminder.line2')}
        </p>
      </div>

      <div className="patientdb-wrapper">
        <Patients
          patients={filteredPatients}
          colorMode={colorMode}
          expand={scaleMode}
        />
      </div>
      <DownloadBlock patients={patients} />
    </div>
  );
}

export default PatientDB;
