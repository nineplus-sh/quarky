import Quark from "./Quark.jsx";

export default function QuarkList({list, demo}) {
    return list.map((quark) => <Quark demo={demo} quark={quark} key={quark._id}/>)
}