import React from "react";

import { STEAM_LINKS } from "../constants";
import { LANG } from "../../utils/enums";
import { achievementPortion, categoryMapper, playLength } from "../utils";
import { useGlobal } from "../../context/GlobalContext";
import { GENRE, PRICE } from "../dataProcess/steam";
import { translator } from "../translation/translator";
import { TOOLTIP_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";
import { toISODate } from "../../utils/functions";
import { SORT_MODE } from "../dataProcess/enums";
import { MY_RATING } from "../dataProcess/lists";
import { Star } from "../../svg/Star";
import { StarHalf } from "../../svg/StarHalf";
import { StarHollow } from "../../svg/StarHollow";
import { StarHollowHalf } from "../../svg/StarHollowHalf";

export default function AppItem({ data, referrer, sortMode }) {
  const {
    appid,
    name,
    price,
    categories,
    genres,
    achievements,
    achieved,
    releaseDate,

    totalTime,
    lastTime,

    requiredAge,
  } = data;

  const { lang } = useGlobal();

  const tipValue = (() => {
    switch (sortMode) {
      case SORT_MODE.RELEASE_DATE:
        return (
          translator(releaseDate, lang, TRANSLATE_COLLECTION.APP_TOOLTIP) ||
          releaseDate
        );
      case SORT_MODE.PRICE:
        return price;
      case SORT_MODE.MY_RATING:
        let rating = MY_RATING[appid];
        return rating ? (
          <>
            {rating.toFixed(1)}
            <Star />
          </>
        ) : (
          ""
        );
      case SORT_MODE.MY_GAME_TIME:
        return playLength(totalTime, lang);
      case SORT_MODE.MY_LAST_TIME:
        return toISODate(lastTime * 1000);
      case SORT_MODE.MY_ACHIEVEMENT:
        return `${Math.ceil(
          achievementPortion(achieved, achievements) * 100
        )}%`;
      default:
        return "";
    }
  })();

  const onImgLoadError = (e, appid) => {
    e.target.style.visibility = "hidden";
    let link = STEAM_LINKS.appBanner(appid);
    e.target.previousElementSibling.src = link;
    e.target.nextElementSibling.src = link;
  };

  const onMouseEnterItem = (e) => {
    let { clientX, currentTarget } = e;
    let isLeft = clientX < window.innerWidth / 2;
    currentTarget.nextElementSibling.classList.add(
      `steamster-grid-item-tooltip-${isLeft ? "left" : "right"}`
    );
    currentTarget.nextElementSibling.classList.remove(
      `steamster-grid-item-tooltip-${isLeft ? "right" : "left"}`
    );
  };

  const stars = (rating) => {
    if (rating === undefined) return null;
    let stars = [<Star />, <StarHalf />, <StarHollow />, <StarHollowHalf />];
    let counts =
      rating === 0
        ? [0, 0, 0, 1]
        : [
            Math.floor(Math.max(rating - 5, 0)),
            (rating - 5) % 1 >= 0.5 ? 1 : 0,
            Math.floor(Math.max(rating, 0)),
            (rating - 5) % 1 <= -0.5 ? 1 : 0,
          ];
    return counts
      .map((count, star) => new Array(count).fill(star))
      .flat()
      .map((star) => stars[star])
      .slice(0, 5);
  };

  return (
    <div ref={referrer} className="steamster-grid-item">
      <a
        href={STEAM_LINKS.appStorePage(appid)}
        target="_blank"
        onMouseEnter={onMouseEnterItem}
      >
        <div>
          <img className="steamster-grid-item-bg" loading="lazy" />
          <img
            className="steamster-grid-item-stand"
            src={STEAM_LINKS.appStanding(appid)}
            loading="lazy"
            onError={(e) => onImgLoadError(e, appid)}
          />
          <img className="steamster-grid-item-banner" loading="lazy" />
          {tipValue && (
            <div className="steamster-grid-item-tip">{tipValue}</div>
          )}
        </div>
      </a>
      <div className="steamster-grid-item-tooltip">
        <div className="steamster-grid-item-tooltip-title">
          {name[String(lang)] || name[String(LANG.EN)]}
        </div>
        <div className="steamster-grid-item-tooltip-content">
          <div className="steamster-grid-item-tooltip-stars">
            {stars(MY_RATING[data.appid])}
          </div>
          <div>
            {price !== PRICE.FREE
              ? price
              : translator(PRICE.FREE, lang, TRANSLATE_COLLECTION.APP_TOOLTIP)}
          </div>
          {totalTime > 0 ? (
            <>
              <div>
                {translator(
                  TOOLTIP_CONTEXT.TOTAL_TIME,
                  lang,
                  TRANSLATE_COLLECTION.APP_TOOLTIP
                )}
                :&nbsp;{playLength(totalTime, lang)}
              </div>
              <div>
                {translator(
                  TOOLTIP_CONTEXT.LAST_TIME,
                  lang,
                  TRANSLATE_COLLECTION.APP_TOOLTIP
                )}
                :&nbsp;
                {toISODate(lastTime * 1000)}
              </div>
            </>
          ) : (
            <div>
              {translator(
                TOOLTIP_CONTEXT.PLAYED_STATUS,
                lang,
                TRANSLATE_COLLECTION.APP_TOOLTIP
              )}
            </div>
          )}
          {achievements ? (
            <div>
              {translator(
                TOOLTIP_CONTEXT.ACHIEVEMENT,
                lang,
                TRANSLATE_COLLECTION.APP_TOOLTIP
              )}
              :&nbsp;{achieved}/{achievements}
            </div>
          ) : null}
          <hr />
          <div>
            {translator(
              TOOLTIP_CONTEXT.RELEASE,
              lang,
              TRANSLATE_COLLECTION.APP_TOOLTIP
            )}
            :&nbsp;
            {translator(releaseDate, lang, TRANSLATE_COLLECTION.APP_TOOLTIP) ||
              releaseDate}
          </div>
          <div>
            {translator(
              TOOLTIP_CONTEXT.GENRE,
              lang,
              TRANSLATE_COLLECTION.APP_TOOLTIP
            )}
            :
            {genres?.map((id, i) => (
              <span className="steamster-grid-item-tooltip-tag" key={i}>
                {GENRE[id][lang]}
              </span>
            ))}
          </div>
          <div>
            {translator(
              TOOLTIP_CONTEXT.CATEGORY,
              lang,
              TRANSLATE_COLLECTION.APP_TOOLTIP
            )}
            :
            {categories?.map((id, i) => {
              let text = categoryMapper(id, lang);
              return text ? (
                <span className="steamster-grid-item-tooltip-tag" key={i}>
                  {text}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
