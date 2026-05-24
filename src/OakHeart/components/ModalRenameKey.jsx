import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { translator } from '../translation/translator';
import { TRANSLATE_COLLECTION, MODAL_CONTEXT } from '../translation/context';

export function ModalRenameKey({ initialKey, onSubmit, onCancel }) {
  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.MODAL);

  const [text, setText] = useState(String(initialKey ?? ''));
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select?.();
  }, []);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) { setError(t(MODAL_CONTEXT.RENAME_ERR_EMPTY)); return; }
    onSubmit(trimmed);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  };

  return (
    <div className="oak-modal" onKeyDown={onKey}>
      <h3 className="oak-modal__title">{t(MODAL_CONTEXT.RENAME_TITLE)}</h3>
      <div className="oak-modal__field">
        <label className="oak-modal__label">{t(MODAL_CONTEXT.RENAME_LABEL)}</label>
        <input
          ref={inputRef}
          className="oak-modal__input"
          value={text}
          onChange={(e) => { setText(e.target.value); setError(''); }}
        />
      </div>
      <div className="oak-modal__error">{error}</div>
      <div className="oak-modal__buttons">
        <button className="oak-modal__btn" onClick={onCancel}>{t(MODAL_CONTEXT.BUTTON_CANCEL)}</button>
        <button className="oak-modal__btn oak-modal__btn--primary" onClick={submit}>{t(MODAL_CONTEXT.BUTTON_SAVE)}</button>
      </div>
    </div>
  );
}
