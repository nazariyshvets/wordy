import React from "react";
import useDragRecordData from "../utils/useDragRecordData";

export default function MultipleMatchTopbarRecord({
  id,
  definition,
  handleDrop,
}) {
  const { isDragging, dragRef } = useDragRecordData(id, definition, handleDrop);

  return (
    <div
      className={`multiple-match-topbar-record ${isDragging ? "dragging" : ""}`}
      ref={dragRef}>
      {definition}
    </div>
  );
}
