/**
 * Single canvas card. Rendered inside Isles' renderElement().
 *
 * Layout (top to bottom):
 *   ┌──────────────────────────────────┐
 *   │ key                              │
 *   │ value                            │
 *   │ [actions...]            [badge]  │  hover-revealed action buttons
 *   └──────────────────────────────────┘  + right collapse strip if compound
 *
 * Why React.memo:
 *   With 1000+ visible nodes, a single drag re-creates `nodes` (the array),
 *   but only the moved element gets a new object reference. memo + stable
 *   `dispatch` means untouched nodes skip render entirely.
 */

import React from 'react';
import { ChevronRight } from '../../components/svg/ChevronRight';
import { Edit } from '../../components/svg/Edit';
import { Tag } from '../../components/svg/Tag';
import { Trash } from '../../components/svg/Trash';
import { Plus } from '../../components/svg/Plus';
import { Lock } from '../../components/svg/Lock';
import { useGlobal } from '../../context/GlobalContext';
import { translator } from '../translation/translator';
import { TRANSLATE_COLLECTION, NODE_CONTEXT } from '../translation/context';

function formatValue(node) {
  if (node.type === 'string') return `"${node.value ?? ''}"`;
  if (node.type === 'null') return 'null';
  return String(node.value);
}

export const Node = React.memo(function Node({
  node,
  childCount,
  isCollapsed,
  isCompound,
  canRename,
  isLocked,
  dispatch,
}) {
  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.NODE);
  const stop = (e) => e.stopPropagation();
  const canDelete = node.parentId != null;

  // Body text: compound → "[ N items ]" / "{ N items }" with translated noun;
  //            primitive → quoted value (string) or stringified literal;
  //            collapsed → "··· +N hidden" (CN "项已隐藏").
  let bodyText;
  if (isCollapsed) {
    bodyText = `··· +${childCount} ${t(NODE_CONTEXT.PLACEHOLDER_HIDDEN)}`;
  } else if (isCompound) {
    const noun = childCount === 1
      ? t(NODE_CONTEXT.ITEM_SINGULAR)
      : t(NODE_CONTEXT.ITEM_PLURAL);
    const open = node.type === 'array' ? '[' : '{';
    const close = node.type === 'array' ? ']' : '}';
    bodyText = `${open} ${childCount} ${noun} ${close}`;
  } else {
    bodyText = formatValue(node);
  }

  return (
    <div className={`oak-node oak-node--${node.type}`}>
      <div className="oak-node__main">
        <div className="oak-node__key">{String(node.key)}</div>

        <div className={`oak-node__value${isCollapsed ? ' oak-node__value--hidden' : ''}`}>
          {bodyText}
        </div>

        <div className="oak-node__actionbar">
          <div className="oak-node__actions">
            {canRename && (
              <button
                className="oak-node__icon-btn"
                onMouseDown={stop}
                onClick={() => dispatch('rename', node.id)}
                title={t(NODE_CONTEXT.TIP_RENAME)}
              >
                <Tag />
              </button>
            )}
            {!isCompound && (
              <button
                className="oak-node__icon-btn"
                onMouseDown={stop}
                onClick={() => dispatch('edit', node.id)}
                title={t(NODE_CONTEXT.TIP_EDIT)}
              >
                <Edit />
              </button>
            )}
            {isCompound && (
              <button
                className="oak-node__icon-btn oak-node__icon-btn--primary"
                onMouseDown={stop}
                onClick={() => dispatch('add', node.id)}
                title={t(NODE_CONTEXT.TIP_ADD)}
              >
                <Plus />
              </button>
            )}
            <button
              className={`oak-node__icon-btn${isLocked ? ' oak-node__icon-btn--active' : ''}`}
              onMouseDown={stop}
              onClick={() => dispatch('lock', node.id)}
              title={isLocked ? t(NODE_CONTEXT.TIP_UNLOCK) : t(NODE_CONTEXT.TIP_LOCK)}
            >
              <Lock />
            </button>
            {canDelete && (
              <button
                className="oak-node__icon-btn oak-node__icon-btn--danger"
                onMouseDown={stop}
                onClick={() => dispatch('delete', node.id)}
                title={t(NODE_CONTEXT.TIP_DELETE)}
              >
                <Trash />
              </button>
            )}
          </div>
          <span className="oak-node__badge">{node.type}</span>
        </div>
      </div>

      {isCompound && (
        <button
          className="oak-node__collapse-strip"
          onMouseDown={stop}
          onClick={() => dispatch('toggle', node.id)}
          title={isCollapsed
            ? `${t(NODE_CONTEXT.TIP_EXPAND)} (+${childCount})`
            : t(NODE_CONTEXT.TIP_COLLAPSE)}
        >
          <span
            className={`oak-node__chevron oak-node__chevron--${isCollapsed ? 'left' : 'right'}`}
          >
            <ChevronRight />
          </span>
        </button>
      )}
    </div>
  );
});
