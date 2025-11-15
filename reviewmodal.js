function ReviewModal(props) {
    let selectedPhotos = props.selectedPhotos;
    let reviewIndex = props.reviewIndex;
    let onClose = props.onClose;
    let onDeselect = props.onDeselect;
    let onPrev = props.onPrev;
    let onNext = props.onNext;
    let onConfirm = props.onConfirm;
    let [isImageLoading, setIsImageLoading] = React.useState(true);
    let [touchStart, setTouchStart] = React.useState(null);
    let [touchEnd, setTouchEnd] = React.useState(null);

    if (!selectedPhotos || selectedPhotos.length === 0) return null;
    let photo = selectedPhotos[reviewIndex];
    if (!photo) return null;

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
        } else if (distance < -50) {
            resetLoading();
            onPrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    let navButtons = null;
    if (selectedPhotos.length > 1) {
        navButtons = [
            React.createElement(
                "button",
                {
                    key: "prev-nav",
                    className: "review-nav review-prev",
                    onClick: function (e) {
                        e.stopPropagation();
                        resetLoading();
                        onPrev();
                    },
                },
                "←"
            ),
            React.createElement(
                "button",
                {
                    key: "next-nav",
                    className: "review-nav review-next",
                    onClick: function (e) {
                        e.stopPropagation();
                        resetLoading();
                        onNext();
                    },
                },
                "→"
            ),
        ];
    }

    return React.createElement(
        "div",
        {
            className: "review-modal",
            onClick: onClose,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        React.createElement(
            "div",
            {
                className: "review-content",
                onClick: function (e) {
                    e.stopPropagation();
                },
            },
            React.createElement(
                "div",
                { className: "review-scrollable" },
                React.createElement(
                    "div",
                    { className: "review-header" },
                    React.createElement(
                        "h2",
                        null,
                        "Confirma tu selección de imágenes"
                    ),
                    React.createElement(
                        "h2",
                        null,
                        selectedPhotos.length === 1
                            ? `${selectedPhotos.length} imagen seleccionada`
                            : `${selectedPhotos.length} imágenes seleccionadas`
                    )
                ),
                React.createElement(
                    "div",
                    {
                        className: "review-image-container",
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
                        src: photo.url,
                        alt: photo.name,
                        className: "review-image",
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
                    }),
                    navButtons
                ),
                React.createElement(
                    "div",
                    { className: "review-footer" },
                    React.createElement(
                        "button",
                        {
                            className: "review-deselect",
                            onClick: function (e) {
                                e.stopPropagation();
                                onDeselect(photo, true);
                            },
                        },
                        "Deseleccionar"
                    ),
                    React.createElement(
                        "div",
                        { className: "review-buttons" },
                        React.createElement(
                            "button",
                            { onClick: onClose },
                            "Volver"
                        ),
                        React.createElement(
                            "button",
                            { onClick: onConfirm },
                            "Confirmar"
                        )
                    )
                )
            )
        )
    );
}
