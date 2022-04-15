export function getComputedStyle(element) {
    return (window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle);
}
