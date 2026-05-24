import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { translator } from '../translation/translator';
import { TRANSLATE_COLLECTION, MODAL_CONTEXT, modalTypeContext } from '../translation/context';

export function ModalDeleteConfirm({ node, descendantCount, onConfirm, onCancel }) {
  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.MODAL);

  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); onConfirm(); }
  };

  // Subtitle assembled as: "<key> (<type>)[ and N descendant(s)]".
  // Type word is localized via modalTypeContext.
  let subtitle = `${String(node.key)} (${t(modalTypeContext(node.type))})`;
  if (descendantCount > 0) {
    const noun = descendantCount === 1
      ? t(MODAL_CONTEXT.DELETE_DESC_SINGULAR)
      : t(MODAL_CONTEXT.DELETE_DESC_PLURAL);
    subtitle += `${t(MODAL_CONTEXT.DELETE_AND)}${descendantCount} ${noun}`;
  }

  return (
    <div className="oak-modal" tabIndex={-1} onKeyDown={onKey}>
      <h3 className="oak-modal__title">{t(MODAL_CONTEXT.DELETE_TITLE)}</h3>
      <div className="oak-modal__subtitle">{subtitle}</div>
      <div className="oak-modal__buttons">
        <button className="oak-modal__btn" onClick={onCancel}>{t(MODAL_CONTEXT.BUTTON_CANCEL)}</button>
        <button className="oak-modal__btn oak-modal__btn--danger" onClick={onConfirm}>{t(MODAL_CONTEXT.BUTTON_DELETE)}</button>
      </div>
    </div>
  );
}
