function EmailModal(props) {
    let email = props.email;
    let setEmail = props.setEmail;
    let onClose = props.onClose;
    let onSubmit = props.onSubmit;
    let selectedPhotos = props.selectedPhotos;
    let isSendingEmail = props.isSendingEmail;

    let handleChange = function (e) {
        setEmail(e.target.value);
    };
    let isValidEmail = function (emailStr) {
        return emailStr && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };
    let submitDisabled = !isValidEmail(email) || isSendingEmail;

    let loadingOverlay = isSendingEmail
        ? React.createElement(
              "div",
              { className: "loading-overlay" },
              React.createElement("div", { className: "loading-spinner" })
          )
        : null;

    return React.createElement(
        "div",
        { className: "email-modal", onClick: isSendingEmail ? null : onClose },
        React.createElement(
            "div",
            {
                className: "email-content",
                onClick: function (e) {
                    e.stopPropagation();
                },
            },
            React.createElement(
                "div",
                { className: "email-header" },
                React.createElement(
                    "h2",
                    null,
                    "Ingresa tu email para la orden"
                ),
                React.createElement(
                    "p",
                    null,
                    "Te contactaremos cuando la orden sea recibida por el equipo."
                )
            ),
            React.createElement("input", {
                type: "email",
                className: "email-input",
                placeholder: "tu@email.com",
                value: email,
                onChange: handleChange,
                disabled: isSendingEmail,
            }),
            React.createElement(
                "div",
                { className: "email-buttons" },
                React.createElement(
                    "button",
                    {
                        className: "cancel",
                        onClick: onClose,
                        disabled: isSendingEmail,
                    },
                    "Cancelar"
                ),
                React.createElement(
                    "button",
                    {
                        className: "submit",
                        onClick: function () {
                            if (!submitDisabled)
                                onSubmit(email, selectedPhotos);
                        },
                        disabled: submitDisabled,
                    },
                    isSendingEmail ? "Enviando..." : "Enviar orden"
                )
            ),
            loadingOverlay
        )
    );
}
