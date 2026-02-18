import axios from "axios";

export const getUploadUrl = async({
    key,
    
}: {
    key: string;
}) => {
    const res = await axios.post(`api/s3/upload-url`, {
        key, 
    })

    return res;
}