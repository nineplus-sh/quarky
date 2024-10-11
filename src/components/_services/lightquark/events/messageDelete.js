export default async function messageDeleteHandler(eventData, queryClient) {
    queryClient.setQueryData([`channel/${eventData.channelId}`, "messages"], (prevData) => {
        if(!prevData) return;

        return {
            ...prevData,
            pages: prevData.pages.map(page =>
                page.filter(message => message._id !== eventData.message._id)
            ),
        };
    })
}