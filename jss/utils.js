
function formatZero(num, len) {
    if (String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
}

function getString(id) {
    return $.i18n.map[id];
}

function formatTime(t) {
    if (t < 0) {
        return 'error';
    }

    const times = Math.floor(t);
    if (t > 86400) {
        const d = Math.floor(times / 86400);
        const gap = times % 86400;
        const h = Math.floor(gap / 3600);
        const m = Math.floor((gap % 3600) / 60);
        // const s = gap % 60;
        return d + "D " + h + "h " + m + "m";
    } else {
        const h = Math.floor(times / 3600);
        const m = Math.floor((times % 3600) / 60);
        const s = times % 60;
        return h + "h " + m + "m " + ' ' + + s + "s";
    }
    // console.log("formatFomoTime : "+t)



}
