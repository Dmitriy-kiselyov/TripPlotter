import { IMapCoords} from '../components/Map/types';
import { IOrganization } from '../types/organization';

export function getMapCoords(organizations: IOrganization[]): IMapCoords[] {
    return organizations.map(organization => {
        const { coordinates } = organization.geometry;

        return {
            coords: [coordinates[1], coordinates[0]],
            text: organization.name,
        };
    });
}
