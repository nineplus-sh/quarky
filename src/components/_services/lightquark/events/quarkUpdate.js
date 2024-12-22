export default async function quarkUpdateHandler(eventData, queryClient) {
    queryClient.setQueryData([`quark/${eventData.quark._id}`], (prevData) => {
        if(prevData?.channels && !eventData.quark.channels) eventData.quark.channels = prevData.channels;
        return eventData.quark;
    })
}