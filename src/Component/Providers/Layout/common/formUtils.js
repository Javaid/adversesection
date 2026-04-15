const toFieldLabel = (field) =>
    field
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

export { toFieldLabel };