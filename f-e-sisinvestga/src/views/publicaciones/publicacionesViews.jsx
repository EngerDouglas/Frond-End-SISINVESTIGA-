import React from "react";
import Publicaciones from "../../components/Publicaciones/publicacionesInfo"
import Nav from "../../components/Comunes/NavAdmin";

const publicacionViews = () => {
    return(
        <div>
        <Nav></Nav>
        <Publicaciones></Publicaciones>
        </div>
    )

}

export default publicacionViews;