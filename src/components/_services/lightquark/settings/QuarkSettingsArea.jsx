import QuarkSettingsOverview from "./QuarkSettingsOverview.jsx";

export default function QuarkSettingsArea({area, data}) {
    if(area === "overview") {
        return <QuarkSettingsOverview quarkId={data.quarkId}/>
    }
}