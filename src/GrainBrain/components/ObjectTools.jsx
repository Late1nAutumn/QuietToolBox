import React, { useEffect, useState } from "react";
import { useGlobal } from "../../context/GlobalContext";

import { ASSUMPTION } from "../utils/aoe4/data";
import { BUILDING } from "../utils/aoe4/enum";
import { HELP_PAGE_MODE, REPORT_SUBJECT } from "../utils/enum";
import {
  farmReportToTotalGatherDuration,
  farmReportToTotalPrecastDuration,
} from "../utils/func";

import { translator } from "../utils/translation/translator";
import {
  APP_MISC_CONTEXT,
  LEGEND_CONTEXT,
  TOOLBAR_TITLE_CONTEXT,
  TOOLTIP_ICONS_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../utils/translation/context";

import ReportSubjectRow from "./ReportSubjectRow";

export default function ObjectTools({
  uuid,
  report,
  gridRef,
  setSelectedObject,
  updateObjectList,
  updateAvailabilities,
  openHelpModal,
}) {
  const { lang } = useGlobal();

  const [data, setData] = useState(null);

  useEffect(() => {
    setData(gridRef.current.atlas[uuid]);
  }, []);

  const onBackClick = () => {
    setSelectedObject(null);
  };
  const onDeleteClick = () => {
    gridRef.current.deleteObject(uuid);
    updateObjectList();
    updateAvailabilities();
    setSelectedObject(null);
  };

  return (
    <div className="grainbrain-toolbar-content">
      <div>
        {(() => {
          switch (data?.kind) {
            case BUILDING.GRANARY:
            case BUILDING.MILL:
            case BUILDING.FARM:
              return (
                <div className="grainbrain-toolbar-title">
                  <h2>
                    {translator(
                      TOOLBAR_TITLE_CONTEXT.INSIGHT,
                      lang,
                      TRANSLATION_COLLECTION.TOOLBAR_TITLE
                    )}
                  </h2>
                  <img
                    src="./asset/aoe4/research.png"
                    onClick={() => openHelpModal(HELP_PAGE_MODE.STATISTICS)}
                    title={translator(
                      TOOLTIP_ICONS_CONTEXT.BOOK,
                      lang,
                      TRANSLATION_COLLECTION.TOOLTIP_ICONS
                    )}
                  />
                </div>
              );
            case BUILDING.OTHER:
              return;
          }
        })()}

        <table>
          <tbody>
            {(() => {
              switch (data?.kind) {
                case BUILDING.GRANARY:
                  return [
                    REPORT_SUBJECT.BUFFED_FARM_COUNT,
                    REPORT_SUBJECT.BUFFED_CHUNK_COUNT,
                    REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK,
                    REPORT_SUBJECT.FARM_DROP_COUNT,
                    REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE,
                    REPORT_SUBJECT.AVERAGE_MOVE_DURATION,
                  ].map((subject, i) => (
                    <ReportSubjectRow
                      report={report}
                      subject={subject}
                      key={i}
                    />
                  ));
                case BUILDING.MILL:
                  return [
                    REPORT_SUBJECT.FARM_DROP_COUNT,
                    REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE,
                    REPORT_SUBJECT.AVERAGE_MOVE_DURATION,
                  ].map((subject, i) => (
                    <ReportSubjectRow
                      report={report}
                      subject={subject}
                      key={i}
                    />
                  ));
                case BUILDING.FARM:
                  return [
                    REPORT_SUBJECT.GATHER_RATE,
                    REPORT_SUBJECT.TOP_STACKS,
                    REPORT_SUBJECT.ACTIVE_CHUNKS,
                    REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK,
                    REPORT_SUBJECT.TOTAL_MOVE_DISTANCE,
                    REPORT_SUBJECT.PERIOD,
                    REPORT_SUBJECT.MOVE_DURATION,
                    REPORT_SUBJECT.MOVE_RATIO,
                  ].map((subject, i) => (
                    <ReportSubjectRow
                      report={report}
                      subject={subject}
                      key={i}
                    />
                  ));
                case BUILDING.OTHER:
                  return;
              }
            })()}
          </tbody>
        </table>
        {data?.kind === BUILDING.OTHER && (
          <div className="grainbrain-toolbar-centered">
            {translator(
              APP_MISC_CONTEXT.INSIGHT_OTHER_BUIDLING,
              lang,
              TRANSLATION_COLLECTION.APP_MISC
            )}
          </div>
        )}

        {report && data?.kind === BUILDING.FARM && (
          <>
            <div className="grainbrain-toolbar-timemap">
              <div
                className="grainbrain-toolbar-timemap-move"
                style={{ flexGrow: report[REPORT_SUBJECT.MOVE_DURATION] }}
              />
              <div
                className="grainbrain-toolbar-timemap-windup"
                style={{ flexGrow: farmReportToTotalPrecastDuration(report) }}
              />
              <div
                className="grainbrain-toolbar-timemap-gather"
                style={{ flexGrow: farmReportToTotalGatherDuration(report) }}
              />
              <div
                className="grainbrain-toolbar-timemap-drop"
                style={{ flexGrow: ASSUMPTION.RESOURCE_DROPOFF_DURATION }}
              />
            </div>
            <div className="grainbrain-toolbar-timemap-legend">
              <span className="grainbrain-toolbar-timemap-cube grainbrain-toolbar-timemap-move" />
              <span>
                {translator(
                  LEGEND_CONTEXT.TIMEMAP_MOVEMENT,
                  lang,
                  TRANSLATION_COLLECTION.LEGEND
                )}
              </span>
            </div>
            <div className="grainbrain-toolbar-timemap-legend">
              <span className="grainbrain-toolbar-timemap-cube grainbrain-toolbar-timemap-windup" />
              <span>
                {translator(
                  LEGEND_CONTEXT.TIMEMAP_GATHER_WINDUP,
                  lang,
                  TRANSLATION_COLLECTION.LEGEND
                )}
              </span>
            </div>
            <div className="grainbrain-toolbar-timemap-legend">
              <span className="grainbrain-toolbar-timemap-cube grainbrain-toolbar-timemap-gather" />
              <span>
                {translator(
                  LEGEND_CONTEXT.TIMEMAP_GATHERING,
                  lang,
                  TRANSLATION_COLLECTION.LEGEND
                )}
              </span>
            </div>
            <div className="grainbrain-toolbar-timemap-legend">
              <span className="grainbrain-toolbar-timemap-cube grainbrain-toolbar-timemap-drop" />
              <span>
                {translator(
                  LEGEND_CONTEXT.TIMEMAP_DROP_OFF,
                  lang,
                  TRANSLATION_COLLECTION.LEGEND
                )}
              </span>
            </div>
          </>
        )}

        <div className="grainbrain-toolbar-centered">
          <img src="./asset/aoe4/back.png" onClick={onBackClick} />
          <img
            src="./asset/aoe4/delete.png"
            onClick={onDeleteClick}
            title={translator(
              TOOLTIP_ICONS_CONTEXT.DELETE_SELECTED,
              lang,
              TRANSLATION_COLLECTION.TOOLTIP_ICONS
            )}
          />
        </div>
      </div>
    </div>
  );
}
