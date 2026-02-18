import axios from "axios";

export const getUploadUrl = async({
    key,
}: {
    key: string;
}) => {
    //console.log("received in api function: key: ", key)
    //console.log("received in api function: contentType:", contentType)
    const res = await axios.post(`api/s3/upload-url`, {
        key, 
    })

    //console.log("AWS url: ",res);
    return res;
}