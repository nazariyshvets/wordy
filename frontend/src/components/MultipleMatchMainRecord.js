import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import useDragRecordData from "../utils/useDragRecordData";

export default function MultipleMatchMainRecord({
  id,
  term,
  definition,
  handleDrop,
}) {
  const { isDragging, dragRef } = useDragRecordData(id, definition, handleDrop);

  const [, dropRef] = useDrop({
    accept: "record",
    drop: () => ({ mainRecordId: id, mainRecordDefinition: definition }),
  });

  const ref = useRef(null);
  const dragDropRef = definition ? dragRef(dropRef(ref)) : dropRef(ref);

  return (
    <div className="multiple-match-main-record">
      <div className="multiple-match-main-record--term">{term}</div>
      <div
        className={`multiple-match-main-record--definition 
        ${definition ? "filled" : ""} ${isDragging ? "dragging" : ""}`}
        ref={dragDropRef}
      >
        {definition}
      </div>
    </div>
  );
}
