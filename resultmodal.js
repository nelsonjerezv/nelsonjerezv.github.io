function ResultModal(props) {
    let resultMessage = props.resultMessage;
    let onClose = props.onClose;

    let isSuccess = resultMessage.type === "success";
    let modalClass = "email-modal";
    let contentClass = isSuccess
        ? "email-content result-modal-success"
        : "email-content result-modal-error";

    return React.createElement(
        "div",
        { className: modalClass, onClick: onClose },
        React.createElement(
            "div",
            {
                className: contentClass,
                onClick: function (e) {
                    e.stopPropagation();
                },
            },
            React.createElement(
                "div",
                { className: "email-header" },
                React.createElement("h2", null, resultMessage.title),
                React.createElement("p", null, resultMessage.message)
            ),
            React.createElement(
                "div",
                { className: "email-buttons" },
                React.createElement(
                    "button",
                    {
                        onClick: onClose,
                        style: {
                            background: isSuccess ? "#28a745" : "#dc3545",
                        },
                    },
                    "Aceptar"
                )
            )
        )
    );
}
