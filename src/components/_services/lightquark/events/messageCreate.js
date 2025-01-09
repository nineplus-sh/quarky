export default async function messageCreateHandler(eventData, queryClient) {
    queryClient.setQueryData([`user/${eventData.message.author._id}`], (prevData) => {
        return {...prevData, ...eventData.message.author}
    });
    eventData.message.author = eventData.message.author._id;

    queryClient.setQueryData([`channel/${eventData.channelId}`, "messages"], (prevData) => {
        if(!prevData) return;

        if(prevData.pages[prevData.pages.length-1].length < 50) {
            prevData.pages[prevData.pages.length-1].push(eventData.message);
            return prevData;
        } else {
            return {
                ...prevData,
                pages: [...prevData.pages, [eventData.message]],
            }
        }
    })
}