
import {createTypeStyle} from "typestyle";

export const typeStyle = createTypeStyle();

export const stylesheet = typeStyle.stylesheet({
    item: {
        backgroundColor: "#fefefe",
        color: "black",
        $nest: {
            username: {},
        },
    },
    itemNo: { },
    title: { },
    results: { },
});


