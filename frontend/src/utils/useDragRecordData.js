import { useDrag } from "react-dnd";

export default function useDragRecordData(id, definition, handleDrop) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "record",
    item: { id, definition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const { mainRecordId, mainRecordDefinition } = monitor.getDropResult();

        handleDrop(
          item.id,
          item.definition,
          mainRecordId,
          mainRecordDefinition
        );
      }
    },
  });

  return { isDragging, dragRef };
}
