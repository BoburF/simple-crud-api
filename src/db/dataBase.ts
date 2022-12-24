import {v4 as uuid} from "uuid"
import UserInterface from "../interfaces/user"
const dbVariable: UserInterface[] = []

class DataBase {
    find(){
        return {msg: JSON.stringify(dbVariable), status: 200}
    }

    findOne(id: string){
        const user = dbVariable.find(user => user.id === id)
        if(!user){
            return 
        }
    }
}

export default DataBase