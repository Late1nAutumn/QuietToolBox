import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { translator } from '../translation/translator';
import { TRANSLATE_COLLECTION, MODAL_CONTEXT, modalTypeContext } from '../translation/context';

export function ModalEditValue({ node, onSubmit, onCancel }) {
  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.MODAL);

  const [type, setType] = useState(node.type);
  const [text, setText] = useState(() => {
    if (node.type === 'string') return node.value ?? '';
    if (node.type === 'null') return '';
    return String(node.value ?? '');
  });
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select?.();
  }, []);

  const submit = () => {
    let value;
    if (type === 'null') {
      value = null;
    } else if (type === 'boolean') {
      if (text !== 'true' && text !== 'false') {
        setError(t(MODAL_CONTEXT.EDIT_ERR_BOOLEAN));
        return;
      }
      value = text === 'true';
    } else if (type === 'number') {
      const n = Number(text);
      if (!Number.isFinite(n)) {
        setError(t(MODAL_CONTEXT.EDIT_ERR_NUMBER));
        return;
      }
      value = n;
    } else {
      value = text;
    }
    onSubmit(type, value);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="oak-modal" onKeyDown={onKey}>
      <h3 className="oak-modal__title">{t(MODAL_CONTEXT.EDIT_TITLE)}</h3>
      <div className="oak-modal__subtitle">
        {t(MODAL_CONTEXT.EDIT_KEY_PREFIX)}<strong>{String(node.key)}</strong>
      </div>

      <div className="oak-modal__field">
        <label className="oak-modal__label">{t(MODAL_CONTEXT.EDIT_LABEL_TYPE)}</label>
        <select
          className="oak-modal__select"
          value={type}
          onChange={(e) => { setType(e.target.value); setError(''); }}
        >
          {['string', 'number', 'boolean', 'null'].map(typeName => (
            <option key={typeName} value={typeName}>{t(modalTypeContext(typeName))}</option>
          ))}
        </select>
      </div>

      {type !== 'null' && (
        <div className="oak-modal__field">
          <label className="oak-modal__label">{t(MODAL_CONTEXT.EDIT_LABEL_VALUE)}</label>
          {type === 'boolean' ? (
            <select
              ref={inputRef}
              className="oak-modal__select"
              value={text === 'false' ? 'false' : 'true'}
              onChange={(e) => setText(e.target.value)}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              ref={inputRef}
              className="oak-modal__input"
              type={type === 'number' ? 'number' : 'text'}
              value={text}
              onChange={(e) => { setText(e.target.value); setError(''); }}
            />
          )}
        </div>
      )}

      <div className="oak-modal__error">{error}</div>

      <div className="oak-modal__buttons">
        <button className="oak-modal__btn" onClick={onCancel}>{t(MODAL_CONTEXT.BUTTON_CANCEL)}</button>
        <button className="oak-modal__btn oak-modal__btn--primary" onClick={submit}>{t(MODAL_CONTEXT.BUTTON_SAVE)}</button>
      </div>
    </div>
  );
}
