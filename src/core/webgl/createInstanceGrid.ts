export interface InstanceGridData {
    instanceCount: number
    columns: number
    rows: number
    offsets: Float32Array
    uvs: Float32Array
}

export function createInstanceGrid(viewportWidth: number, viewportHeight: number,cellSize: number): InstanceGridData {
    const columns = Math.ceil(viewportWidth / cellSize)
    const rows = Math.ceil(viewportHeight / cellSize)
    const instanceCount = columns * rows

    const offsets = new Float32Array(instanceCount * 2);
    const uvs = new Float32Array(instanceCount * 2);

    const gridWidth = columns * cellSize;
    const gridHeight = rows * cellSize;
    const startX = -gridWidth / 2 + cellSize / 2;
    const startY = gridHeight / 2 - cellSize / 2;

    let i = 0
    for (let row = 0; row < rows; row++) {
        for(let col = 0 ; col < columns; col++) {
            const x = startX + col * cellSize
            const y = startY - row * cellSize

            offsets[i * 2] = x
            offsets[i * 2 + 1] = y

            uvs[i * 2] = col / (columns - 1 || 1);
            uvs[i * 2 + 1] = 1.0 - row / (rows - 1 || 1);

            i++;
        }
    }

    return { instanceCount, columns, rows, offsets, uvs };
}