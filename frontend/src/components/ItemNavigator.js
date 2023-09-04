import "../css/ItemNavigator.css";

function ItemNavigator({ currentItemIndex, itemsCount, onPrev, onNext }) {
  return (
    <div className="item-navigator">
      <button
        className={`item-navigator--prev ${
          currentItemIndex === 0 ? "hidden" : ""
        }`}
        onClick={onPrev}
      >
        <i className="fa fa-solid fa-arrow-left"></i>
      </button>

      <div className="item-navigator--current-item">
        {`${currentItemIndex + 1}/${itemsCount}`}
      </div>

      <button
        className={`item-navigator--next ${
          currentItemIndex === itemsCount - 1 ? "hidden" : ""
        }`}
        onClick={onNext}
      >
        <i className="fa fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}

export default ItemNavigator;
