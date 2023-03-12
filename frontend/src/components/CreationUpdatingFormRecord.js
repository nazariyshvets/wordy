import React from "react";

export default function CreationUpdatingFormRecord(props) {
  return (
    <div className="creation-updating--form--record">
      <input
        className="creation-updating--form--input"
        name="term"
        placeholder="term"
        value={props.term}
        required
        maxLength={200}
        onChange={(event) => {
          props.handleChange(event, props.id);
        }}
      />
      <input
        className="creation-updating--form--input"
        name="definition"
        placeholder="definition"
        value={props.definition}
        required
        maxLength={400}
        onChange={(event) => {
          props.handleChange(event, props.id);
        }}
      />
      <div
        className="creation-updating--form--remove"
        onClick={props.handleRemove}>
        x
      </div>
    </div>
  );
}
