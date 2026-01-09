import { ApiProperty } from '@nestjs/swagger';
import { FavoriteStock } from '@app/modules/repositories/favorite-stock';

export class GetFavoritesResponse {
    @ApiProperty({
        type: FavoriteStock,
        isArray: true,
    })
    data: FavoriteStock[];
}
