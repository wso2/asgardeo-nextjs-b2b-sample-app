import PatchOperation from "./patchOperation";

export interface PatchBody {
    operations: PatchOperation[]
}

export default PatchBody;
