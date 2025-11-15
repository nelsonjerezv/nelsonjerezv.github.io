function App() {
    let [events, setEvents] = React.useState([]);
    let [selectedEvent, setSelectedEvent] = React.useState(null);
    let [selectedPhotos, setSelectedPhotos] = React.useState([]);
    let [isSelectionMode, setIsSelectionMode] = React.useState(false);
    let [lightboxIndex, setLightboxIndex] = React.useState(-1);
    let [showReview, setShowReview] = React.useState(false);
    let [reviewIndex, setReviewIndex] = React.useState(0);
    let [showEmailModal, setShowEmailModal] = React.useState(false);
    let [email, setEmail] = React.useState("");
    let [showResultModal, setShowResultModal] = React.useState(false);
    let [resultMessage, setResultMessage] = React.useState({
        type: "success",
        title: "",
        message: "",
    });
    let [emailsConfig, setEmailsConfig] = React.useState({
        adminEmail: "",
        ccEmails: [],
    });
    let [isSendingEmail, setIsSendingEmail] = React.useState(false);

    let [activePhotographer, setActivePhotographer] = React.useState(null);
    let [selectedPhotographer, setSelectedPhotographer] = React.useState(null);
    let [photographerQuery, setPhotographerQuery] = React.useState("");
    let [activeEventForPhotographer, setActiveEventForPhotographer] =
        React.useState(null);

    let [photographers, setPhotographers] = React.useState([]);
    let [shownPhotographerCard, setShownPhotographerCard] =
        React.useState(null);

    let hasSelections = selectedPhotos.length > 0;

    let lockBody = function () {
        let scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
    };
    let unlockBody = function () {
        let scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };

    let isAnyModalOpen =
        lightboxIndex !== -1 ||
        showReview ||
        showEmailModal ||
        showResultModal ||
        shownPhotographerCard;
    React.useEffect(
        function () {
            if (isAnyModalOpen) {
                lockBody();
            } else {
                unlockBody();
            }
        },
        [
            lightboxIndex,
            showReview,
            showEmailModal,
            showResultModal,
            shownPhotographerCard,
        ]
    );

    function slugify(name) {
        if (!name) return "";
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }
    function photographerUrl(name) {
        return name.replace(/\s+/g, "_");
    }
    function decodePhotographerUrl(slug) {
        return slug.replace(/_/g, " ");
    }

    function updateUrl(path) {
        const hashPath = path.startsWith("/") ? path : "/" + path;
        if (window.location.hash !== "#" + hashPath) {
            window.location.hash = hashPath;
        }
    }

    function parseAndSetState(hash) {
        const pathname = hash.replace(/^#/, "");
        if (pathname === "/" || pathname === "") {
            setSelectedEvent(null);
            setSelectedPhotographer(null);
            setPhotographerQuery("");
            setSelectedPhotos([]);
            setIsSelectionMode(false);
            setLightboxIndex(-1);
            setShowReview(false);
            setShowEmailModal(false);
            setEmail("");
            setReviewIndex(0);
            setActivePhotographer(null);
            setActiveEventForPhotographer(null);
            return true;
        }
        let parts = pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
            let type = parts[0];
            let param = parts.slice(1).join("/");
            if (type === "evento") {
                let slug = slugify(param);
                for (let i = 0; i < events.length; i++) {
                    if (slugify(events[i].name) === slug) {
                        setSelectedEvent(events[i]);
                        setSelectedPhotographer(null);
                        setPhotographerQuery("");
                        setSelectedPhotos([]);
                        setIsSelectionMode(false);
                        setLightboxIndex(-1);
                        setShowReview(false);
                        setShowEmailModal(false);
                        setEmail("");
                        setReviewIndex(0);
                        setActivePhotographer(null);
                        setActiveEventForPhotographer(null);
                        return true;
                    }
                }
                updateUrl("/");
                return false;
            } else if (type === "fotografo") {
                let decodedPhotographer = decodePhotographerUrl(param);
                if (
                    allPhotographers &&
                    allPhotographers.includes(decodedPhotographer)
                ) {
                    setSelectedPhotographer(decodedPhotographer);
                    setSelectedEvent(null);
                    setPhotographerQuery(decodedPhotographer);
                    setSelectedPhotos([]);
                    setIsSelectionMode(false);
                    setLightboxIndex(-1);
                    setShowReview(false);
                    setShowEmailModal(false);
                    setEmail("");
                    setReviewIndex(0);
                    setActivePhotographer(null);
                    setActiveEventForPhotographer(null);
                    updateUrl(
                        "/fotografo/" + photographerUrl(decodedPhotographer)
                    );
                    return true;
                }
                updateUrl("/");
                return false;
            }
            updateUrl("/");
            return false;
        }
    }

    let handleSelectEvent = function (ev) {
        setSelectedEvent(ev);
        setSelectedPhotographer(null);
        setPhotographerQuery("");
        setSelectedPhotos([]);
        setIsSelectionMode(false);
        setLightboxIndex(-1);
        setShowReview(false);
        setShowEmailModal(false);
        setEmail("");
        setReviewIndex(0);
        setActivePhotographer(null);
        setActiveEventForPhotographer(null);
        updateUrl("/evento/" + slugify(ev.name));
    };
    let openLightbox = function (idx) {
        setLightboxIndex(idx);
    };
    let closeLightbox = function () {
        setLightboxIndex(-1);
    };
    let toggleSelectionMode = function () {
        setIsSelectionMode(!isSelectionMode);
        if (!isSelectionMode) {
            setSelectedPhotos([]);
            setLightboxIndex(-1);
        }
    };
    let toggleSelect = function (photo) {
        let prevLength = selectedPhotos.length;
        let newSelected = [];
        let alreadySelected = false;
        for (let l = 0; l < selectedPhotos.length; l++) {
            if (selectedPhotos[l].id !== photo.id) {
                newSelected.push(selectedPhotos[l]);
            } else {
                alreadySelected = true;
            }
        }
        if (!alreadySelected) {
            newSelected.push(photo);
        }
        setSelectedPhotos(newSelected);
        if (prevLength === 0 && newSelected.length > 0 && !isSelectionMode) {
            setIsSelectionMode(true);
        }
        if (newSelected.length === 0) {
            setIsSelectionMode(false);
        }
    };
    let removeSelect = function (photo, resetIndex) {
        let newSelected = [];
        for (let m = 0; m < selectedPhotos.length; m++) {
            if (selectedPhotos[m].id !== photo.id) {
                newSelected.push(selectedPhotos[m]);
            }
        }
        setSelectedPhotos(newSelected);
        if (newSelected.length === 0) {
            setIsSelectionMode(false);
        }
        if (resetIndex && showReview) {
            if (newSelected.length === 0) {
                setShowReview(false);
            } else {
                setReviewIndex(0);
            }
        }
    };
    let handleConfirm = function () {
        setShowReview(false);
        setShowEmailModal(true);
    };
    let handleEmailSubmit = async function (userEmail, selectedPhotosParam) {
        setIsSendingEmail(true);

        // 1. Agrupa fotos por el nombre del fotógrafo
        let photosByPhotographer = {};
        selectedPhotosParam.forEach((photo) => {
            let pname = photo.photographer;
            if (!photosByPhotographer[pname]) photosByPhotographer[pname] = [];
            photosByPhotographer[pname].push(photo);
        });

        let contexto = selectedEvent
            ? selectedEvent.name
            : selectedPhotographer
            ? selectedPhotographer
            : "Sin especificar";

        // 2. Para cada fotógrafo, arma el mail y envíalo
        let sendPromises = Object.entries(photosByPhotographer).map(
            ([photographerName, photos]) => {
                // Busca el fotógrafo por nombre exacto en photographers.json
                let photographerInfo = photographers.find(
                    (ph) => ph.name === photographerName
                );
                if (!photographerInfo) return Promise.resolve(); // Si no lo encuentra, ignora

                let params = {
                    to_email: photographerInfo.email, // Email del fotógrafo
                    cc_emails: emailsConfig.ccEmails.join(","),
                    user_email: userEmail,
                    nombreEvento: contexto,
                    photos: photos
                        .map(function (p) {
                            let i = p.name.lastIndexOf(".");
                            return i > 0 ? p.name.substring(0, i) : p.name;
                        })
                        .join("\n"),
                };

                return emailjs.send(
                    "service_fotosEventos",
                    "template_0ntzv59",
                    params
                );
            }
        );

        // 3. Espera que todos los mails se envíen
        try {
            await Promise.all(sendPromises);
            setIsSendingEmail(false);
            setResultMessage({
                type: "success",
                title: "¡Orden enviada!",
                message:
                    "Te contactaremos pronto con los detalles de tu orden.",
            });
            setShowResultModal(true);
            setShowEmailModal(false);
        } catch (error) {
            setIsSendingEmail(false);
            setResultMessage({
                type: "error",
                title: "Error al enviar",
                message:
                    "No pudimos procesar tu orden. Por favor, intenta de nuevo.",
            });
            setShowResultModal(true);
        }
    };

    let handleGenerateFromLightbox = function () {
        setLightboxIndex(-1);
        setShowReview(true);
        setReviewIndex(0);
    };

    React.useEffect(
        function () {
            if (lightboxIndex !== -1) {
                function handleKeyDown(e) {
                    if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        prevPhoto();
                    } else if (e.key === "ArrowRight") {
                        e.preventDefault();
                        nextPhoto();
                    }
                }
                window.addEventListener("keydown", handleKeyDown);
                return function () {
                    window.removeEventListener("keydown", handleKeyDown);
                };
            }
        },
        [lightboxIndex]
    );
    React.useEffect(() => {
        if (events.length > 0) {
            parseAndSetState(window.location.hash);
        }
    }, [events, photographers]);
    React.useEffect(() => {
        function handleHashChange() {
            // SOLO ejecuta si hay eventos cargados
            if (events.length > 0) {
                parseAndSetState(window.location.hash);
            }
        }
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, [events, photographers]); // <- IMPORTANTE: depende de eventos!

    React.useEffect(function () {
        fetch("events.json")
            .then((res) => res.json())
            .then(setEvents)
            .catch(() => setEvents([]));
    }, []);
    React.useEffect(function () {
        fetch("emails.json")
            .then((res) => res.json())
            .then(setEmailsConfig)
            .catch(() => setEmailsConfig({ adminEmail: "", ccEmails: [] }));
    }, []);
    React.useEffect(function () {
        fetch("photographers.json")
            .then((res) => res.json())
            .then(setPhotographers)
            .catch(() => setPhotographers([]));
    }, []);
    React.useEffect(
        function () {
            if (selectedEvent) {
                document.title = selectedEvent.name;
            } else if (selectedPhotographer) {
                document.title = selectedPhotographer;
            } else {
                document.title = "Eventos disponibles";
            }
        },
        [selectedEvent, selectedPhotographer]
    );

    let allEventsPhotos = [];
    for (let i = 0; i < events.length; i++) {
        let ev = events[i];
        if (ev.photos && ev.photos.length) {
            for (let j = 0; j < ev.photos.length; j++) {
                allEventsPhotos.push(ev.photos[j]);
            }
        }
    }
    let allPhotographersSet = {};
    for (let k = 0; k < allEventsPhotos.length; k++) {
        let ph = allEventsPhotos[k].photographer;
        if (ph) {
            allPhotographersSet[ph] = true;
        }
    }
    let allPhotographers = Object.keys(allPhotographersSet);

    let eventsForPhotographer = [];
    if (selectedPhotographer && events) {
        eventsForPhotographer = events.filter(
            (ev) =>
                ev.photos &&
                ev.photos.some(
                    (photo) => photo.photographer === selectedPhotographer
                )
        );
    }

    let currentPhotos = [];
    if (selectedEvent && selectedEvent.photos) {
        currentPhotos = selectedEvent.photos;
        if (activePhotographer) {
            currentPhotos = currentPhotos.filter(function (p) {
                return p.photographer === activePhotographer;
            });
        }
    } else if (selectedPhotographer) {
        for (let m = 0; m < allEventsPhotos.length; m++) {
            if (allEventsPhotos[m].photographer === selectedPhotographer) {
                currentPhotos.push(allEventsPhotos[m]);
            }
        }
        if (activeEventForPhotographer) {
            currentPhotos = currentPhotos.filter((photo) => {
                const ev = events.find(
                    (ev) =>
                        ev.photos && ev.photos.some((p) => p.id === photo.id)
                );
                return ev && ev.name === activeEventForPhotographer;
            });
        }
    }
    let photos = currentPhotos;

    let photoLength = photos.length;
    let prevPhoto = function () {
        let newIndex = lightboxIndex - 1;
        if (newIndex < 0) {
            newIndex = photoLength - 1;
        }
        setLightboxIndex(newIndex);
    };
    let nextPhoto = function () {
        let newIndex = lightboxIndex + 1;
        if (newIndex >= photoLength) {
            newIndex = 0;
        }
        setLightboxIndex(newIndex);
    };

    let carouselItems = [];
    for (let n = 0; n < events.length; n++) {
        let ev = events[n];
        let firstPhoto =
            ev.photos && ev.photos.length > 0 ? ev.photos[0].url : "";
        let firstPhotoUrl = resolveImageUrl(firstPhoto);
        let eventCardElements = [
            React.createElement(
                "div",
                {
                    className: "card-titulo-evento",
                    title: ev.name || "Evento sin nombre",
                    key: "title",
                },
                ev.name || "Evento sin nombre"
            ),
        ];
        if (ev.fecha) {
            eventCardElements.push(
                React.createElement(
                    "div",
                    { className: "card-data-evento", key: "date" },
                    React.createElement(
                        "span",
                        {
                            className: "icon-eve-home",
                            style: { fontSize: "16px", marginRight: "0.5rem" },
                        },
                        "📅"
                    ),
                    ev.fecha
                )
            );
        }
        if (ev.ubicacion) {
            eventCardElements.push(
                React.createElement(
                    "div",
                    { className: "card-cid-evento", key: "location" },
                    React.createElement(
                        "span",
                        {
                            className: "icon-eve-home",
                            style: { fontSize: "16px", marginRight: "0.5rem" },
                        },
                        "📍"
                    ),
                    React.createElement(
                        "span",
                        { className: "nome-cidade-card" },
                        ev.ubicacion
                    )
                )
            );
        }
        let eventKey = ev.id || ev.name || "event-" + n;
        carouselItems.push(
            React.createElement(
                "div",
                {
                    className: "carousel-item",
                    key: eventKey,
                    onClick: () => {
                        updateUrl("/evento/" + slugify(ev.name));
                    },
                },
                React.createElement(
                    "div",
                    { className: "foto" },
                    React.createElement("img", {
                        src: firstPhotoUrl,
                        alt: `Portada ${ev.name || "Evento"}`,
                        onError: function (e) {
                            applyRobustFallback(
                                e.target,
                                260,
                                156,
                                "Imagen no disponible"
                            );
                        },
                    })
                ),
                React.createElement(
                    "div",
                    { className: "card-eventos" },
                    eventCardElements
                )
            )
        );
    }

    // --- Carrusel de fotógrafos asociados ---
    let photographersRow = null;
    if (photographers && photographers.length > 0) {
        photographersRow = [
            React.createElement(
                "h2",
                { key: "h2-photogs", className: "events-header" },
                "Fotógrafos asociados"
            ),
            React.createElement(
                "div",
                { key: "carousel-photogs", className: "carousel" },
                photographers.map(function (photog, idx) {
                    return React.createElement(
                        "div",
                        {
                            key: "photocard-" + (photog.name || idx),
                            className: "carousel-item",
                            onClick: function () {
                                setShownPhotographerCard(photog);
                            },
                        },
                        React.createElement(
                            "div",
                            { className: "foto" },
                            photog.backgroundImg
                                ? React.createElement("img", {
                                      src: photog.backgroundImg,
                                      alt: "Fondo de " + photog.name,
                                      style: { objectFit: "cover" },
                                  })
                                : React.createElement("div", {
                                      style: {
                                          width: "100%",
                                          height: "100%",
                                          background:
                                              "linear-gradient(90deg, #ED1ABE 0%, #31006B 100%)",
                                          borderTopLeftRadius: 10,
                                          borderTopRightRadius: 10,
                                      },
                                  })
                        ),
                        React.createElement(
                            "div",
                            { className: "card-eventos" },
                            [
                                React.createElement(
                                    "div",
                                    {
                                        className: "card-titulo-evento",
                                        title: photog.name,
                                        key: "title",
                                    },
                                    photog.name || "Fotógrafo sin nombre"
                                ),
                                photog.bio
                                    ? React.createElement(
                                          "div",
                                          {
                                              className: "card-cid-evento",
                                              key: "bio",
                                          },
                                          photog.bio
                                      )
                                    : null,
                            ]
                        )
                    );
                })
            ),
        ];
    }

    // Buscador global por fotógrafo (vista principal, debajo del carrusel)
    let searchRow = null;
    if (!selectedEvent && !selectedPhotographer) {
        searchRow = React.createElement(
            "div",
            { key: "search-row", className: "search-row" },
            React.createElement(
                "label",
                { htmlFor: "photographer-search", className: "search-label" },
                "Buscar por fotógrafo"
            ),
            React.createElement("input", {
                id: "photographer-search",
                list: "photographers-list",
                className: "search-input",
                placeholder: "Escribe un nombre...",
                value: photographerQuery,
                onChange: function (e) {
                    let val = e.target.value;
                    setPhotographerQuery(val);
                    for (let i = 0; i < allPhotographers.length; i++) {
                        if (allPhotographers[i] === val) {
                            setSelectedPhotographer(val);
                            setSelectedEvent(null);
                            setSelectedPhotos([]);
                            setIsSelectionMode(false);
                            setLightboxIndex(-1);
                            setShowReview(false);
                            setShowEmailModal(false);
                            setEmail("");
                            setReviewIndex(0);
                            setActivePhotographer(null);
                            setActiveEventForPhotographer(null);
                            // USAR "_" EN LA RUTA
                            updateUrl("/fotografo/" + photographerUrl(val));
                            break;
                        }
                    }
                },
            }),
            React.createElement(
                "datalist",
                { id: "photographers-list" },
                allPhotographers.map(function (ph) {
                    return React.createElement("option", {
                        key: "opt-" + ph,
                        value: ph,
                    });
                })
            )
        );
    }

    let filtersRow = null;
    if (selectedEvent) {
        let photographers = [];
        if (selectedEvent.photos && selectedEvent.photos.length) {
            let setPh = {};
            for (let p = 0; p < selectedEvent.photos.length; p++) {
                let ph = selectedEvent.photos[p].photographer;
                if (ph) setPh[ph] = true;
            }
            photographers = Object.keys(setPh);
        }
        filtersRow = React.createElement(
            "div",
            { key: "filters-row", className: "filters-row" },
            React.createElement(
                "button",
                {
                    key: "all",
                    className:
                        "filter-button" +
                        (activePhotographer === null ? " active" : ""),
                    onClick: function () {
                        setActivePhotographer(null);
                    },
                },
                "Todas las fotografías"
            ),
            photographers.map(function (ph) {
                return React.createElement(
                    "button",
                    {
                        key: "ph-" + ph,
                        className:
                            "filter-button" +
                            (activePhotographer === ph ? " active" : ""),
                        onClick: function () {
                            setActivePhotographer(ph);
                        },
                    },
                    "Fotos de " + ph
                );
            })
        );
    }
    let eventsRow = null;
    if (selectedPhotographer && eventsForPhotographer.length > 0) {
        eventsRow = React.createElement(
            "div",
            { className: "filters-row" },
            React.createElement(
                "button",
                {
                    className:
                        "filter-button" +
                        (activeEventForPhotographer === null ? " active" : ""),
                    onClick: function () {
                        setActiveEventForPhotographer(null);
                    },
                },
                "Todos los eventos"
            ),
            eventsForPhotographer.map(function (ev) {
                return React.createElement(
                    "button",
                    {
                        key: ev.name,
                        className:
                            "filter-button" +
                            (activeEventForPhotographer === ev.name
                                ? " active"
                                : ""),
                        onClick: function () {
                            setActiveEventForPhotographer(ev.name);
                        },
                    },
                    ev.name
                );
            })
        );
    }
    let selectionControls = null;
    if (isSelectionMode || hasSelections) {
        selectionControls = React.createElement(
            "button",
            { onClick: toggleSelectionMode },
            isSelectionMode
                ? "Cancelar selección"
                : "Seleccionar imágenes para orden"
        );
        if (hasSelections) {
            selectionControls = [
                React.createElement(
                    "button",
                    { key: "toggle", onClick: toggleSelectionMode },
                    isSelectionMode
                        ? "Cancelar selección"
                        : "Seleccionar imágenes para orden"
                ),
                React.createElement(
                    "span",
                    { key: "count", className: "selected-count" },
                    `${selectedPhotos.length} ${
                        selectedPhotos.length === 1
                            ? "imagen seleccionada"
                            : "imágenes seleccionadas"
                    }`
                ),
                React.createElement(
                    "button",
                    {
                        key: "generate",
                        onClick: function () {
                            setShowReview(true);
                            setReviewIndex(0);
                        },
                    },
                    "Generar orden"
                ),
            ];
        }
    } else {
        selectionControls = React.createElement(
            "button",
            { onClick: toggleSelectionMode },
            "Seleccionar imágenes para orden"
        );
    }
    let gallery = null;
    if (photos.length > 0) {
        gallery = React.createElement(Gallery, {
            photos: photos,
            isSelectionMode: isSelectionMode,
            hasSelections: hasSelections,
            selectedPhotos: selectedPhotos,
            onToggleSelect: toggleSelect,
            onOpenLightbox: openLightbox,
        });
    } else {
        gallery = React.createElement("p", null, "No hay fotos para mostrar.");
    }
    let lightbox = null;
    if (lightboxIndex !== -1 && photos.length > 0) {
        lightbox = React.createElement(Lightbox, {
            photos: photos,
            index: lightboxIndex,
            onClose: closeLightbox,
            onPrev: prevPhoto,
            onNext: nextPhoto,
            onToggleSelect: toggleSelect,
            onGenerateOrder: handleGenerateFromLightbox,
            selectedPhotos: selectedPhotos,
        });
    }
    let reviewModal = null;
    if (showReview && selectedPhotos.length > 0) {
        reviewModal = React.createElement(ReviewModal, {
            selectedPhotos: selectedPhotos,
            reviewIndex: reviewIndex,
            onClose: function () {
                setShowReview(false);
            },
            onDeselect: removeSelect,
            onPrev: function () {
                let newIndex = reviewIndex - 1;
                if (newIndex < 0) {
                    newIndex = selectedPhotos.length - 1;
                }
                setReviewIndex(newIndex);
            },
            onNext: function () {
                let newIndex = reviewIndex + 1;
                if (newIndex >= selectedPhotos.length) {
                    newIndex = 0;
                }
                setReviewIndex(newIndex);
            },
            onConfirm: handleConfirm,
        });
    }
    let emailModal = null;
    if (showEmailModal) {
        emailModal = React.createElement(EmailModal, {
            email: email,
            setEmail: setEmail,
            onClose: function () {
                setShowEmailModal(false);
            },
            onSubmit: handleEmailSubmit,
            selectedPhotos: selectedPhotos,
            isSendingEmail: isSendingEmail,
        });
    }
    let resultModal = null;
    if (showResultModal) {
        resultModal = React.createElement(ResultModal, {
            resultMessage: resultMessage,
            onClose: function () {
                setShowResultModal(false);
                setIsSelectionMode(false);
                setSelectedPhotos([]);
                setEmail("");
            },
        });
    }
    let photographerModal = null;
    if (shownPhotographerCard) {
        photographerModal = React.createElement(
            "div",
            {
                className: "modal-modalprofile",
                onClick: function () {
                    setShownPhotographerCard(null);
                },
            },
            React.createElement(
                "div",
                {
                    onClick: function (e) {
                        e.stopPropagation();
                    },
                },
                React.createElement(CardProfile, shownPhotographerCard),
                React.createElement(
                    "button",
                    {
                        onClick: function () {
                            setShownPhotographerCard(null);
                        },
                        "aria-label": "Cerrar perfil",
                    },
                    "×"
                )
            )
        );
    }
    let content = null;
    if (!selectedEvent && !selectedPhotographer) {
        content = [
            React.createElement(
                "header",
                { key: "header" },
                React.createElement("h1", null, "Galería de Eventos")
            ),
            React.createElement(
                "h2",
                { key: "h2", className: "events-header" },
                "Eventos disponibles"
            ),
            React.createElement(
                "div",
                { key: "carousel", className: "carousel" },
                carouselItems
            ),
            ...(photographersRow ? photographersRow : []),
            searchRow,
        ];
    } else if (selectedEvent) {
        content = [
            React.createElement(
                "header",
                { key: "header" },
                React.createElement(
                    "h1",
                    null,
                    selectedEvent.name || "Evento sin nombre"
                )
            ),
            React.createElement(
                "div",
                { key: "header-row", className: "header-row" },
                React.createElement(
                    "button",
                    {
                        key: "back",
                        className: "back-button",
                        onClick: function () {
                            setSelectedEvent(null);
                            setSelectedPhotographer(null);
                            setPhotographerQuery("");
                            setActivePhotographer(null);
                            setActiveEventForPhotographer(null);
                            updateUrl("/");
                        },
                    },
                    "Volver a eventos"
                ),
                React.createElement(
                    "div",
                    {
                        key: "controls",
                        className: "selection-controls-wrapper",
                    },
                    selectionControls
                )
            ),
            filtersRow,
            gallery,
        ];
    } else if (selectedPhotographer) {
        let currentPhotographerObj = photographers.find(function (ph) {
            return ph && ph.name === selectedPhotographer;
        });
        content = [
            React.createElement(
                "header",
                { key: "header" },
                React.createElement("h1", null, [
                    "Fotos de ",
                    React.createElement(
                        "a",
                        {
                            key: "link",
                            href: "#",
                            style: {
                                color: "var(--color-primary)",
                                textDecoration: "underline dotted",
                                cursor: "pointer",
                            },
                            onClick: function (e) {
                                e.preventDefault();
                                setShownPhotographerCard(
                                    currentPhotographerObj
                                );
                            },
                        },
                        selectedPhotographer
                    ),
                ])
            ),
            React.createElement(
                "div",
                { key: "header-row", className: "header-row" },
                React.createElement(
                    "button",
                    {
                        key: "back",
                        className: "back-button",
                        onClick: function () {
                            setSelectedPhotographer(null);
                            setPhotographerQuery("");
                            setSelectedPhotos([]);
                            setIsSelectionMode(false);
                            setLightboxIndex(-1);
                            setShowReview(false);
                            setShowEmailModal(false);
                            setEmail("");
                            setReviewIndex(0);
                            setActiveEventForPhotographer(null);
                            updateUrl("/");
                        },
                    },
                    "Volver a eventos"
                ),
                React.createElement(
                    "div",
                    {
                        key: "controls",
                        className: "selection-controls-wrapper",
                    },
                    selectionControls
                )
            ),
            eventsRow,
            gallery,
        ];
    }
    return React.createElement(
        "div",
        null,
        content,
        lightbox,
        reviewModal,
        emailModal,
        resultModal,
        photographerModal
    );
}
let root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
