/**
 * Right-side panel for OakHeart. Two-way binding:
 *   canvas → textarea : When canonicalJson changes and the user is neither
 *                       focused nor mid-edit, draft is overwritten.
 *   textarea → canvas : Debounced parse (300ms). Empty input clears the
 *                       canvas (no error). Otherwise on parse success calls
 *                       onJsonChange(parsed); on failure, canvas stays put
 *                       and the status pill flips to "Invalid".
 *
 * The host owns `collapsed` state and toggling — when collapsed the panel
 * shrinks to a thin strip showing only the expand affordance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { translator } from '../translation/translator';
import { TRANSLATE_COLLECTION, SIDEBAR_CONTEXT } from '../translation/context';
import { ChevronRight } from '../../components/svg/ChevronRight';
import { Warning } from '../../components/svg/Warning';

const PARSE_DEBOUNCE_MS = 300;

export function JsonSidebar({
  canonicalJson,
  onJsonChange,
  collapsed,
  onToggleCollapsed,
  warningMessage,
  totalCount,
  hiddenCount,
}) {
  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.SIDEBAR);

  const [draft, setDraft] = useState(canonicalJson);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const focusedRef = useRef(false);
  const dirtyRef = useRef(false);
  const debounceRef = useRef(null);

  useEffect(() => { dirtyRef.current = isDirty; }, [isDirty]);

  useEffect(() => {
    // Normally, preserve the user's in-flight draft (focused or dirty).
    // EXCEPTION: when the draft is currently in error state, the canvas
    // is the authoritative source. Any canvas-driven mutation (Edit /
    // Rename / Add child / Delete) overrides the broken draft so the
    // textarea always reflects what's actually rendered.
    if ((focusedRef.current || dirtyRef.current) && !error) return;
    setDraft(canonicalJson);
    setError('');
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalJson]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleChange = (e) => {
    const v = e.target.value;
    setDraft(v);
    setIsDirty(v !== canonicalJson);
    setError('');
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Empty input is a valid "no document" state — clear canvas without
      // raising a parse error.
      if (v.trim() === '') {
        setError('');
        setIsDirty(false);
        onJsonChange(undefined);
        return;
      }
      try {
        const parsed = JSON.parse(v);
        setError('');
        setIsDirty(false);
        onJsonChange(parsed);
      } catch (err) {
        setError(err.message);
      }
    }, PARSE_DEBOUNCE_MS);
  };

  const handleFocus = () => { focusedRef.current = true; };
  const handleBlur = () => {
    focusedRef.current = false;
    if (!dirtyRef.current && !error) setDraft(canonicalJson);
  };

  if (collapsed) {
    return (
      <aside className="oak__sidebar oak__sidebar--collapsed">
        <button
          className="oak__sidebar-tab"
          onClick={onToggleCollapsed}
          title={t(SIDEBAR_CONTEXT.TIP_EXPAND)}
        >
          <span className="oak__sidebar-tab-icon oak__sidebar-tab-icon--left">
            <ChevronRight />
          </span>
        </button>
      </aside>
    );
  }

  let statusLabel, statusClass;
  if (error) { statusLabel = t(SIDEBAR_CONTEXT.STATUS_INVALID); statusClass = 'err'; }
  else if (isDirty) { statusLabel = t(SIDEBAR_CONTEXT.STATUS_EDITING); statusClass = 'dirty'; }
  else { statusLabel = t(SIDEBAR_CONTEXT.STATUS_SYNCED); statusClass = 'ok'; }

  return (
    <aside className="oak__sidebar">
      <div className="oak__sidebar-header">
        <button
          className="oak__sidebar-collapse-btn"
          onClick={onToggleCollapsed}
          title={t(SIDEBAR_CONTEXT.TIP_COLLAPSE)}
        >
          <span className="oak__sidebar-tab-icon">
            <ChevronRight />
          </span>
        </button>
        <span className="oak__sidebar-title">{t(SIDEBAR_CONTEXT.TITLE)}</span>
        {warningMessage && (
          <span className="oak__sidebar-warn" title={warningMessage}>
            <Warning />
          </span>
        )}
        <span className={`oak__status-pill oak__status-pill--${statusClass}`}>
          <span className="oak__status-dot" />
          {statusLabel}
        </span>
      </div>
      {error && (
        <div className="oak__sidebar-error">{error}</div>
      )}
      <div className="oak__textarea-wrap">
        <textarea
          className="oak__textarea"
          value={draft}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          spellCheck={false}
          autoComplete="off"
          placeholder={t(SIDEBAR_CONTEXT.PLACEHOLDER)}
        />
      </div>
      <div className="oak__sidebar-counts">
        <span>{t(SIDEBAR_CONTEXT.COUNT_TOTAL)}{totalCount}</span>
        <span className="oak__sidebar-counts-sep">·</span>
        <span>{t(SIDEBAR_CONTEXT.COUNT_HIDDEN)}{hiddenCount}</span>
      </div>
    </aside>
  );
}
