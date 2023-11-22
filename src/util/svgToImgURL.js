export default function svgToImgURL(svg) {
    console.log(svg)
    return "data:image/svg+xml;base64," + btoa(svg);
}