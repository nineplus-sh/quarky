import GenericQuark from "../../../nav/GenericQuark.jsx";

export default function Quark({quark}) {
    if(quark._id === "000000000000000000000000") return;
    return <GenericQuark link={`/lq_${quark.id}`} icon={quark.iconUri} />
}