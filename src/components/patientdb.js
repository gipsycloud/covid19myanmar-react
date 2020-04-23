import DownloadBlock from './downloadblock';
import Footer from './footer';
import Patients from './patients';

import axios from 'axios';
import {format, subDays} from 'date-fns';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-date-picker';
import {useTranslation} from 'react-i18next';
import * as Icon from 'react-feather';
import {useLocation} from 'react-router-dom';
import {useEffectOnce, useLocalStorage} from 'react-use';

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
  const {pathname} = useLocation();
  const [colorMode, setColorMode] = useState('genders');
  const [scaleMode, setScaleMode] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [showReminder, setShowReminder] = useLocalStorage('showReminder', true);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffectOnce(() => {
    try {
      axios
        .get('https://thantthet.github.io/covid19-api/raw_data.json')
        .then((response) => {
          setPatients(response.data.raw_data.reverse());
          setFetched(true);
        });
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    const datePickers = document.querySelectorAll(
      '.react-date-picker__inputGroup input'
    );
    datePickers.forEach((el) => el.setAttribute('readOnly', true));
  }, []);

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
    if (filterByObject(patients, filters).length > 0) {
      setFilteredPatients(filterByObject(patients, filters));
      setMessage(false);
      setLoading(false);
    } else {
      setMessage(true);
    }
  }, [patients, filters]);

  function getSortedValues(obj, key) {
    const setValues = new Set(obj.map((p) => p[key]));
    if (setValues.size > 1) setValues.add('');
    if (key === 'dateannounced') return Array.from(setValues);
    return Array.from(setValues).sort();
  }

  return (
    <div className="PatientsDB">
      <div className="filters fadeInUp" style={{animationDelay: '0.2s'}}>
        <div className="filters-left">
          <div className="select">
            <select
              style={{animationDelay: '0.3s'}}
              id="state"
              onChange={(event) => {
                handleFilters('detectedstate', event.target.value);
              }}
              defaultValue={filters.detectedstate}
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
              defaultValue={filters.detecteddistrict}
            >
              <option value="" disabled>
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
              defaultValue={filters.detectedcity}
            >
              <option value="" disabled>
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
              defaultValue={filters.detectedcity}
            >
              <option value="" disabled>
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
              inputProps={
                (onkeydown = (e) => {
                  e.preventDefault();
                })
              }
              clearIcon={<Icon.XCircle />}
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
              <h5 className="">{t("Unknown")}</h5>
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
              defaultValue={colorMode}
            >
              {/* <option value="" disabled>
                Color modes
              </option> */}
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

      <div
        className="reminder fadeInUp"
        style={{animationDelay: '1s', display: showReminder ? '' : 'none'}}
      >
        <Icon.XCircle
          onClick={() => {
            setShowReminder(false);
          }}
        />
        <p>
        {t('demographics.reminder.line1')}
        <br/>
        <br/>
        {t('demographics.reminder.line2')}
        </p>
      </div>

      {fetched && (
        <div className="patientdb-wrapper">
          {loading ? (
            ' '
          ) : message ? (
            <div className="no-result">
              <h5>
                There were no new cases in
                <span>
                  {filters.detectedcity.length > 0
                    ? ` ${filters.detectedcity}, `
                    : ''}
                  {filters.detecteddistrict.length > 0
                    ? ` ${filters.detecteddistrict}, `
                    : ''}
                  {' ' + filters.detectedstate}
                </span>{' '}
                on <span>{filters.dateannounced}.</span>
              </h5>
            </div>
          ) : (
            <Patients
              patients={filteredPatients}
              colorMode={colorMode}
              expand={scaleMode}
            />
          )}
        </div>
      )}

      <DownloadBlock patients={patients} />
      <Footer />
    </div>
  );
}

export default PatientDB;
