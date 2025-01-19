export default async function messageUpdateHandler(eventData, queryClient) {
    queryClient.setQueryData(["user",eventData.message.author._id], (prevData) => {
        return {...prevData, ...eventData.message.author}
    });
    eventData.message.author = eventData.message.author._id;

    queryClient.setQueryData(["channel",eventData.channelId, "messages"], (prevData) => {
        if(!prevData) return;

        return {
            ...prevData,
            pages: prevData.pages.map(page =>
                page.map(message => message._id === eventData.message._id ? eventData.message : message)
            ),
        };
    })
}