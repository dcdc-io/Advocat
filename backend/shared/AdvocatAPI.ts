export interface ICaller {
    name: string
}

export default interface IAdvocatAPI {
    queryCallers({query:any}:any): Promise<ICaller[]>
}