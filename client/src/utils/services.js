export const baseUrl = "http://localhost:5000/api"

export const postRequest = async (url, body) => {
    const respone = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body
    })

    const data = await respone.json();

    if(!respone.ok){
        let message

        if(data?.message){
            message = data.message;
        }
        else{
            message = data;
        }

        return {error: true, message};
    }
        

    return data;
};

export const getRequest = async (url) => {

    const respone = await fetch(url);

    const data = await respone.json();

    if(!respone){
        let message = "An error occured.."

        if(data?.message){
            message = data.message;
        }

        return {error: true, message};
    }

    return data;
}