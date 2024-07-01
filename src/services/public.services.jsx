import { client } from "../utils/client.utils"


 export const fetchQuestions = async () => {
    const res = await client.get('api/get/getAllQuestions/1')
    return res;

}