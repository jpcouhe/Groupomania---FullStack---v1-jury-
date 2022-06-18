export interface Theme {
    name: string;
    properties: any;
}

export const light: Theme = {
    name: "light",
    properties: {
        "--primary": "#fd2d01",
        "--secondary": "#093167",
        "--tertiary": "#ffd7d7",
        "--background-white": "#FFF",
        "--background-light": "#f6f6f6",
        "--background-dark": "#eaeaea",
        "--background-darkest": "#5c7d99",
        "--color_text-title": "#433a3a",
        "--color_text-button": "#fff",
        "--alert": "#FF0000",
    },
};

export const dark: Theme = {
    name: "dark",
    properties: {
        "--primary": "#fd2d01",
        "--secondary": "#093167",
        "--tertiary": "#ffd7d7",
        "--background-white": "#616e7c",
        "--background-light": "#1f2933",
        "--background-dark": "#eaeaea",
        "--background-darkest": "#5c7d99",
        "--color_text-title": "#e4e7eb",
        "--color_text-button": "#fff",
        "--alert": "#FF0000",
    },
};
