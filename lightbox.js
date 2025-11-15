function Lightbox(props) {
    let photos = props.photos;
    let index = props.index;
    let onClose = props.onClose;
    let onPrev = props.onPrev;
    let onNext = props.onNext;
    let onToggleSelect = props.onToggleSelect;
    let onGenerateOrder = props.onGenerateOrder;
    let selectedPhotos = props.selectedPhotos;

    let [isImageLoading, setIsImageLoading] = React.useState(true);
    let [touchStart, setTouchStart] = React.useState(null);
    let [touchEnd, setTouchEnd] = React.useState(null);

    if (index === -1) return null;
    let photo = photos[index];

    let isSelected = false;
    if (photo && selectedPhotos.length > 0) {
        for (let i = 0; i < selectedPhotos.length; i++) {
            if (selectedPhotos[i].id === photo.id) {
                isSelected = true;
                break;
            }
        }
    }
    let selectClass = isSelected
        ? "lightbox-select deselect"
        : "lightbox-select select";

    let handleImageLoad = function () {
        setIsImageLoading(false);
    };
    let resetLoading = function () {
        setIsImageLoading(true);
    };

    let handleTouchStart = function (e) {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    let handleTouchMove = function (e) {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    let handleTouchEnd = function () {
        if (!touchStart || !touchEnd) return;
        let distance = touchStart - touchEnd;
        if (distance > 50) {
            resetLoading();
            onNext();
        }
        if (distance < -50) {
            resetLoading();
            onPrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            {
                className: "lightbox",
                onClick: onClose,
                onTouchStart: handleTouchStart,
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd,
            },
            React.createElement("div", {
                className: "lightbox-backdrop",
                onClick: onClose,
            }),
            React.createElement(
                "button",
                {
                    className: "lightbox-close",
                    onClick: function (e) {
                        e.stopPropagation();
                        onClose();
                    },
                },
                "×"
            ),
            React.createElement(
                "button",
                {
                    className: "lightbox-nav lightbox-prev",
                    onClick: function (e) {
                        e.stopPropagation();
                        resetLoading();
                        onPrev();
                    },
                },
                "←"
            ),
            React.createElement(
                "div",
                {
                    className: "lightbox-image-container",
                    onClick: function (e) {
                        e.stopPropagation();
                    },
                },
                isImageLoading
                    ? React.createElement(
                          "div",
                          { className: "loading-overlay" },
                          React.createElement("div", {
                              className: "loading-spinner",
                          })
                      )
                    : null,
                React.createElement("img", {
                    src: resolveImageUrl(photo.url),
                    alt: photo.name,
                    onClick: function (e) {
                        e.stopPropagation();
                    },
                    onLoad: handleImageLoad,
                    onError: function (e) {
                        applyRobustFallback(
                            e.target,
                            800,
                            600,
                            "Imagen no disponible"
                        );
                    },
                    style: { display: isImageLoading ? "none" : "block" },
                })
            ),
            React.createElement(
                "button",
                {
                    className: "lightbox-nav lightbox-next",
                    onClick: function (e) {
                        e.stopPropagation();
                        resetLoading();
                        onNext();
                    },
                },
                "→"
            ),
            React.createElement(
                "button",
                {
                    className: selectClass,
                    onClick: function (e) {
                        e.stopPropagation();
                        onToggleSelect(photo);
                    },
                },
                isSelected ? "Deseleccionar" : "Seleccionar"
            ),
            React.createElement(
                "button",
                {
                    className: "lightbox-generate",
                    onClick: function (e) {
                        e.stopPropagation();
                        if (selectedPhotos.length > 0) onGenerateOrder();
                    },
                    disabled: selectedPhotos.length === 0,
                    style: { display: selectedPhotos.length === 0 ? "none" : "block" },
                },
                "Generar orden"
            )
        )
    );
}
