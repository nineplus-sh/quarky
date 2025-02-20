import QuarkSettingsOverview from "./QuarkSettingsOverview.jsx";
import QuarkSettingsDelete from "./QuarkSettingsDelete.jsx";

export default function QuarkSettingsArea({area, data}) {
    if(area === "overview") {
        return <QuarkSettingsOverview quarkId={data.quarkId}/>
    } else if(area === "delete") {
        return <QuarkSettingsDelete quarkId={data.quarkId}/>
    }
}