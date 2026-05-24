import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { translator } from '../translation/translator';
import { TRANSLATE_COLLECTION, MODAL_CONTEXT, modalTypeContext } from '../translation/context';

const VALID_TYPES = ['object', 'array', 'string', 'number', 'boolean', 'null'];

export function ModalAddChild({ parentType, onSubmit, onCancel }) {
  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.MODAL);

  const isObject = parentType === 'object';
  const [key, setKey] = useState('');
  const [type, setType] = useState('string');
  const [error, setError] = useState('');
  const firstFieldRef = useRef(null);

  useEffect(() => { firstFieldRef.current?.focus(); }, []);

  const submit = () => {
    if (isObject && !key.trim()) { setError(t(MODAL_CONTEXT.ADD_ERR_KEY)); return; }
    onSubmit(isObject ? key.trim() : null, type);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  };

  // Subtitle assembled as: prefix + localized type word + suffix.
  const subtitle = `${t(MODAL_CONTEXT.ADD_PREFIX)}${t(modalTypeContext(parentType))}${
    isObject ? t(MODAL_CONTEXT.ADD_OBJECT_SUFFIX) : t(MODAL_CONTEXT.ADD_ARRAY_SUFFIX)
  }`;

  return (
    <div className="oak-modal" onKeyDown={onKey}>
      <h3 className="oak-modal__title">{t(MODAL_CONTEXT.ADD_TITLE)}</h3>
      <div className="oak-modal__subtitle">{subtitle}</div>

      {isObject && (
        <div className="oak-modal__field">
          <label className="oak-modal__label">{t(MODAL_CONTEXT.ADD_LABEL_KEY)}</label>
          <input
            ref={firstFieldRef}
            className="oak-modal__input"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(''); }}
          />
        </div>
      )}

      <div className="oak-modal__field">
        <label className="oak-modal__label">{t(MODAL_CONTEXT.ADD_LABEL_TYPE)}</label>
        <select
          ref={isObject ? null : firstFieldRef}
          className="oak-modal__select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {VALID_TYPES.map(typeName => (
            <option key={typeName} value={typeName}>{t(modalTypeContext(typeName))}</option>
          ))}
        </select>
      </div>

      <div className="oak-modal__error">{error}</div>

      <div className="oak-modal__buttons">
        <button className="oak-modal__btn" onClick={onCancel}>{t(MODAL_CONTEXT.BUTTON_CANCEL)}</button>
        <button className="oak-modal__btn oak-modal__btn--primary" onClick={submit}>{t(MODAL_CONTEXT.BUTTON_ADD)}</button>
      </div>
    </div>
  );
}
