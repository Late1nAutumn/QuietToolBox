import React, { useEffect, useRef, useState } from "react";

import AppGrid from "./components/AppGrid";
import LoadingThrobber from "./components/LoadingThrobber";

import {
  ITEM_REFILL_AMOUNT,
  ITEM_REFILL_TRIGGER,
  LAST_DATA_UPDATE,
  SEARCH_DEBOUNCE_COOLDOWN,
} from "./constants";
import { DIRECTION, LOAD_STATUS } from "../utils/enums";
import { request, setFavicon, wait } from "../utils/functions";
import { GROUP_MODE, SORT_MODE } from "./dataProcess/enums";
import { collectionGrouper, collectionSorter } from "./utils";
import { universalDataProcessor } from "./dataProcess/preprocess";

import STORED_APP_DETAIL from "./dataProcess/data/myAppDetail.json";
import USER_PROFILE from "./dataProcess/data/userProfile.json";
import { translator } from "./translation/translator";
import { NAVBAR_CONTEXT, TRANSLATE_COLLECTION } from "./translation/context";
import { useGlobal } from "../context/GlobalContext";
import { ArrowUpWide } from "../svg/ArrowUpWide";
import ManualProcessor from "./components/ManualProcessor";
import NexusButton from "../Home/NexusButton/NexusButton";
import { APP, APPS } from "../utils/constants";

