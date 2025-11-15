function CardProfile({ backgroundImg, profileImg, name, bio, social = {}, onClose }) {
    // Iconos soportados (FontAwesome)
    const ICONS = {
        x: "fab fa-x-twitter",
        instagram: "fab fa-instagram",
        linkedin: "fab fa-linkedin",
        youtube: "fab fa-youtube",
    };
    const ICON_ORDER = ["twitter", "x", "instagram", "linkedin", "youtube"];
    const DEFAULT_SVG = (
        <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="38" r="20" fill="#DDD" />
            <ellipse cx="50" cy="75" rx="28" ry="18" fill="#DDD" />
        </svg>
    );
    return (
        <div className="cardprofile-container">
            {backgroundImg ? (
                <div className="cardprofile-bg-img">
                    <img
                        src={backgroundImg}
                        alt="background"
                        className="cardprofile-bg-image"
                    />
                </div>
            ) : (
                <div className="cardprofile-bg-gradient"></div>
            )}
            <div className="cardprofile-profile-img">
                {profileImg ? (
                    <img
                        src={profileImg}
                        alt="profile"
                        className="cardprofile-profile-pic"
                    />
                ) : (
                    <div className="cardprofile-profile-pic cardprofile-default-avatar">
                        {DEFAULT_SVG}
                    </div>
                )}
            </div>
            <div className="cardprofile-profile-info">
                <h2 className="cardprofile-name">{name}</h2>
                {bio && bio.trim() ? (
                    <p className="cardprofile-bio">{bio}</p>
                ) : null}
            </div>
            <button
                className="cardprofile-fotos-btn"
                onClick={() => {
                    window.location.hash =
                        "/fotografo/" + name.replace(/\s+/g, "_");
                    if (onClose) onClose(); // Cierra el CardProfile/modal
                }}
            >
                Ver fotos
            </button>
            {ICON_ORDER.some((platform) => ICONS[platform]) && (
                <div className="cardprofile-section-title">Redes</div>
            )}
            <div className="cardprofile-social-links">
                {ICON_ORDER.filter((platform) => ICONS[platform]).map(
                    (platform) => {
                        const url = social[platform];
                        const iconClass = ICONS[platform];
                        if (url) {
                            return (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cardprofile-social-active"
                                >
                                    <i className={iconClass}></i>
                                </a>
                            );
                        }
                    }
                )}
            </div>
        </div>
    );
}
