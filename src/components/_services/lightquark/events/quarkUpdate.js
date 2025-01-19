export default async function quarkUpdateHandler(eventData, queryClient) {
    queryClient.setQueryData(["quark",eventData.quark._id], (prevData) => {
        return {...prevData, ...eventData.quark};
    })
}