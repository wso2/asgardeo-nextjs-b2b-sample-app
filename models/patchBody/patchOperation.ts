export interface PatchOperation {
    operation?: string,
    op?: string,
    path: string,
    value?: string | string[] | boolean
}

export default PatchOperation;
