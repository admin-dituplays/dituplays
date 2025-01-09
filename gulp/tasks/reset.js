// import {deleteAsync} from "del"
// export const reset = () => {
//     return deleteAsync(['dist'])
// }

import del from "del";
export const reset = () => {
    return del(app.path.clean);
}