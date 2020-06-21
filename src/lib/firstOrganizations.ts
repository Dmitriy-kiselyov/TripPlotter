import { IOrganization } from '../types/organization';

let saved: IOrganization[] = [];
let isFirstCall = true;

export function rememberFirstOrganizations(organizations: IOrganization[]): void {
    if (!isFirstCall) {
        return;
    }

    isFirstCall = false;

    saved = organizations;
}

export function getFromFirstOrganizations(id: string): IOrganization | null {
    for (const org of saved) {
        if (org.id === id) {
            return org;
        }
    }

    return null;
}
