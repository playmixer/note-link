import React from "react";

import arrowRight from "./arrow_forward_black_24dp.svg"
import link from "./link_black_24dp.svg"
import close from "./close_black_24dp.svg"
import add from "./add_black_24dp.svg"
import remove from "./delete_black_24dp.svg"
import bold from "./format_bold_black_24dp.svg"
import italic from "./format_italic_black_24dp.svg"
import underlined from "./format_underlined_black_24dp.svg"
import code from "./code_black_24dp.svg"
import looksOne from "./looks_one_black_24dp.svg"
import looksTwo from "./looks_two_black_24dp.svg"
import quote from "./format_quote_black_24dp.svg"
import formatListNumber from "./format_list_numbered_black_24dp.svg"
import formatListBullet from "./format_list_bulleted_black_24dp.svg"
import alignLeft from "./format_align_left_black_24dp.svg"
import alignCenter from "./format_align_center_black_24dp.svg"
import alignRight from "./format_align_right_black_24dp.svg"
import alignJustify from "./format_align_justify_black_24dp.svg"
import save from "./save_black_24dp.svg"


const Images = {
    arrowRight: <img src={arrowRight}/>,
    link: <img src={link}/>,
    close: <img src={close}/>,
    add : <img src={add}/>,
    remove: <img src={remove}/>,
    save: <img src={save}/>,
    richText: {
        bold: <img src={bold}/>,
        italic: <img src={italic}/>,
        underlined: <img src={underlined}/>,
        code: <img src={code}/>,
        looksOne: <img src={looksOne}/>,
        looksTwo: <img src={looksTwo}/>,
        quote: <img src={quote}/>,
        formatListNumber: <img src={formatListNumber}/>,
        formatListBullet: <img src={formatListBullet}/>,
        alignLeft: <img src={alignLeft}/>,
        alignCenter: <img src={alignCenter}/>,
        alignRight: <img src={alignRight}/>,
        alignJustify: <img src={alignJustify}/>,
    }
}

export default Images