export default function Steamster() {
  const { lang } = useGlobal();
  const toTopButtonRef = useRef(null);
  const lastElementRefs = useRef([]);
  const searchDebounceRef = useRef(null);

  const [loading, setLoading] = useState(LOAD_STATUS.LOADING);

  const [groupMode, setGroupMode] = useState(GROUP_MODE.APP_TYPE);
  const [sortMode, setSortMode] = useState(SORT_MODE.MY_GAME_TIME);
  const [hideNSFW, setHideNSFW] = useState(true);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchWord, setSearchWord] = useState("");

  const [collections, setCollections] = useState([
    // { title, expand, list, displayAmount }
  ]);

  const updateToTopButton = () => {
    let display = window.scrollY > window.innerHeight * 0.8 ? "flex" : "none";
    toTopButtonRef.current.style.display = display;
  };
  const refillCollectionItems = () => {
    lastElementRefs.current.forEach((ele, i) => {
      const rect = ele?.getBoundingClientRect();
      if (
        rect?.top <= window.innerHeight * ITEM_REFILL_TRIGGER &&
        collections[i].displayAmount < collections[i].list.length
      ) {
        let temp = collections.slice();
        temp[i].displayAmount += ITEM_REFILL_AMOUNT;
        setCollections(temp);
        console.log("[log]: refilling items");
      }
    });
  };

  const onSearch = (e) => {
    setSearchBarValue(e.target.value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearchWord(e.target.value);
    }, SEARCH_DEBOUNCE_COOLDOWN);
  };

  const onGroupModeChange = (e) => {
    setLoading(LOAD_STATUS.LOADING);
    let mode = Number(e.target.value);
    setGroupMode(mode);
    switch (mode) {
      // case GROUP_MODE.APP_TYPE:
      // case GROUP_MODE.CATEGORY:
      // case GROUP_MODE.GENRE:
      case GROUP_MODE.FREE_GAME:
        setSortMode(SORT_MODE.PRICE);
        break;
      case GROUP_MODE.NEVER_PLAYED:
        setSortMode(SORT_MODE.MY_GAME_TIME);
        break;
      case GROUP_MODE.MY_RECOMMENDATION:
        setSortMode(SORT_MODE.MY_RATING);
        break;
      case GROUP_MODE.MY_ACHIEVEMENT:
        setSortMode(SORT_MODE.MY_ACHIEVEMENT);
        break;
    }
  };
  const onSortModeChange = (e) => {
    setSortMode(Number(e.target.value));
  };

  useEffect(() => {
    document.title = APPS[APP.STEAMSTER].text;
    setFavicon(APPS[APP.STEAMSTER].favicon);
    window.scrollTo(0, 0);
    window.addEventListener("scroll", updateToTopButton);

    window.ILoveNSFWContent = () => setHideNSFW(false);
    // window.processData = () => {
    //   universalDataProcessor(true);
    // };

    // (async () => {
    //   let profile = await request("/data/steamster/myprofile");
    //   console.log(profile);
    // })();

    return () => {
      window.removeEventListener("scroll", updateToTopButton);
      window.processData = () => {};
      window.ILoveNSFWContent = () => {};
    };
  }, []);

  useEffect(() => {
    lastElementRefs.current = [];
    let collections = collectionGrouper(
      STORED_APP_DETAIL,
      groupMode,
      lang,
      hideNSFW,
      searchWord
    );
    collections = collectionSorter(collections, sortMode);
    setCollections(collections);
    window.scrollTo(0, 0);
  }, [groupMode, sortMode, hideNSFW, searchWord, lang]);

  useEffect(() => {
    if (collections?.length) setLoading(LOAD_STATUS.LOADED);
    let changing = false;
    let temp = collections.slice().map((collection) => {
      if (collection.expand === LOAD_STATUS.LOADING) {
        collection.expand = LOAD_STATUS.LOADED;
        changing = true;
        return collection;
      }
      return collection;
    });
    if (changing) setCollections(temp);
    console.log("[log]: collection updated");

    refillCollectionItems();
    window.addEventListener("scroll", refillCollectionItems);
    return () => {
      window.removeEventListener("scroll", refillCollectionItems);
    };
  }, [collections]);

  const onScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="steamster">
      {/* <ManualProcessor/> */}
      <div
        ref={toTopButtonRef}
        className="steamster-totop"
        onClick={onScrollTop}
      >
        <ArrowUpWide />
      </div>
      <div className="steamster-nav">
        <div className="steamster-navContent">
          <span className="steamster-nav-nexus">
            <NexusButton menuDirection={DIRECTION.RIGHT} />
          </span>
          <span className="steamster-nav-filters">
            <label>
              {translator(
                NAVBAR_CONTEXT.SEARCH,
                lang,
                TRANSLATE_COLLECTION.NAVBAR
              )}
              :&nbsp;
              <input onChange={onSearch} value={searchBarValue} />
            </label>
            <label>
              {translator(
                NAVBAR_CONTEXT.GROUP_BY,
                lang,
                TRANSLATE_COLLECTION.NAVBAR
              )}
              :&nbsp;
              <select value={groupMode} onChange={onGroupModeChange}>
                <option value={GROUP_MODE.APP_TYPE}>
                  {translator(
                    GROUP_MODE.APP_TYPE,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}
                </option>
                <option value={GROUP_MODE.CATEGORY}>
                  {translator(
                    GROUP_MODE.CATEGORY,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}{" "}
                  (Steam)
                </option>
                <option value={GROUP_MODE.GENRE}>
                  {translator(
                    GROUP_MODE.GENRE,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}{" "}
                  (Steam)
                </option>
                <option value={GROUP_MODE.FREE_GAME}>
                  {translator(
                    GROUP_MODE.FREE_GAME,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}
                </option>
                <option value={GROUP_MODE.NEVER_PLAYED}>
                  {translator(
                    GROUP_MODE.NEVER_PLAYED,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}
                </option>
                <option value={GROUP_MODE.MY_RECOMMENDATION}>
                  {translator(
                    GROUP_MODE.MY_RECOMMENDATION,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}
                </option>
                <option value={GROUP_MODE.MY_ACHIEVEMENT}>
                  {translator(
                    GROUP_MODE.MY_ACHIEVEMENT,
                    lang,
                    TRANSLATE_COLLECTION.GROUP_MODES
                  )}
                </option>
              </select>
            </label>
            <label>
              {translator(
                NAVBAR_CONTEXT.SORT_BY,
                lang,
                TRANSLATE_COLLECTION.NAVBAR
              )}
              :&nbsp;
              <select value={sortMode} onChange={onSortModeChange}>
                <option value={SORT_MODE.RELEASE_DATE}>
                  {translator(
                    SORT_MODE.RELEASE_DATE,
                    lang,
                    TRANSLATE_COLLECTION.SORT_MODES
                  )}
                </option>
                <option value={SORT_MODE.PRICE}>
                  {translator(
                    SORT_MODE.PRICE,
                    lang,
                    TRANSLATE_COLLECTION.SORT_MODES
                  )}
                </option>
                <option value={SORT_MODE.MY_RATING}>
                  {translator(
                    SORT_MODE.MY_RATING,
                    lang,
                    TRANSLATE_COLLECTION.SORT_MODES
                  )}
                </option>
                <option value={SORT_MODE.MY_GAME_TIME}>
                  {translator(
                    SORT_MODE.MY_GAME_TIME,
                    lang,
                    TRANSLATE_COLLECTION.SORT_MODES
                  )}
                </option>
                <option value={SORT_MODE.MY_LAST_TIME}>
                  {translator(
                    SORT_MODE.MY_LAST_TIME,
                    lang,
                    TRANSLATE_COLLECTION.SORT_MODES
                  )}
                </option>
                <option value={SORT_MODE.MY_ACHIEVEMENT}>
                  {translator(
                    SORT_MODE.MY_ACHIEVEMENT,
                    lang,
                    TRANSLATE_COLLECTION.SORT_MODES
                  )}
                </option>
              </select>
            </label>
          </span>
          <span className="steamster-nav-date">
            {translator(
              NAVBAR_CONTEXT.LAST_UPDATE,
              lang,
              TRANSLATE_COLLECTION.NAVBAR
            )}
            : {LAST_DATA_UPDATE}
          </span>
          <span className="steamster-nav-avatar">
            <a href={USER_PROFILE.profileurl} target="_blank">
              <img src={USER_PROFILE.avatar} />
            </a>
          </span>
        </div>
      </div>
      {(() => {
        switch (loading) {
          case LOAD_STATUS.LOADING:
            return (
              <div className="steamster-content-loading">
                <LoadingThrobber />
              </div>
            );
          case LOAD_STATUS.LOADED:
            return (
              <AppGrid
                collections={collections}
                setCollections={setCollections}
                lastElementRefs={lastElementRefs}
                sortMode={sortMode}
              />
            );
          default:
            return <></>;
        }
      })()}
    </div>
  );
}
