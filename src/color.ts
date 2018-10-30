export class ConnectionsDiagramHelper {
    static hslToHex(h, s, l): string {
        let r;
        let g;
        let b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1 / 2) {
                    return q;
                }
                if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                }
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return (
            '#' +
            [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
                .map(d => (d < 16 ? '0' : '') + d.toString(16))
                .join('')
        );
    }

    static hue2rgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }

    static generateRandomColor() {
        /* tslint:disable */
        return '#' + ('00000' + ((Math.random() * (1 << 24)) | 0).toString(16)).slice(-6);
    }

    static generatePalit() {
        let hueStep = 2,
            sats = [1, 0.5],
            lights = [0.5, 0.25, 0.75],
            colors = [];

        sats.forEach(saturation => {
            lights.forEach(lightness => {
                for (let hue = 0; hue <= 350; hue += hueStep) {
                    colors.push(ConnectionsDiagramHelper.hslToHex(hue / 360, saturation, lightness));
                }
            });
        });

        for (let i = colors.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [colors[i - 1], colors[j]] = [colors[j], colors[i - 1]];
        }

        return colors;
    }
}
