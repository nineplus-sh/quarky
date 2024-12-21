export default async function quarkUpdateHandler(eventData, queryClient) {
    queryClient.setQueryData([`quark/${eventData._id}`], (prevData) => {
        if(prevData.channels && !eventData.channels) eventData.channels = prevData.channels;
        return eventData;
    })
}