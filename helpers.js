// Helper de fallback robusto para imágenes
function applyRobustFallback(imgEl, w, h, text) {
    if (imgEl.dataset.fallbackApplied === "1") return;
    imgEl.dataset.fallbackApplied = "1";
    imgEl.src =
        "https://placehold.co/" +
        w +
        "x" +
        h +
        "?text=" +
        encodeURIComponent(text || "Imagen no disponible");
    imgEl.onerror = function () {
        imgEl.onerror = null;
        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="' +
            w +
            '" height="' +
            h +
            '">' +
            '<rect width="100%" height="100%" fill="#eee"/>' +
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"' +
            ' font-family="sans-serif" font-size="14" fill="#666">' +
            (text || "Imagen no disponible") +
            "</text>" +
            "</svg>";
        imgEl.src =
            "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    };
}

// Helper de normalización de URL (para portadas y fotos con rutas problemáticas)
function resolveImageUrl(u) {
    if (!u) return u;
    if (!/^https?:\/\//i.test(u)) {
        try {
            return new URL(u, window.location.origin).toString();
        } catch (e) {
            /* continúa */
        }
    }
    try {
        return encodeURI(decodeURI(u));
    } catch (e) {
        return u.indexOf(" ") >= 0 ? u.replace(/ /g, "%20") : u;
    }
}
