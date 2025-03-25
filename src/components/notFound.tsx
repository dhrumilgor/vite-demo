import { Link } from "react-router-dom";

const NotFoundComponent = ()=>{
    return (
        <>
        <h2>Not Found</h2>
        <Link to="/" className="btn btn-primary">Home</Link>
        </>
    )
}
export default NotFoundComponent;