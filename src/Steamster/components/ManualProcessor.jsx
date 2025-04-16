import React, { useEffect, useRef, useState } from "react";
import AppItem from "./AppItem";

import STORED_APP_DETAIL from "../dataProcess/data/myAppDetail.json";
import { useGlobal } from "../../context/GlobalContext";
import { playLength } from "../utils";
import {
  MY_CLOUDED_APPS,
  LIMITED_FREE_APPS,
  MANUAL_PROCESSED_APP,
  MY_OPPOSED_APPS,
  MY_RATING,
  MY_RECOMMENDED_APPS,
  STOP_SALE_APPS,
} from "../dataProcess/lists";
import { PRICE, RECOMMEND } from "../dataProcess/steam";

const HIDE_APP_LEVEL = {
  NSFW: 1,
  IMPROPER: 2,
  HIDE: 3,
};

export default function ManualProcessor({}) {
  let { lang } = useGlobal();

  const dataRef = useRef(Object.keys(STORED_APP_DETAIL));
  const resultRef = useRef({
    processedAppList: MANUAL_PROCESSED_APP,
    stopSaleList: STOP_SALE_APPS,
    limitedFreeAppList: LIMITED_FREE_APPS,
    recommendationList: MY_RECOMMENDED_APPS,
    opposeList: MY_OPPOSED_APPS,
    cloudedList: MY_CLOUDED_APPS,
    ratingMap: MY_RATING,

    nsfwList: [],
    improperList: [],
    hideList: [],
  });
  const formRef = useRef(null);

  const [dataIndex, setDataIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const data = STORED_APP_DETAIL[dataRef.current[dataIndex]];
  useEffect(() => {
    if (dataIndex === -1) return;
    let index = dataIndex;
    while (
      MANUAL_PROCESSED_APP.has(STORED_APP_DETAIL[dataRef.current[index]].appid)
      // STORED_APP_DETAIL[dataRef.current[index]].totalTime !== 0
    ) {
      index++;
      if (index === dataRef.current.length) {
        setDataIndex(-1);
        return;
      }
    }
    setDataIndex(index);
    console.log(`[log]: handling item ${index}`);
    setShowPreview(true);
  }, [dataIndex]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    let { appid, price } = data;

    switch (Number(e.target.nsfw.value)) {
      case HIDE_APP_LEVEL.NSFW:
        resultRef.current.nsfwList.push(appid);
        break;
      case HIDE_APP_LEVEL.IMPROPER:
        resultRef.current.improperList.push(appid);
        break;
      case HIDE_APP_LEVEL.HIDE:
        resultRef.current.hideList.push(appid);
        break;
    }
    switch (Number(e.target.rec.value)) {
      case RECOMMEND.WORTHY:
        resultRef.current.recommendationList.add(appid);
        break;
      case RECOMMEND.AGAINST:
        resultRef.current.opposeList.add(appid);
        break;
    }
    if (e.target.free.value && price !== PRICE.FREE)
      resultRef.current.limitedFreeAppList.add(appid);
    if (e.target.rating.value)
      resultRef.current.ratingMap[appid] = Number(e.target.rating.value);
    if (Boolean(e.target.cloud.value)) resultRef.current.cloudedList.add(appid);
    if (Boolean(e.target.notSale.value))
      resultRef.current.stopSaleList.add(appid);

    resultRef.current.processedAppList.add(appid);
    console.log(`#${appid} processed`);
    console.log(resultRef.current);
    setShowPreview(false);
    setDataIndex(dataIndex + 1);
    e.target.reset();
  };
  const onSkip = (e) => {
    setDataIndex(dataIndex + 1);
    formRef.current.reset();
  };

  return (
    showPreview &&
    dataIndex !== -1 && (
      <div style={{ display: "flex", paddingTop: "20px" }}>
        <div style={{ width: "300px" }}>
          <AppItem data={data} referrer={() => {}} sortMode={null} />
        </div>
        <fieldset>
          <legend>data</legend>
          <div>age: {data.requiredAge}</div>
          <div>price: {data.price}</div>
          <div>time: {playLength(data.totalTime, lang)}</div>
        </fieldset>
        <form ref={formRef} onSubmit={onFormSubmit} style={{ display: "flex" }}>
          <div>
            <fieldset>
              <legend>rating</legend>
              <input type="number" name="rating" step="0.01" />
            </fieldset>
            <fieldset>
              <legend>nsfw</legend>
              <div>
                <input type="radio" name="nsfw" />
                <label>ok</label>
              </div>
              <div>
                <input type="radio" name="nsfw" value={HIDE_APP_LEVEL.NSFW} />
                <label>nsfw</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="nsfw"
                  value={HIDE_APP_LEVEL.IMPROPER}
                />
                <label>improper</label>
              </div>
              <div>
                <input type="radio" name="nsfw" value={HIDE_APP_LEVEL.HIDE} />
                <label>hide</label>
              </div>
            </fieldset>
            <fieldset>
              <legend>推荐</legend>
              <div>
                <input type="radio" name="rec" value={RECOMMEND.WORTHY} />
                <label>yes</label>
              </div>
              <div>
                <input type="radio" name="rec" />
                <label>cancel</label>
              </div>
              <div>
                <input type="radio" name="rec" value={RECOMMEND.AGAINST} />
                <label>oppose</label>
              </div>
            </fieldset>
            <fieldset>
              <legend>喜加一</legend>
              <div>
                <input type="radio" name="free" value={true} />
                <label>yes</label>
              </div>
              <div>
                <input type="radio" name="free" value={false} />
                <label>no</label>
              </div>
            </fieldset>
            <input type="submit" />
            <button onClick={onSkip}>skip</button>
          </div>
          <div>
            <fieldset>
              <legend>cloud</legend>
              <div>
                <input type="radio" name="cloud" value={true} />
                <label>yes</label>
              </div>
              <div>
                <input type="radio" name="cloud" value={false} />
                <label>no</label>
              </div>
            </fieldset>
            <fieldset>
              <legend>not saling</legend>
              <div>
                <input type="radio" name="notSale" value={true} />
                <label>yes</label>
              </div>
              <div>
                <input type="radio" name="notSale" />
                <label>no</label>
              </div>
            </fieldset>
          </div>
        </form>
      </div>
    )
  );
}
