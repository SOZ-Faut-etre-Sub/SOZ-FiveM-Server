import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class ObjectService {
    public applyEntityMatrix = (entity: number, matrix: Float32Array) => {
        SetEntityMatrix(
            entity,
            matrix[4],
            matrix[5],
            matrix[6], // Right
            matrix[0],
            matrix[1],
            matrix[2], // Forward
            matrix[8],
            matrix[9],
            matrix[10], // Up
            matrix[12],
            matrix[13],
            matrix[14] // Position
        );
    };
}
