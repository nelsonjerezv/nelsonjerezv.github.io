function Gallery(props) {
    let photos = props.photos;
    let isSelectionMode = props.isSelectionMode;
    let hasSelections = props.hasSelections;
    let selectedPhotos = props.selectedPhotos;
    let onToggleSelect = props.onToggleSelect;
    let onOpenLightbox = props.onOpenLightbox;

    if (!photos || photos.length === 0) {
        return React.createElement("p", null, "No hay fotos para mostrar.");
    }
    let items = [];
    for (let j = 0; j < photos.length; j++) {
        let photo = photos[j];
        let idx = j;
        let isSelected = false;
        for (let k = 0; k < selectedPhotos.length; k++) {
            if (selectedPhotos[k].id === photo.id) {
                isSelected = true;
                break;
            }
        }
        let className =
            "gallery-item" + (isSelectionMode && isSelected ? " selected" : "");
        let onClick = (function (isSelectionMode, photo, idx) {
            return function () {
                if (isSelectionMode) {
                    onToggleSelect(photo);
                } else {
                    onOpenLightbox(idx);
                }
            };
        })(isSelectionMode, photo, idx);

        let overlay = null;
        if (hasSelections) {
            let topOnClick = (function (idx) {
                return function (e) {
                    e.stopPropagation();
                    onOpenLightbox(idx);
                };
            })(idx);
            let bottomOnClick = (function (photo) {
                return function (e) {
                    e.stopPropagation();
                    onToggleSelect(photo);
                };
            })(photo);
            let bottomText = isSelected ? "Deseleccionar" : "Seleccionar";
            overlay = React.createElement(
                "div",
                { className: "gallery-overlay" },
                React.createElement(
                    "button",
                    { className: "gallery-overlay-top", onClick: topOnClick },
                    "Ver"
                ),
                React.createElement(
                    "button",
                    {
                        className: "gallery-overlay-bottom",
                        onClick: bottomOnClick,
                    },
                    bottomText
                )
            );
        }
        let photoKey =
            photo.id || (photo.name || "noname") + "|" + (photo.url || "nourl");
        items.push(
            React.createElement(
                "div",
                { key: photoKey, className: className, onClick: onClick },
                React.createElement("img", {
                    src: photo.url,
                    alt: photo.name || "Imagen",
                    onError: function (e) {
                        applyRobustFallback(
                            e.target,
                            400,
                            300,
                            "Imagen no disponible"
                        );
                    },
                }),
                overlay
            )
        );
    }
    return React.createElement("div", { className: "gallery" }, items);
}
