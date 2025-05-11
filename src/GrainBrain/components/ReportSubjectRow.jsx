import React from "react";

import { useGlobal } from "../../context/GlobalContext";
import { decimaling } from "../../utils/functions";
import { reportSubjectDecimaling, reportSubjectToUnit } from "../utils/func";

import { translator } from "../utils/translation/translator";
import { TRANSLATION_COLLECTION } from "../utils/translation/context";

export default function ReportSubjectRow({ report, subject }) {
  const { lang } = useGlobal();

  return (
    <tr
      title={translator(
        subject,
        lang,
        TRANSLATION_COLLECTION.TOOLTIP_REPORT_SUBJECT,
        true
      )}
    >
      <td className="grainbrain-toolbar-subject-fieldname">
        {translator(subject, lang, TRANSLATION_COLLECTION.REPORT_SUBJECT_LABEL)}
        :
      </td>
      <td className="grainbrain-toolbar-subject-fieldvalue">
        {decimaling(report?.[subject] || 0, reportSubjectDecimaling(subject))}
        &nbsp;
        {translator(
          reportSubjectToUnit(subject),
          lang,
          TRANSLATION_COLLECTION.DATA_UNIT_NAME,
          true
        )}
      </td>
    </tr>
  );
}
